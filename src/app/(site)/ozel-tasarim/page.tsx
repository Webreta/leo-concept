import Link from "next/link";

export const metadata = { title: "Özel Tasarım | LEO Concept" };

export default function OzelTasarimPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-8">
      <h1 className="text-4xl md:text-5xl">Özel Tasarım</h1>
      <p className="mt-8 leading-relaxed text-ink/70">
        Yaşam alanınızın ölçülerine, tarzınıza ve ihtiyaçlarınıza özel mobilya
        tasarımı ve üretimi yapıyoruz. Kumaş, renk ve malzeme seçiminden son
        rötuşlara kadar her aşamada sizinle birlikte çalışıyoruz.
      </p>
      <p className="mt-4 leading-relaxed text-ink/70">
        Projenizi konuşmak için bize ulaşın — size özel bir teklif hazırlayalım.
      </p>
      <Link
        href="/iletisim"
        className="mt-10 inline-block bg-charcoal px-8 py-3 text-sm tracking-widest uppercase text-ivory transition-colors hover:bg-bronze-dark"
      >
        İletişime Geç
      </Link>
    </div>
  );
}
