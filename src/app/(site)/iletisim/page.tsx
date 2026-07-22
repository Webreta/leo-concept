import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";

export const metadata = { title: "İletişim | LEO Concept" };

// Özel Tasarım sayfasıyla aynı kart dili: büyük sağ-üst radius,
// solda iletişim bilgileri, sağda dark form — tek dark kart içinde.
export default async function IletisimPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const whatsappDigits = settings?.whatsapp?.replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-[100rem] px-4 py-16 lg:px-8">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
        Bize Ulaşın
      </p>
      <h1 className="mt-3 text-center text-4xl md:text-5xl">İletişim</h1>
      <p className="mx-auto mt-5 max-w-2xl text-center text-ink/60">
        Sorularınız, teklif talepleriniz ve projeleriniz için buradayız.
      </p>

      <div className="mt-14 grid overflow-hidden rounded-[2rem] rounded-tr-[6rem] bg-gradient-to-br from-[#332e28] via-charcoal to-black text-ivory shadow-2xl lg:grid-cols-5">
        {/* Sol: iletişim bilgileri */}
        <div className="relative p-8 lg:col-span-2 lg:p-14">
          <div
            aria-hidden
            className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-bronze/10 blur-3xl"
          />
          <div className="relative flex h-full flex-col">
            <h2 className="text-2xl md:text-3xl">Bize Ulaşın</h2>
            <span className="mt-5 block h-px w-12 bg-bronze/70" />
            <ul className="mt-8 space-y-6 text-sm leading-relaxed">
              {settings?.address && (
                <li>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-bronze">
                    Adres
                  </p>
                  <p className="mt-1.5 text-ivory/75">{settings.address}</p>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-bronze">
                    Telefon
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="mt-1.5 inline-block text-ivory/75 transition-colors hover:text-bronze"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-bronze">
                    E-posta
                  </p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1.5 inline-block text-ivory/75 transition-colors hover:text-bronze"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
              {whatsappDigits && (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-bronze/60 bg-bronze/10 px-6 py-2.5 text-sm font-semibold tracking-wide text-bronze transition-colors hover:bg-bronze hover:text-charcoal"
                >
                  WhatsApp
                </a>
              )}
              {[
                { url: settings?.instagramUrl, label: "Instagram" },
                { url: settings?.facebookUrl, label: "Facebook" },
                { url: settings?.linkedinUrl, label: "LinkedIn" },
              ]
                .filter((s) => s.url)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-ivory/40 px-6 py-2.5 text-sm font-semibold tracking-wide text-ivory transition-colors hover:border-bronze hover:text-bronze"
                  >
                    {s.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Sağ: form — ince ayraç çizgisiyle */}
        <div className="relative border-t border-ivory/10 p-8 lg:col-span-3 lg:border-l lg:border-t-0 lg:p-14">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-bronze/15 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl">Mesaj Bırakın</h2>
            <p className="mt-3 text-sm text-ivory/60">
              Formu doldurun, en kısa sürede size dönüş yapalım.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
