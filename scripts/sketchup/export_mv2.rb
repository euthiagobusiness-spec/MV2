require "fileutils"
require "json"
require "sketchup.rb"

module MV2
  module SketchupExport
    extend self

    INCHES_TO_METERS = 0.0254
    POLL_SECONDS = 1.0
    TIMEOUT_SECONDS = 300

    def vector_to_meters(value)
      value.to_a.map { |coordinate| coordinate.to_f * INCHES_TO_METERS }
    end

    def camera_data(camera)
      {
        eye_m: vector_to_meters(camera.eye),
        target_m: vector_to_meters(camera.target),
        up: camera.up.to_a.map(&:to_f),
        direction: camera.direction.to_a.map(&:to_f),
        fov: camera.fov,
        perspective: camera.perspective?
      }
    end

    def entity_counts(entities, counts, visited_definitions)
      entities.each do |entity|
        type = entity.typename
        counts[type] += 1
        counts["hidden"] += 1 if entity.respond_to?(:hidden?) && entity.hidden?

        if entity.is_a?(Sketchup::Group)
          entity_counts(entity.entities, counts, visited_definitions)
        elsif entity.is_a?(Sketchup::ComponentInstance)
          definition = entity.definition
          next if visited_definitions.include?(definition.guid)

          visited_definitions << definition.guid
          entity_counts(definition.entities, counts, visited_definitions)
        end
      end
    end

    def material_data(material)
      texture = material.texture

      {
        name: material.display_name,
        alpha: material.alpha,
        color: material.color.to_a,
        texture: texture && {
          filename: texture.filename,
          width: texture.image_width,
          height: texture.image_height
        }
      }
    end

    def collect_metadata(model)
      counts = Hash.new(0)
      entity_counts(model.entities, counts, [])
      bounds = model.bounds

      {
        sketchup_version: Sketchup.version,
        model_path: model.path,
        model_title: model.title,
        bounds: {
          min_m: vector_to_meters(bounds.min),
          max_m: vector_to_meters(bounds.max),
          width_m: bounds.width.to_f * INCHES_TO_METERS,
          height_m: bounds.height.to_f * INCHES_TO_METERS,
          depth_m: bounds.depth.to_f * INCHES_TO_METERS
        },
        active_camera: camera_data(model.active_view.camera),
        scenes: model.pages.map do |page|
          {
            name: page.name,
            camera: camera_data(page.camera)
          }
        end,
        tags: model.layers.map do |layer|
          {
            name: layer.display_name,
            visible: layer.visible?
          }
        end,
        materials: model.materials.map { |material| material_data(material) },
        entity_counts: counts.sort.to_h,
        definitions: model.definitions.length,
        top_level_entities: model.entities.length
      }
    end

    def write_json(path, payload)
      File.write(path, JSON.pretty_generate(payload))
    end

    def finish(output_dir, payload)
      write_json(File.join(output_dir, "export-result.json"), payload)
      UI.start_timer(1.0, false) { Sketchup.quit }
    end

    def export_model(model, output_dir)
      FileUtils.mkdir_p(output_dir)
      metadata_path = File.join(output_dir, "model-metadata.json")
      screenshot_path = File.join(output_dir, "saved-view.png")
      export_format = ENV.fetch("MV2_EXPORT_FORMAT", "glb").downcase
      export_path =
        File.join(output_dir, "condominio-mv2-source.#{export_format}")

      metadata = collect_metadata(model)
      write_json(metadata_path, metadata)
      model.active_view.write_image(
        {
          filename: screenshot_path,
          width: 1600,
          height: 900,
          antialias: true,
          compression: 0.9,
          transparent: false
        }
      )

      started_at = Time.now
      exported =
        if export_format == "dae"
          model.export(
            export_path,
            {
              triangulated_faces: true,
              doublesided_faces: true,
              edges: false,
              author_attribution: false,
              hidden_geometry: false,
              preserve_instancing: true,
              texture_maps: true,
              selectionset_only: false,
              camera_lookat: true
            }
          )
        else
          model.export(export_path)
        end
      finish(
        output_dir,
        {
          success: exported,
          source: model.path,
          output: export_path,
          output_bytes: File.exist?(export_path) ? File.size(export_path) : 0,
          duration_seconds: (Time.now - started_at).round(2)
        }
      )
    rescue StandardError => error
      finish(
        output_dir,
        {
          success: false,
          error_class: error.class.name,
          error_message: error.message,
          backtrace: error.backtrace
        }
      )
    end

    def start
      source = ENV["MV2_SKP_SOURCE"]
      output_dir = ENV["MV2_SKP_OUTPUT_DIR"]
      started_at = Time.now
      exporting = false
      open_requested = false

      unless source && output_dir
        raise "MV2_SKP_SOURCE and MV2_SKP_OUTPUT_DIR are required"
      end

      timer_id = nil
      timer_id = UI.start_timer(POLL_SECONDS, true) do
        model = Sketchup.active_model
        same_model =
          !model.path.empty? &&
          File.expand_path(model.path).casecmp(File.expand_path(source)).zero?

        if same_model && !exporting
          exporting = true
          UI.stop_timer(timer_id)
          export_model(model, output_dir)
        elsif !open_requested
          open_requested = true
          Sketchup.open_file(source)
        elsif Time.now - started_at > TIMEOUT_SECONDS
          UI.stop_timer(timer_id)
          FileUtils.mkdir_p(output_dir)
          finish(
            output_dir,
            {
              success: false,
              error_message: "Timed out waiting for the requested model",
              active_model: model.path,
              expected_model: source
            }
          )
        end
      end
    end

    start
  end
end
