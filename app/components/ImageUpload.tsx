"use client";

import { useMemo, useState } from "react";

export type UploadedImage = {
  name: string;
  type: string;
  size: number;
  dataUrl: string; // base64 data URL for preview + easy transport
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed reading file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  maxFiles = 4,
  maxMB = 5,
  value,
  onChange,
}: {
  maxFiles?: number;
  maxMB?: number;
  value: UploadedImage[];
  onChange: (imgs: UploadedImage[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const maxBytes = maxMB * 1024 * 1024;

  const totalBytes = useMemo(
    () => value.reduce((sum, img) => sum + img.size, 0),
    [value]
  );

  const onPick = async (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;

    const current = value.slice();
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        continue;
      }
      if (file.size > maxBytes) {
        setError(`One image is too large. Max ${maxMB}MB each.`);
        continue;
      }
      if (current.length >= maxFiles) {
        setError(`Max ${maxFiles} images.`);
        break;
      }

      const dataUrl = await fileToDataUrl(file);
      current.push({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
      });
    }

    onChange(current);
  };

  const removeAt = (idx: number) => {
    const next = value.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 bg-black/50 cursor-pointer text-sm font-semibold">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPick(e.target.files)}
          />
          Upload images
          <span className="text-xs text-gray-400">
            (up to {maxFiles}, {maxMB}MB each)
          </span>
        </label>

        <div className="text-xs text-gray-400">
          {value.length} selected • {(totalBytes / 1024 / 1024).toFixed(2)}MB total
        </div>
      </div>

      {error && <p className="text-xs text-amber-400">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((img, idx) => (
            <div key={`${img.name}-${idx}`} className="relative group">
              <div className="rounded-xl overflow-hidden border border-gray-800 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="h-32 w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold bg-black/70 border border-gray-700 opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
              <div className="mt-1 text-[11px] text-gray-400 truncate">{img.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
