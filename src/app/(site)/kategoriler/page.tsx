import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Kategoriler | LEO Concept" };

export default async function KategorilerPage({
  searchParams,
}: {
  searchParams: Promise<{ alan?: string }>;
}) {
  const { alan } = await searchParams;
  const categories = await prisma.category.findMany({
    where: { isActive: true, ...(alan ? { area: alan } : {}) },
    orderBy: { sortOrder: "asc" },
  });

  const groups = [
    { key: "ic-mekan", title: "İç Mekan" },
    { key: "dis-mekan", title: "Dış Mekan" },
  ].filter((g) => categories.some((c) => c.area === g.key));

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="mb-4 text-center text-4xl md:text-5xl">Kategoriler</h1>
        <div className="mx-auto mb-14 flex max-w-md items-center justify-center gap-3 text-sm font-semibold">
          <FilterPill href="/kategoriler" active={!alan} label="Tümü" />
          <FilterPill
            href="/kategoriler?alan=dis-mekan"
            active={alan === "dis-mekan"}
            label="Dış Mekan"
          />
          <FilterPill
            href="/kategoriler?alan=ic-mekan"
            active={alan === "ic-mekan"}
            label="İç Mekan"
          />
        </div>

        {groups.map((group) => (
          <section key={group.key} className="mb-16 last:mb-0">
            <div className="mb-8 flex items-center gap-6">
              <h2 className="whitespace-nowrap text-2xl md:text-3xl">
                {group.title}
              </h2>
              <span className="h-px flex-1 bg-charcoal/30" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {categories
                .filter((c) => c.area === group.key)
                .map((cat) => (
                  <Link key={cat.id} href={`/kategoriler/${cat.slug}`} className="group">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] rounded-tr-[6rem] bg-sand">
                      {cat.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      {/* Alt bant: gradient üzerinde başlık + buton */}
                      <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-transparent px-6 pb-5 pt-14 sm:px-8">
                        <h3 className="whitespace-nowrap text-xl text-ivory md:text-2xl">
                          {cat.name}
                        </h3>
                        <span className="h-px flex-1 bg-ivory/40" />
                        <span className="rounded-full border border-ivory/80 px-4 py-1.5 text-xs font-semibold text-ivory transition-colors group-hover:bg-ivory group-hover:text-charcoal">
                          İncele
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <p className="py-20 text-center text-ink/50">
            Bu alanda henüz kategori yok.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-5 py-2 transition-colors ${
        active
          ? "border-charcoal bg-charcoal text-ivory"
          : "border-charcoal/40 hover:border-charcoal"
      }`}
    >
      {label}
    </Link>
  );
}
