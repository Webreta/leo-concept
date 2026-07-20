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
            {/* Dark gradyan + beyaz logo banner (mağaza fotoğrafı yerine) */}
            <div className="relative mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#332e28] via-charcoal to-black">
              <div
                aria-hidden
                className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-bronze/15 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-bronze/10 blur-3xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/leo-concept-logo-beyaz.png"
                alt={store.name}
                className="relative max-h-16 w-auto max-w-[60%] opacity-90 drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
              />
            </div>
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
