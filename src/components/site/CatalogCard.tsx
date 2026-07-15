import Link from "next/link";

// Kapaktan sonraki ilk sayfası boş/dolgusuz olan kataloglarda
// önizleme olarak gösterilecek sayfa numarası (varsayılan: 2).
const PREVIEW_PAGE: Record<string, number> = {
  "online-katalog": 3,
};

// Katalog kartı: hover'da kapak, sol kenarı (sırt) sabit kalarak
// gerçek bir katalog gibi 3D açılır; altından iç sayfa görünür.
export default function CatalogCard({
  name,
  slug,
  coverUrl,
}: {
  name: string;
  slug: string;
  coverUrl?: string | null;
}) {
  return (
    <Link href={`/kataloglar/${slug}`} className="group relative block hover:z-10">
      <div className="[perspective:1600px]">
        <div className="relative aspect-[3/4]">
          {/* Kapak açılınca aradan görünen sayfa: kapaktan sonraki ilk görsel
              (1.jpg kapağın kendisi olduğu için 2.jpg) */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] rounded-tr-[6rem] border border-charcoal/10 bg-[#f6f1e7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/kataloglar/${slug}/${PREVIEW_PAGE[slug] ?? 2}.jpg`}
              alt={`${name} — ilk sayfa`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {/* Cilt tarafında hafif iç gölge */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent" />
          </div>

          {/* Kapak yaprağı: sol kenar menteşe, hover'da 90°'nin ötesine açılır */}
          <div className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(-115deg)]">
            {/* Ön yüz: kapak görseli */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] rounded-tr-[6rem] bg-charcoal shadow-lg [backface-visibility:hidden]">
              {coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              )}
              {/* Sırt gölgesi: kapağa cilt derinliği verir */}
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/25 to-transparent" />
            </div>

            {/* Arka yüz: kıvrılan sayfa (kapağın iç yüzü). Açıldığında dar bir
                şerit gibi göründüğü için logo + katalog adı, kitap sırtı gibi
                sayfa boyunca uzanacak şekilde 90° çevrilir. */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] rounded-tl-[6rem] bg-[#f6f1e7] shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex rotate-90 items-center gap-6 whitespace-nowrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/uploads/leo-concept-logo.png"
                    alt="LEO Concept"
                    className="h-9 w-auto opacity-80"
                  />
                  <span className="h-px w-10 bg-bronze/70" />
                  <span className="text-lg uppercase tracking-[0.35em] text-charcoal/70">
                    {name}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-black/15 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <h3 className="whitespace-nowrap text-xl">{name}</h3>
        <span className="h-px flex-1 bg-charcoal/40" />
        <span className="rounded-full border border-charcoal px-4 py-1.5 text-xs font-semibold transition-colors group-hover:bg-charcoal group-hover:text-ivory">
          İncele
        </span>
      </div>
    </Link>
  );
}
