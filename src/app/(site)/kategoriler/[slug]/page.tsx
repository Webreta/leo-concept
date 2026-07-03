import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function KategoriDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });

  if (!category || !category.isActive) notFound();

  return (
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

      {category.products.length === 0 ? (
        <p className="py-20 text-center text-ink/50">
          Bu kategoriye henüz ürün eklenmedi.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <Link
              key={product.id}
              href={`/urunler/${product.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt ?? product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <h2 className="mt-4 text-xl transition-colors group-hover:text-bronze">
                {product.name}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
