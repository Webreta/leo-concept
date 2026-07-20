import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function KategoriDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, area: true },
    }),
  ]);

  if (!category || !category.isActive) notFound();

  const icMekan = allCategories.filter((c) => c.area === "ic-mekan");
  const disMekan = allCategories.filter((c) => c.area === "dis-mekan");

  // Geniş ürünler (koltuk takımı, kanepe): tek sütun, yatay kart
  const wide =
    category.slug === "koltuk-takimi-kanepe" ||
    category.slug === "dis-koltuk-takimi-kanepe";

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <nav className="mb-6 text-sm text-ink/60">
          <Link href="/kategoriler" className="hover:text-bronze">
            Kategoriler
          </Link>{" "}
          / {category.name}
        </nav>
        <h1 className="mb-4 text-4xl md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mb-10 max-w-2xl text-ink/70">{category.description}</p>
        )}

        <div className="mt-10 lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
          {/* Sol: kategori listesi (sticky) */}
          <aside className="mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-36">
              <CategoryGroup title="İç Mekan" items={icMekan} current={slug} />
              <CategoryGroup
                title="Dış Mekan"
                items={disMekan}
                current={slug}
              />
            </div>
          </aside>

          {/* Sağ: ürünler, 2'li grid */}
          {category.products.length === 0 ? (
            <p className="py-20 text-center text-ink/50">
              Bu kategoriye henüz ürün eklenmedi.
            </p>
          ) : (
            <div className={wide ? "grid gap-10" : "grid gap-8 sm:grid-cols-2"}>
              {category.products.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/urunler/${product.slug}`}
                  className="group"
                >
                  <div
                    className={`flex items-center justify-center overflow-hidden bg-sand p-8 sm:p-10 ${
                      wide ? "aspect-[16/9] sm:aspect-[5/2]" : "aspect-[4/3]"
                    } ${
                      i % 2 === 0
                        ? "rounded-[2rem] rounded-tr-[6rem]"
                        : "rounded-[2rem] rounded-bl-[6rem]"
                    }`}
                  >
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt ?? product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <h2 className="whitespace-nowrap text-xl">
                      {product.name}
                    </h2>
                    <span className="h-px flex-1 bg-charcoal/40" />
                    <span className="rounded-full border border-charcoal px-4 py-1.5 text-xs font-semibold transition-colors group-hover:bg-charcoal group-hover:text-ivory">
                      İncele
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryGroup({
  title,
  items,
  current,
}: {
  title: string;
  items: { id: string; name: string; slug: string }[];
  current: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink/50">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((c) => (
          <li key={c.id}>
            <Link
              href={`/kategoriler/${c.slug}`}
              className={`block border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                c.slug === current
                  ? "border-bronze font-semibold text-bronze"
                  : "border-sand text-ink/70 hover:border-charcoal/40 hover:text-ink"
              }`}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
