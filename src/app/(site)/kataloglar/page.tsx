import CatalogCard from "@/components/site/CatalogCard";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Kataloglar | LEO Concept" };

export default async function KataloglarPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="mb-12 text-center text-4xl md:text-5xl">Kataloglar</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <CatalogCard
              key={c.id}
              name={c.name}
              slug={c.slug}
              coverUrl={c.coverUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
