import Link from "next/link";
import type { SiteSettings } from "@/generated/prisma/client";

const navLinks = [
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/kataloglar", label: "Kataloglar" },
  { href: "/ozel-tasarim", label: "Özel Tasarım" },
  { href: "/merak-edilenler", label: "Merak Edilenler" },
  { href: "/magazalar", label: "Mağazalar" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const siteName = settings?.siteName ?? "LEO Concept";
  const socials = [
    { url: settings?.facebookUrl, label: "Facebook" },
    { url: settings?.instagramUrl, label: "Instagram" },
    { url: settings?.linkedinUrl, label: "LinkedIn" },
  ].filter((s): s is { url: string; label: string } => !!s.url);

  return (
    <footer className="relative overflow-hidden rounded-t-[7rem] text-ivory/75">
      {/* Katmanlı arka plan */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-[#221d16] to-[#0e0c09]" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 24rem at 50% -8rem, rgba(168,131,79,0.22), transparent 65%)," +
            "radial-gradient(28rem 28rem at -6rem 110%, rgba(168,131,79,0.10), transparent 70%)," +
            "radial-gradient(28rem 28rem at 106% 110%, rgba(168,131,79,0.10), transparent 70%)",
        }}
      />

      {/* Üst bronz çizgi */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-bronze to-transparent" />

      <div className="relative mx-auto flex max-w-[96rem] flex-col items-center px-4 pt-16 text-center lg:px-12">
        {/* Logo */}
        {settings?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.logoUrl}
            alt={siteName}
            className="h-20 w-auto drop-shadow-[0_0_25px_rgba(168,131,79,0.35)] sm:h-24"
          />
        ) : (
          <span className="font-heading text-3xl tracking-widest uppercase text-ivory">
            {siteName}
          </span>
        )}

        {/* Cool slogan */}
        {settings?.footerText && (
          <p className="mt-6 bg-gradient-to-r from-bronze via-[#d9bd8d] to-bronze bg-clip-text font-heading text-lg tracking-wide text-transparent sm:text-xl">
            {settings.footerText}
          </p>
        )}

        {/* Dev filigran — akış içinde */}
        <span
          aria-hidden
          className="pointer-events-none my-12 select-none whitespace-nowrap font-heading text-[9vw] leading-none tracking-widest text-ivory/[0.045] sm:my-14"
        >
          LEO CONCEPT
        </span>

        {/* Menü — tek satır */}
        <nav className="flex items-center gap-x-6 text-[13px] font-medium tracking-[0.12em] uppercase max-lg:flex-wrap max-lg:justify-center max-lg:gap-y-3 lg:whitespace-nowrap">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-bronze"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* İletişim — tek satır */}
        <div className="mt-6 flex items-center text-sm text-ivory/60 max-lg:flex-col max-lg:gap-2 lg:whitespace-nowrap">
          {settings?.address && <span>{settings.address}</span>}
          {settings?.phone && (
            <>
              <Dot />
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="text-ivory transition-colors hover:text-bronze"
              >
                {settings.phone}
              </a>
            </>
          )}
          {settings?.email && (
            <>
              <Dot />
              <a
                href={`mailto:${settings.email}`}
                className="text-ivory transition-colors hover:text-bronze"
              >
                {settings.email}
              </a>
            </>
          )}
          {settings?.whatsapp && (
            <>
              <Dot />
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full border border-bronze/50 bg-bronze/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-bronze transition-colors hover:bg-bronze hover:text-charcoal"
              >
                <WhatsAppIcon />
                WhatsApp&apos;tan Yazın
              </a>
            </>
          )}
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener"
              className="ml-3 rounded-full border border-ivory/20 px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors hover:border-bronze hover:bg-bronze/10 hover:text-bronze"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="pb-10" />
      </div>

      {/* Alt bar */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-ivory/15 to-transparent" />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 text-xs text-ivory/40">
          © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.1 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a14 14 0 0 1-1.5-.5c-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.6.4 0 .2 0 .7-.2 1.2Z" />
    </svg>
  );
}

function Dot() {
  return (
    <span className="px-3 text-bronze/70 max-lg:hidden" aria-hidden>
      •
    </span>
  );
}
