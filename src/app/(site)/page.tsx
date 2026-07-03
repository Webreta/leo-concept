import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [slides, collections, settings] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  const hero = slides[0];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-charcoal text-center text-ivory">
        {hero?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.imageUrl}
            alt={hero.title}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        )}
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl leading-tight md:text-6xl">
            {hero?.title ?? "Keşfetmekten Vazgeçmeyenlere"}
          </h1>
          {hero?.subtitle && (
            <p className="mt-5 text-lg text-ivory/80">{hero.subtitle}</p>
          )}
          {hero?.buttonText && hero.buttonUrl && (
            <Link
              href={hero.buttonUrl}
              className="mt-8 inline-block rounded-full border border-ivory/60 px-8 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-bronze hover:text-bronze"
            >
              {hero.buttonText}
            </Link>
          )}
        </div>
      </section>

      {/* Dış Mekan / İç Mekan tanıtım blokları */}
      <section className="bg-white py-16 lg:py-24">
        <div className="space-y-20 lg:space-y-28">
          <AreaIntro
            title="Dış Mekan"
            text={
              settings?.outdoorText ??
              "Bahçenize ve terasınıza konforu taşıyan dış mekan tasarımları"
            }
            imageUrl={
              settings?.outdoorImageUrl ?? "/uploads/placeholder-dis-mekan.svg"
            }
            href="/kategoriler?alan=dis-mekan"
            imageSide="left"
          />
          <AreaIntro
            title="İç Mekan"
            text={
              settings?.indoorText ??
              "Yaşam alanlarınıza zarafet katan iç mekan koleksiyonları"
            }
            imageUrl={
              settings?.indoorImageUrl ?? "/uploads/placeholder-ic-mekan.svg"
            }
            href="/kategoriler?alan=ic-mekan"
            imageSide="right"
          />
        </div>
      </section>

      {/* Koleksiyonlar */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="mb-10 text-center text-3xl md:text-4xl">Kataloglar</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href="/kataloglar"
              className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-[2rem] bg-charcoal"
            >
              {c.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.coverUrl}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="relative z-10 w-full bg-gradient-to-t from-charcoal/90 to-transparent p-5 text-ivory">
                <h3 className="text-xl">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Özel Tasarım CTA */}
      <section className="bg-charcoal py-20 text-center text-ivory">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl md:text-4xl">Özel Tasarım</h2>
          <p className="mt-4 text-ivory/70">
            Yaşam alanınıza özel ölçü ve tasarımda üretim için bizimle
            iletişime geçin.
          </p>
          <Link
            href="/ozel-tasarim"
            className="mt-8 inline-block rounded-full border border-ivory/40 px-8 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-bronze hover:text-bronze"
          >
            Detaylı Bilgi
          </Link>
        </div>
      </section>
    </>
  );
}

// Ekran görüntüsündeki blok: kenarı pill formunda ovalleşen geniş görsel,
// büyük başlık, görselden pill butona uzanan ince çizgi.
function AreaIntro({
  title,
  text,
  imageUrl,
  href,
  imageSide,
}: {
  title: string;
  text: string;
  imageUrl: string;
  href: string;
  imageSide: "left" | "right";
}) {
  const imageLeft = imageSide === "left";

  return (
    <div className="mx-auto max-w-[100rem]">
      <div
        className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-0 ${
          imageLeft ? "" : "lg:flex-row-reverse"
        }`}
      >
        {/* Görsel */}
        <div className={`lg:w-[55%] ${imageLeft ? "lg:pr-0" : "lg:pl-0"}`}>
          <div
            className={`aspect-[5/2] overflow-hidden bg-sand ${
              imageLeft
                ? "rounded-r-full lg:ml-16"
                : "rounded-l-full lg:mr-16"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* İçerik */}
        <div className="px-6 lg:w-[45%] lg:px-0">
          <h2
            className={`text-4xl md:text-5xl ${
              imageLeft ? "lg:pl-16" : "text-right lg:pr-16 lg:text-left lg:pl-24"
            }`}
          >
            {title}
          </h2>

          {/* Çizgi + pill buton */}
          <div
            className={`mt-6 flex items-center ${
              imageLeft ? "" : "flex-row-reverse"
            }`}
          >
            <span className="h-px flex-1 bg-charcoal/70" />
            <Link
              href={href}
              className={`whitespace-nowrap rounded-full border border-charcoal bg-white px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-charcoal hover:text-ivory ${
                imageLeft ? "mr-6 lg:mr-16" : "ml-6 lg:ml-16"
              }`}
            >
              Kategorileri İncele
            </Link>
          </div>

          <p
            className={`mt-4 text-sm text-ink/60 ${
              imageLeft ? "lg:pl-16" : "lg:pl-24"
            }`}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
