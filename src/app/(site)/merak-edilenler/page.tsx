import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Merak Edilenler | LEO Concept" };

// Özel Tasarım sayfasıyla aynı kart dili: büyük sağ-üst radius,
// solda bronz parıltılı dark panel, sağda numaralı akordeon listesi.
export default async function MerakEdilenlerPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-[100rem] px-4 py-16 lg:px-8">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
        Sorularınız
      </p>
      <h1 className="mt-3 text-center text-4xl md:text-5xl">Merak Edilenler</h1>
      <p className="mx-auto mt-5 max-w-2xl text-center text-ink/60">
        En sık aldığımız soruları sizin için derledik.
      </p>

      <div className="mt-14 grid overflow-hidden rounded-[2rem] rounded-tr-[6rem] shadow-2xl lg:grid-cols-5">
        {/* Sol: dark panel — başlık + iletişim CTA */}
        <div className="relative bg-gradient-to-br from-[#332e28] via-charcoal to-black p-8 lg:col-span-2 lg:p-14">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-bronze/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-bronze/10 blur-3xl"
          />
          <div className="relative flex h-full flex-col">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-bronze">
              LEO Concept
            </p>
            <h2 className="mt-4 text-3xl leading-snug text-ivory md:text-4xl">
              Aklınızda soru
              <br />
              kalmasın.
            </h2>
            <span className="mt-6 block h-px w-12 bg-bronze/70" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
              Aradığınız cevabı bulamadıysanız bize yazın; tasarım ekibimiz en
              kısa sürede size dönüş yapsın.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
              <Link
                href="/iletisim"
                className="rounded-full border border-bronze/60 bg-bronze/10 px-6 py-2.5 text-sm font-semibold tracking-wide text-bronze transition-colors hover:bg-bronze hover:text-charcoal"
              >
                İletişime Geçin
              </Link>
              <Link
                href="/ozel-tasarim"
                className="rounded-full border border-ivory/40 px-6 py-2.5 text-sm font-semibold tracking-wide text-ivory transition-colors hover:border-bronze hover:text-bronze"
              >
                Özel Tasarım
              </Link>
            </div>
          </div>
        </div>

        {/* Sağ: numaralı akordeon */}
        <div className="bg-white p-6 sm:p-10 lg:col-span-3 lg:p-14">
          <div className="divide-y divide-sand">
            {faqs.map((faq, i) => (
              <details key={faq.id} className="group py-5">
                <summary className="flex cursor-pointer list-none items-baseline gap-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-semibold tracking-widest text-bronze">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-lg font-medium transition-colors group-hover:text-bronze-dark group-open:text-bronze-dark">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className="text-xl leading-none text-bronze transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 pl-10 leading-relaxed whitespace-pre-line text-ink/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
