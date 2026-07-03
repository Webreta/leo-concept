import { prisma } from "@/lib/prisma";

export const metadata = { title: "Mağazalar | LEO Concept" };

export default async function MagazalarPage() {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <h1 className="mb-12 text-center text-4xl md:text-5xl">Mağazalar</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {stores.map((store) => (
          <div key={store.id} className="border border-sand bg-white p-8">
            {store.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.imageUrl}
                alt={store.name}
                className="mb-6 aspect-video w-full object-cover"
              />
            )}
            <h2 className="text-2xl">{store.name}</h2>
            <p className="mt-3 text-ink/70">{store.address}</p>
            {store.phone && (
              <a
                href={`tel:${store.phone.replace(/\s/g, "")}`}
                className="mt-2 block text-bronze hover:text-bronze-dark"
              >
                {store.phone}
              </a>
            )}
            {store.mapUrl && (
              <a
                href={store.mapUrl}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-block text-sm tracking-widest uppercase text-bronze hover:text-bronze-dark"
              >
                Haritada Gör →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
