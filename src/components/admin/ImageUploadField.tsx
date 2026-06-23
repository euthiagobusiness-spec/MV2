"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ImageUploadFieldProps = {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUploadField({
  value,
  onChange,
  label = "Upload de imagem",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  async function handleFile(file: File | undefined) {
    if (!file || !configured) return;
    setUploading(true);

    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `properties/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("property-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {value ? (
        <Image
          alt="Preview"
          className="h-36 w-full rounded-lg object-cover"
          height={288}
          src={value}
          width={640}
        />
      ) : null}
      <label className="btn btn-outline cursor-pointer">
        {uploading ? <Loader2 className="animate-spin" size={17} /> : <ImagePlus size={17} />}
        {configured ? "Enviar imagem" : "Conecte o Supabase para upload"}
        <input
          accept="image/*"
          className="sr-only"
          disabled={!configured || uploading}
          onChange={(event) => handleFile(event.target.files?.[0])}
          type="file"
        />
      </label>
    </div>
  );
}
