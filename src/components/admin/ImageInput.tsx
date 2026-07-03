"use client";

import { useState } from "react";

// Dosya seçilince /api/admin/upload'a yükler, dönen URL'i gizli inputa yazar.
// URL elle de girilebilir.
export default function ImageInput({
  name,
  label,
  defaultValue,
  accept = "image/*",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }

  const isImage = url && !url.endsWith(".pdf");

  return (
    <div>
      <span className="mb-1 block text-sm text-ink/70">{label}</span>
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/uploads/... veya https://..."
            className="w-full border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-bronze"
          />
          <input
            type="file"
            accept={accept}
            onChange={handleFile}
            className="block text-sm text-ink/60 file:mr-3 file:border-0 file:bg-charcoal file:px-3 file:py-1.5 file:text-xs file:text-ivory file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-ink/50">Yükleniyor...</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        {isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Önizleme"
            className="h-20 w-20 border border-sand object-cover"
          />
        )}
      </div>
    </div>
  );
}
