import Link from "next/link";
import type { SiteSettings } from "@/generated/prisma/client";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="bg-charcoal text-ivory/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="mb-4 text-xl text-ivory">
            {settings?.siteName ?? "LEO Concept"}
          </h3>
          <p className="text-sm leading-relaxed">{settings?.footerText}</p>
          <div className="mt-4 flex gap-4 text-sm">
            {settings?.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener" className="hover:text-bronze">Facebook</a>
            )}
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener" className="hover:text-bronze">Instagram</a>
            )}
            {settings?.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noopener" className="hover:text-bronze">LinkedIn</a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-lg text-ivory">Site Haritası</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/kategoriler" className="hover:text-bronze">Kategoriler</Link></li>
            <li><Link href="/kataloglar" className="hover:text-bronze">Kataloglar</Link></li>
            <li><Link href="/ozel-tasarim" className="hover:text-bronze">Özel Tasarım</Link></li>
            <li><Link href="/merak-edilenler" className="hover:text-bronze">Merak Edilenler</Link></li>
            <li><Link href="/magazalar" className="hover:text-bronze">Mağazalar</Link></li>
            <li><Link href="/iletisim" className="hover:text-bronze">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg text-ivory">İletişim</h4>
          <ul className="space-y-2 text-sm">
            {settings?.address && <li>{settings.address}</li>}
            {settings?.phone && (
              <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-bronze">{settings.phone}</a></li>
            )}
            {settings?.email && (
              <li><a href={`mailto:${settings.email}`} className="hover:text-bronze">{settings.email}</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} {settings?.siteName ?? "LEO Concept"}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
