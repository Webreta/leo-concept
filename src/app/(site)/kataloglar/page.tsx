import { prisma } from "@/lib/prisma";

export const metadata = { title: "Kataloglar | LEO Concept" };

export default async function KataloglarPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <h1 className="mb-12 text-center text-4xl md:text-5xl">Kataloglar</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((c) => (
          <div key={c.id} className="group">
            <div className="relative flex aspect-[3/4] items-end overflow-hidden bg-charcoal">
              {c.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.coverUrl}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="relative z-10 w-full bg-gradient-to-t from-charcoal/90 to-transparent p-5 text-ivory">
                <h2 className="text-xl">{c.name}</h2>
                {c.description && (
                  <p className="mt-1 text-sm text-ivory/70">{c.description}</p>
                )}
              </div>
            </div>
            {c.pdfUrl && (
              <a
                href={c.pdfUrl}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-block text-sm tracking-widest uppercase text-bronze hover:text-bronze-dark"
              >
                Kataloğu Görüntüle ↓
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
