import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [slides, categories, collections] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const hero = slides[0];
  const icMekan = categories.filter((c) => c.area === "ic-mekan");
  const disMekan = categories.filter((c) => c.area === "dis-mekan");

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
              className="mt-8 inline-block border border-bronze bg-bronze/90 px-8 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-bronze-dark"
            >
              {hero.buttonText}
            </Link>
          )}
        </div>
      </section>

      {/* İç Mekan */}
      <CategorySection title="İç Mekan" items={icMekan} />

      {/* Dış Mekan */}
      {disMekan.length > 0 && (
        <div className="bg-sand">
          <CategorySection title="Dış Mekan" items={disMekan} />
        </div>
      )}

      {/* Koleksiyonlar */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="mb-10 text-center text-3xl md:text-4xl">Kataloglar</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href="/kataloglar"
              className="group relative flex aspect-[3/4] items-end overflow-hidden bg-charcoal"
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
            className="mt-8 inline-block border border-ivory/40 px-8 py-3 text-sm tracking-widest uppercase transition-colors hover:border-bronze hover:text-bronze"
          >
            Detaylı Bilgi
          </Link>
        </div>
      </section>
    </>
  );
}

function CategorySection({
  title,
  items,
}: {
  title: string;
  items: { id: string; name: string; slug: string; imageUrl: string | null }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <h2 className="mb-10 text-center text-3xl md:text-4xl">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategoriler/${cat.slug}`}
            className="group relative flex aspect-square items-end overflow-hidden bg-sand"
          >
            {cat.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="relative z-10 w-full bg-gradient-to-t from-charcoal/80 to-transparent p-5 text-ivory">
              <h3 className="text-xl">{cat.name}</h3>
              <span className="mt-1 block text-xs tracking-widest uppercase text-bronze">
                İncele →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
