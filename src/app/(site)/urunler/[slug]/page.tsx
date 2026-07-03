import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <nav className="mb-6 text-sm text-ink/60">
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
        / {product.name}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {product.images.length === 0 ? (
            <div className="flex aspect-[4/3] items-center justify-center bg-sand text-ink/40">
              Görsel eklenmedi
            </div>
          ) : (
            product.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url}
                alt={img.alt ?? product.name}
                className="w-full object-cover"
              />
            ))
          )}
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl">{product.name}</h1>
          {product.description && (
            <p className="mt-6 leading-relaxed whitespace-pre-line text-ink/70">
              {product.description}
            </p>
          )}
          <Link
            href="/iletisim"
            className="mt-10 inline-block bg-charcoal px-8 py-3 text-sm tracking-widest uppercase text-ivory transition-colors hover:bg-bronze-dark"
          >
            Bilgi &amp; Teklif Al
          </Link>
        </div>
      </div>
    </div>
  );
}
