import Link from "next/link";
import CatalogCard from "@/components/site/CatalogCard";
import BranchCard, { branches } from "@/components/site/BranchCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [slides, collections, settings] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  const hero = slides[0];

  return (
    <>
      {/* Hero: sayfanın en tepesinden başlayan video, header üzerine şeffaf biner */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal text-ivory">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/medya/leo-hero-video.mp4" type="video/mp4" />
        </video>
        {/* Sol taraftaki yazının okunabilirliği için gradyan katmanlar */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[100rem] px-6 pt-24 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
              LEO Concept
            </p>
            <h1 className="mt-5 text-4xl font-light leading-[1.08] tracking-wide md:text-6xl lg:text-7xl">
              {hero?.title ?? "Keşfetmekten Vazgeçmeyenlere"}
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ivory/75 md:text-lg">
              {hero?.subtitle ??
                "Zamansız çizgiler, doğal dokular ve zarif detaylarla; iç ve dış mekanlarınıza karakter katan tasarımlar."}
            </p>
            <Link
              href={hero?.buttonUrl ?? "/kategoriler"}
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-ivory/50 px-8 py-3.5 text-sm font-medium tracking-[0.15em] uppercase transition-colors duration-300 hover:border-bronze hover:text-bronze"
            >
              {hero?.buttonText ?? "Kategorileri Keşfet"}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dış Mekan / İç Mekan tanıtım blokları */}
      <section className="bg-white py-16 lg:py-24">
        <div className="space-y-20 lg:space-y-28">
          <AreaIntro
            title="Dış Mekan"
            text={
              settings?.outdoorText ??
              "Bahçenize ve terasınıza konforu taşıyan dış mekan tasarımları"
            }
            imageUrl={
              settings?.outdoorImageUrl ?? "/uploads/placeholder-dis-mekan.svg"
            }
            href="/kategoriler?alan=dis-mekan"
            imageSide="left"
          />
          <AreaIntro
            title="İç Mekan"
            text={
              settings?.indoorText ??
              "Yaşam alanlarınıza zarafet katan iç mekan koleksiyonları"
            }
            imageUrl={
              settings?.indoorImageUrl ?? "/uploads/placeholder-ic-mekan.svg"
            }
            href="/kategoriler?alan=ic-mekan"
            imageSide="right"
          />
        </div>
      </section>

      {/* Koleksiyonlar */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="mb-10 text-center text-3xl md:text-4xl">Kataloglar</h2>
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
      </section>

      {/* Özel Tasarım CTA — dark banner: dev bronz halkalar, güçlü parıltı, çapraz ışık */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3a332a] via-charcoal to-black py-24 text-center text-ivory lg:py-28">
        {/* Sol: ekran dışına taşan eş merkezli bronz halkalar */}
        <div
          aria-hidden
          className="absolute -left-56 top-1/2 h-[44rem] w-[44rem] -translate-y-1/2 rounded-full border border-bronze/30"
        />
        <div
          aria-hidden
          className="absolute -left-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full border border-bronze/20"
        />
        <div
          aria-hidden
          className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border-2 border-bronze/10 bg-bronze/[0.07]"
        />
        {/* Sağ: dev yarım halka + güçlü radyal parıltı */}
        <div
          aria-hidden
          className="absolute -right-72 top-1/2 h-[56rem] w-[56rem] -translate-y-1/2 rounded-full border border-bronze/25"
        />
        <div
          aria-hidden
          className="absolute -right-40 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-bronze/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-32 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-bronze/15 blur-3xl"
        />
        {/* Çapraz ışık süpürmesi */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[70rem] w-40 -translate-x-1/2 -translate-y-1/2 rotate-[30deg] bg-gradient-to-b from-transparent via-ivory/[0.05] to-transparent blur-2xl"
        />
        {/* Logo filigranı */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/leo-concept-logo-beyaz.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[6%] top-1/2 hidden w-80 -translate-y-1/2 opacity-[0.08] lg:block"
        />
        {/* İnce bronz üst/alt çizgiler */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze/70 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze/70 to-transparent"
        />

        <div className="relative mx-auto max-w-2xl px-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
            Size Özel
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl">Özel Tasarım</h2>
          <span className="mx-auto mt-5 block h-px w-12 bg-bronze/70" />
          <p className="mt-5 text-ivory/70">
            Yaşam alanınıza özel ölçü ve tasarımda üretim için bizimle
            iletişime geçin.
          </p>
          <Link
            href="/ozel-tasarim"
            className="mt-8 inline-block rounded-full border border-bronze/60 bg-bronze/10 px-8 py-3 text-sm font-semibold tracking-wide text-bronze transition-colors hover:bg-bronze hover:text-charcoal"
          >
            Detaylı Bilgi
          </Link>
        </div>
      </section>

      {/* Şubeler */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
            Sizi Bekliyoruz
          </p>
          <h2 className="mt-3 text-center text-3xl md:text-4xl">Şubeler</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b) => (
              <BranchCard key={b.name} {...b} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Ekran görüntüsündeki blok: kenarı pill formunda ovalleşen geniş görsel,
// büyük başlık, görselden pill butona uzanan ince çizgi.
function AreaIntro({
  title,
  text,
  imageUrl,
  href,
  imageSide,
}: {
  title: string;
  text: string;
  imageUrl: string;
  href: string;
  imageSide: "left" | "right";
}) {
  const imageLeft = imageSide === "left";
  const rowDir = imageLeft ? "" : "flex-row-reverse";

  return (
    <div className="mx-auto max-w-[100rem]">
      <div
        className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-0 ${
          imageLeft ? "" : "lg:flex-row-reverse"
        }`}
      >
        {/* Görsel: ofsetli arka katman + yumuşak gölge ile 3D derinlik */}
        <div className={`lg:w-[55%] ${imageLeft ? "lg:pr-0" : "lg:pl-0"}`}>
          <div
            className={`group/img relative ${
              imageLeft ? "lg:ml-16" : "lg:mr-16"
            }`}
          >
            {/* Arkada bronz ofset pill — çerçevenin altından taşan katman */}
            <div
              aria-hidden
              className={`absolute inset-0 translate-y-3 bg-bronze/20 ${
                imageLeft
                  ? "translate-x-3 rounded-r-full"
                  : "-translate-x-3 rounded-l-full"
              }`}
            />
            <div
              className={`relative aspect-[5/2] overflow-hidden bg-sand ring-1 ring-charcoal/10 shadow-[0_35px_70px_-25px_rgba(31,29,26,0.5)] transition-transform duration-500 group-hover/img:-translate-y-1.5 ${
                imageLeft ? "rounded-r-full" : "rounded-l-full"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-[1.04]"
              />
              {/* Üstten ışık, alttan hafif gölge — kavisli yüzey hissi */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-charcoal/25"
              />
            </div>
          </div>
        </div>

        {/* İçerik: başlık ve açıklama, çizginin ortasına hizalı.
            Görünmez buton kopyaları çizgi segmentiyle aynı genişliği korur. */}
        <div className="px-6 lg:w-[45%] lg:px-12">
          <div className={`flex items-end gap-6 ${rowDir}`}>
            <h2 className="flex-1 text-center text-4xl md:text-5xl">{title}</h2>
            <PillButton href={href} invisible />
          </div>

          <div className={`mt-2 flex items-center gap-6 ${rowDir}`}>
            <span className="h-px flex-1 bg-charcoal/70" />
            <PillButton href={href} />
          </div>

          <div className={`mt-2 flex items-start gap-6 ${rowDir}`}>
            <p className="flex-1 text-center text-sm text-ink/60">{text}</p>
            <PillButton href={href} invisible />
          </div>
        </div>
      </div>
    </div>
  );
}

function PillButton({
  href,
  invisible = false,
}: {
  href: string;
  invisible?: boolean;
}) {
  const base =
    "whitespace-nowrap rounded-full border border-charcoal bg-white px-6 py-2.5 text-sm font-semibold";
  if (invisible) {
    // Başlık/açıklamayı çizgiyle aynı eksende ortalamak için yer tutucu
    return (
      <span aria-hidden className={`${base} invisible hidden lg:inline-block`}>
        Kategorileri İncele
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} inline-block transition-colors hover:bg-charcoal hover:text-ivory`}
    >
      Kategorileri İncele
    </Link>
  );
}
