import OzelTasarimForm from "./OzelTasarimForm";

export const metadata = { title: "Özel Tasarım | LEO Concept" };

// Solda atölye hissi veren büyük görsel, sağda dark zemin üzerinde talep formu.
// Kart köşe dili (büyük sağ-üst radius) katalog ve şube kartlarıyla aynı.
export default function OzelTasarimPage() {
  return (
    <div className="mx-auto max-w-[100rem] px-4 py-16 lg:px-8">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
        Size Özel
      </p>
      <h1 className="mt-3 text-center text-4xl md:text-5xl">Özel Tasarım</h1>
      <p className="mx-auto mt-5 max-w-2xl text-center text-ink/60">
        Yaşam alanınızın ölçülerine, tarzınıza ve ihtiyaçlarınıza özel mobilya
        tasarımı ve üretimi yapıyoruz. Kumaş, renk ve malzeme seçiminden son
        rötuşlara kadar her aşamada sizinle birlikte çalışıyoruz.
      </p>

      <div className="mt-14 grid overflow-hidden rounded-[2rem] rounded-tr-[6rem] shadow-2xl lg:grid-cols-2">
        {/* Sol: görsel + alt köşede süreç adımları */}
        <div className="relative min-h-[24rem] lg:min-h-[42rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/ozel-tasarim-hero-v2.jpg"
            alt="LEO Concept özel tasarım mobilya"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-ivory lg:p-10">
            <span className="block h-px w-12 bg-bronze/80" />
            <p className="mt-4 max-w-md text-lg font-light leading-relaxed">
              Fikirden üretime, her detayı birlikte tasarlıyoruz.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.25em] text-ivory/70">
              <li>01 · Keşif</li>
              <li>02 · Tasarım</li>
              <li>03 · Üretim</li>
              <li>04 · Teslim</li>
            </ul>
          </div>
        </div>

        {/* Sağ: dark zemin üzerinde form — bronz parıltılı */}
        <div className="relative bg-gradient-to-br from-[#332e28] via-charcoal to-black p-8 lg:p-14">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-bronze/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-bronze/10 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-2xl text-ivory md:text-3xl">
              Projenizi Anlatın
            </h2>
            <p className="mt-3 text-sm text-ivory/60">
              Formu doldurun, size özel teklif hazırlayalım.
            </p>
            <div className="mt-8">
              <OzelTasarimForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
