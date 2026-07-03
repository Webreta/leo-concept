import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/site/ProductGallery";

export default async function UrunDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.isActive) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    orderBy: { sortOrder: "asc" },
    take: 3,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <nav className="mb-8 text-sm text-ink/60">
          <Link href="/kategoriler" className="hover:text-bronze">
            Kategoriler
          </Link>{" "}
          /{" "}
          <Link
            href={`/kategoriler/${product.category.slug}`}
            className="hover:text-bronze"
          >
            {product.category.name}
          </Link>{" "}
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:pt-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-bronze">
              {product.category.name}
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>

            <div className="mt-5 flex items-center gap-6">
              <span className="h-px flex-1 bg-charcoal/40" />
              <Link
                href="/iletisim"
                className="whitespace-nowrap rounded-full border border-charcoal bg-white px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-charcoal hover:text-ivory"
              >
                Bilgi &amp; Teklif Al
              </Link>
            </div>

            {product.description && (
              <div className="mt-6 space-y-4 leading-relaxed text-ink/70">
                {product.description.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            <ul className="mt-8 space-y-2.5 text-sm text-ink/70">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                Kumaş ve renk seçenekleri için bizimle iletişime geçin
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                Özel ölçü üretim imkanı
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                Mağazalarımızda yakından inceleyebilirsiniz
              </li>
            </ul>
          </div>
        </div>

        {/* Benzer ürünler */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-center gap-6">
              <h2 className="whitespace-nowrap text-2xl md:text-3xl">
                Benzer Ürünler
              </h2>
              <span className="h-px flex-1 bg-charcoal/30" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Link key={p.id} href={`/urunler/${p.slug}`} className="group">
                  <div
                    className={`aspect-[4/3] overflow-hidden bg-sand ${
                      i % 2 === 0
                        ? "rounded-[2rem] rounded-tr-[6rem]"
                        : "rounded-[2rem] rounded-bl-[6rem]"
                    }`}
                  >
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt ?? p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <h3 className="whitespace-nowrap text-xl">{p.name}</h3>
                    <span className="h-px flex-1 bg-charcoal/40" />
                    <span className="rounded-full border border-charcoal px-4 py-1.5 text-xs font-semibold transition-colors group-hover:bg-charcoal group-hover:text-ivory">
                      İncele
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
