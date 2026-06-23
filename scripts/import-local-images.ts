import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const sourceRoot =
  process.env.MV2_IMAGE_SOURCE ??
  "C:\\Users\\othia\\OneDrive\\Documents\\MV2\\Imagens dos apartamentos\\Imagens aps";
const publicRoot = join(process.cwd(), "public", "uploads");
const apartmentCodes = ["G2", "G3", "G4", "H1", "H5", "H28", "i7", "i24"];
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

type Manifest = {
  generatedAt: string;
  sourceRoot: string;
  apartments: Record<string, string[]>;
  condominium: string[];
  logos: string[];
};

function safeName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function copyImages(source: string, destination: string, limit?: number) {
  if (!existsSync(source)) return [];

  ensureDir(destination);

  return readdirSync(source, { withFileTypes: true })
    .filter((entry) => entry.isFile() && allowedExtensions.has(extname(entry.name).toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((entry) => {
      const targetName = safeName(entry.name);
      const target = join(destination, targetName);
      copyFileSync(join(source, entry.name), target);
      return `/${join("uploads", destination.replace(publicRoot, ""), targetName)
        .replace(/\\/g, "/")
        .replace("//", "/")}`;
    });
}

const manifest: Manifest = {
  generatedAt: new Date().toISOString(),
  sourceRoot,
  apartments: {},
  condominium: [],
  logos: [],
};

for (const code of apartmentCodes) {
  manifest.apartments[code] = copyImages(
    join(sourceRoot, "Imagens", code, "JPEG"),
    join(publicRoot, "apartments", code.toLowerCase()),
    8,
  );
}

manifest.condominium = copyImages(
  join(sourceRoot, "Área externa", "Jpeg"),
  join(publicRoot, "condominium"),
  12,
);

manifest.logos = copyImages(join(sourceRoot, "Logo"), join(publicRoot, "brand"), 3);

writeFileSync(
  join(publicRoot, "local-image-manifest.json"),
  JSON.stringify(manifest, null, 2),
);

console.log(
  `Imported ${Object.values(manifest.apartments).flat().length} apartment images, ${manifest.condominium.length} condominium images and ${manifest.logos.length} logos from ${basename(sourceRoot)}.`,
);
