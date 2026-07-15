"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import HTMLFlipBook from "react-pageflip";

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    turnToPage: (page: number) => void;
  };
};

export default function FlipbookViewer({
  slug,
  name,
  pages,
}: {
  slug: string;
  name: string;
  pages: number;
}) {
  const bookRef = useRef<FlipBookRef | null>(null);
  const [current, setCurrent] = useState(0);

  const flipPrev = useCallback(
    () => bookRef.current?.pageFlip().flipPrev(),
    []
  );
  const flipNext = useCallback(
    () => bookRef.current?.pageFlip().flipNext(),
    []
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") flipNext();
      if (e.key === "ArrowLeft") flipPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev]);

  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-gradient-to-b from-charcoal via-[#242019] to-[#15120e]">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-5 py-4 text-ivory sm:px-8">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-bronze">
            Katalog
          </span>
          <h1 className="font-heading text-xl sm:text-2xl">{name}</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden text-sm text-ivory/50 sm:block">
            {Math.min(current + 1, pages)} / {pages}
          </span>
          <Link
            href="/kataloglar"
            aria-label="Kapat"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/25 text-2xl leading-none text-ivory/80 transition-colors hover:border-bronze hover:text-bronze"
          >
            ×
          </Link>
        </div>
      </div>

      {/* Kitap */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-6 sm:px-20">
        <NavArrow side="left" onClick={flipPrev} />
        <HTMLFlipBook
          ref={bookRef}
          width={460}
          height={650}
          size="stretch"
          minWidth={260}
          maxWidth={560}
          minHeight={368}
          maxHeight={792}
          showCover
          usePortrait
          maxShadowOpacity={0.5}
          flippingTime={700}
          onFlip={(e: { data: number }) => setCurrent(e.data)}
          className="drop-shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow
          startZIndex={0}
          autoSize
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
        >
          {Array.from({ length: pages }, (_, i) => (
            <div key={i} className="overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/kataloglar/${slug}/${i + 1}.jpg`}
                alt={`${name} — sayfa ${i + 1}`}
                loading={i < 6 ? "eager" : "lazy"}
                draggable={false}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </HTMLFlipBook>
        <NavArrow side="right" onClick={flipNext} />
      </div>

      {/* Alt ipucu */}
      <p className="pb-4 text-center text-xs text-ivory/35">
        Sayfa köşesinden sürükleyerek ya da ok tuşlarıyla çevirebilirsiniz
      </p>
    </div>
  );
}

function NavArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Önceki sayfa" : "Sonraki sayfa"}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-ivory/25 bg-charcoal/60 px-4 py-2.5 text-xl text-ivory/80 backdrop-blur transition-colors hover:border-bronze hover:text-bronze ${
        side === "left" ? "left-3 sm:left-6" : "right-3 sm:right-6"
      }`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
