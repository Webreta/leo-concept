"use client";

import { useEffect, useState } from "react";

type GalleryImage = { id: string; url: string; alt: string | null };

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % images.length);
      if (e.key === "ArrowLeft")
        setActive((a) => (a - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-sand text-ink/40">
        Görsel eklenmedi
      </div>
    );
  }

  const current = images[active];

  return (
    <div>
      {/* Ana görsel */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[2rem] rounded-tr-[6rem] bg-sand"
        aria-label="Görseli büyüt"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.alt ?? productName}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </button>

      {/* Küçük görseller */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`w-24 overflow-hidden rounded-2xl border-2 transition-colors ${
                i === active
                  ? "border-bronze"
                  : "border-transparent hover:border-charcoal/30"
              }`}
              aria-label={`Görsel ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? productName}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-4xl leading-none text-ivory/80 hover:text-ivory"
            aria-label="Kapat"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <NavButton
                side="left"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a - 1 + images.length) % images.length);
                }}
              />
              <NavButton
                side="right"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((a) => (a + 1) % images.length);
                }}
              />
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt ?? productName}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Önceki görsel" : "Sonraki görsel"}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-ivory/40 bg-charcoal/50 px-4 py-2.5 text-xl text-ivory transition-colors hover:border-bronze hover:text-bronze ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
