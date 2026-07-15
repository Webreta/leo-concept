"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Anasayfa" },
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/kataloglar", label: "Kataloglar" },
  { href: "/ozel-tasarim", label: "Özel Tasarım" },
  { href: "/merak-edilenler", label: "Merak Edilenler" },
  { href: "/magazalar", label: "Mağazalar" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header({
  siteName,
  logoUrl,
  socials = [],
}: {
  siteName: string;
  logoUrl?: string | null;
  socials?: { label: string; url: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Anasayfada header video hero'nun üzerine şeffaf biner,
  // sayfa kaydırılınca tekrar dolgun charcoal görünüme döner.
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={`top-0 z-50 rounded-b-[4rem] text-ivory transition-[background-color,box-shadow] duration-500 ${
        isHome ? "fixed inset-x-0" : "sticky"
      } ${transparent ? "bg-transparent" : "bg-charcoal shadow-md"}`}
    >
      <div className="flex items-center justify-between gap-8 px-5 py-4 sm:px-8 lg:px-10">
        {/* Logo + sosyal ikonlar */}
        <div className="flex shrink-0 items-center gap-6 lg:pl-6">
          <Link href="/" className="flex shrink-0 items-center">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={siteName} className="h-16 w-auto lg:h-[4.5rem]" />
            ) : (
              <span className="font-heading text-2xl tracking-widest uppercase">
                {siteName}
              </span>
            )}
          </Link>
          {socials.length > 0 && (
            <div className="hidden items-center gap-2.5 md:flex">
              <span className="h-8 w-px bg-gradient-to-b from-transparent via-ivory/25 to-transparent" />
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze/60 bg-bronze/15 text-bronze drop-shadow-[0_0_8px_rgba(168,131,79,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-bronze hover:text-charcoal"
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Menü — en sağda */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-3.5 py-2 text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                  active ? "text-bronze" : "text-ivory/80 hover:text-ivory"
                }`}
              >
                {item.label}
                {/* Alt çizgi: ortadan büyüyen bronz */}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-bronze to-transparent transition-transform duration-300 ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          <span className="block h-0.5 w-6 bg-ivory" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ivory" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ivory" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/40 px-6 pb-5 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm tracking-widest uppercase hover:text-bronze"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram")
    return (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (label === "Facebook")
    return (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8Z" />
      </svg>
    );
  if (label === "LinkedIn")
    return (
      <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M6.5 8.8H3.6V21h2.9V8.8ZM5 7.4a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM21 14.3c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V8.8h-2.9V21h2.9v-6.5c0-1.7.8-2.7 2.2-2.7 1.3 0 2.1.9 2.1 2.7V21H21v-6.7Z" />
      </svg>
    );
  return null;
}
