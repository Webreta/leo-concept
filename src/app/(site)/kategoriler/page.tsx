import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Kategoriler | LEO Concept" };

export default async function KategorilerPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <h1 className="mb-12 text-center text-4xl md:text-5xl">Kategoriler</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
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
              <h2 className="text-xl">{cat.name}</h2>
              <span className="mt-1 block text-xs tracking-widest uppercase text-bronze">
                İncele →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
