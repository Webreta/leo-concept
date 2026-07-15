import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/site/ProductGallery";
import QuoteModal from "@/components/site/QuoteModal";

export default async function UrunDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  if (!product || !product.isActive) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    orderBy: { sortOrder: "asc" },
    take: 3,
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const features = (product.features ?? "")
    .split("\n")
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label?.trim() ?? "", value: rest.join("|").trim() };
    })
    .filter((f) => f.label);

  const whatsappUrl = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`
      )}`
    : null;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <nav className="mb-8 text-sm text-ink/60">
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
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-14">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:pt-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-bronze">
              {product.category.name}
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>

            <div className="mt-5 flex items-center gap-6">
              <span className="h-px flex-1 bg-charcoal/40" />
              <QuoteModal productName={product.name} />
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-ink/70">
                {product.description.split("\n\n")[0]}
              </p>
            )}

            {/* İletişim aksiyonları */}
            <div className="mt-8 space-y-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 rounded-3xl rounded-tr-[3rem] border border-[#25d366]/40 bg-[#25d366]/5 p-4 transition-colors hover:bg-[#25d366]/15"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
                    <WhatsAppIcon />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      WhatsApp&apos;tan Yazın
                    </span>
                    <span className="block text-xs text-ink/60">
                      Hızlı bilgi ve teklif için
                    </span>
                  </span>
                </a>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 rounded-3xl rounded-br-[3rem] border border-sand bg-ivory p-4 transition-colors hover:border-bronze/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-ivory">
                    <PhoneIcon />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Müşteri Hizmetleri
                    </span>
                    <span className="block text-xs text-ink/60">
                      {settings.phone}
                    </span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Açıklama */}
        {product.description && (
          <section className="mt-20">
            <div className="mb-6 flex items-center gap-6">
              <h2 className="whitespace-nowrap text-2xl md:text-3xl">
                Açıklama
              </h2>
              <span className="h-px flex-1 bg-charcoal/30" />
            </div>
            <div className="max-w-3xl space-y-4 leading-relaxed text-ink/70">
              {product.description.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* Özellikler */}
        {features.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-center gap-6">
              <h2 className="whitespace-nowrap text-2xl md:text-3xl">
                Özellikler
              </h2>
              <span className="h-px flex-1 bg-charcoal/30" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 bg-ivory p-6 ${
                    i % 2 === 0
                      ? "rounded-[1.75rem] rounded-tr-[4rem]"
                      : "rounded-[1.75rem] rounded-bl-[4rem]"
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bronze/15 text-bronze">
                    <FeatureIcon label={f.label} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-widest uppercase text-ink/50">
                      {f.label}
                    </span>
                    <span className="mt-1 block font-medium">{f.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Benzer ürünler */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-center gap-6">
              <h2 className="whitespace-nowrap text-2xl md:text-3xl">
                Benzer Ürünler
              </h2>
              <span className="h-px flex-1 bg-charcoal/30" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Link key={p.id} href={`/urunler/${p.slug}`} className="group">
                  <div
                    className={`flex aspect-[4/3] items-center justify-center overflow-hidden bg-sand p-4 ${
                      i % 2 === 0
                        ? "rounded-[2rem] rounded-tr-[6rem]"
                        : "rounded-[2rem] rounded-bl-[6rem]"
                    }`}
                  >
                    {p.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt ?? p.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <h3 className="whitespace-nowrap text-xl">{p.name}</h3>
                    <span className="h-px flex-1 bg-charcoal/40" />
                    <span className="rounded-full border border-charcoal px-4 py-1.5 text-xs font-semibold transition-colors group-hover:bg-charcoal group-hover:text-ivory">
                      İncele
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Etikete göre uygun ikonu seçer (stroke tarzı, 22px)
function FeatureIcon({ label }: { label: string }) {
  const key = label
    .toLowerCase()
    .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ç/g, "c");

  if (/(olcu|boyut|ebat)/.test(key)) return <RulerIcon />;
  if (/(kumas|doku|doseme)/.test(key)) return <LayersIcon />;
  if (/garanti/.test(key)) return <ShieldIcon />;
  if (/(teslim|kargo|kurulum)/.test(key)) return <TruckIcon />;
  if (/renk/.test(key)) return <PaletteIcon />;
  if (/(govde|iskelet|malzeme)/.test(key)) return <CubeIcon />;
  return <SparkleIcon />;
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function WhatsAppIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.1 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a14 14 0 0 1-1.5-.5c-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.6.4 0 .2 0 .7-.2 1.2Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21.3 8.7 15.3 2.7a1 1 0 0 0-1.4 0L2.7 13.9a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0L21.3 10a1 1 0 0 0 0-1.4Z" />
      <path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg {...iconProps}>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 12 10 5 10-5M2 17l10 5 10-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg {...iconProps}>
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8Z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 4-4 4h-2a2 2 0 0 0-1.5 3.3c.3.4.5.8.5 1.2 0 .8-.7 1.5-1.5 1.5H12Z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
