"use client";

import Link from "next/link";
import { useState } from "react";

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
}: {
  siteName: string;
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-ivory shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-10 w-auto" />
          ) : (
            <span className="font-heading text-2xl tracking-widest uppercase">
              {siteName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide transition-colors hover:text-bronze"
            >
              {item.label}
            </Link>
          ))}
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
        <nav className="border-t border-ink/40 px-4 pb-4 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm tracking-wide hover:text-bronze"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
