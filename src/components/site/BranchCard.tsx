// Şube kartı: dark gradyan zemin üzerine beyaz logo, altta adres ve iletişim;
// köşe dili katalog kartlarıyla aynı (büyük sağ-üst radius).
// Ana sayfadaki "Şubeler" bölümü ile Mağazalar sayfası bu kartı paylaşır.

export type Branch = {
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl: string;
};

// Demo şube içerikleri — Çeşme/Bodrum adres ve telefonları netleşince güncellenecek.
export const branches: Branch[] = [
  {
    name: "Çeşme",
    address: "İnönü Mah. 5031 Sk. No:12, Çeşme / İzmir",
    phone: "+90 232 000 00 01",
    hours: "Her gün 09.00 – 19.00",
    mapUrl: "https://maps.google.com/?q=LEO+Concept+Çeşme",
  },
  {
    name: "Bodrum",
    address: "Konacık Mah. Atatürk Blv. No:48, Bodrum / Muğla",
    phone: "+90 252 000 00 02",
    hours: "Her gün 09.00 – 19.00",
    mapUrl: "https://maps.google.com/?q=LEO+Concept+Bodrum",
  },
  {
    name: "Menderes",
    address: "Hürriyet Mh. Süleyman Demirel Cd. No:16, Menderes / İzmir",
    phone: "+90 232 445 72 77",
    hours: "Her gün 09.00 – 19.00",
    mapUrl: "https://maps.google.com/?q=LEO+Concept+Menderes",
  },
];

export default function BranchCard({
  name,
  address,
  phone,
  hours,
  mapUrl,
}: Branch) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[6rem] bg-gradient-to-br from-[#332e28] via-charcoal to-black text-ivory shadow-lg">
      {/* Bronz parıltı — hover'da hafifçe güçlenir */}
      <div
        aria-hidden
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-bronze/15 blur-3xl transition-colors duration-700 group-hover:bg-bronze/25"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-bronze/10 blur-3xl"
      />
      {/* Beyaz logo — kartın üst yarısında ortalanmış */}
      <div className="absolute inset-x-0 top-0 flex h-[52%] items-center justify-center px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/leo-concept-logo-beyaz.png"
          alt={`LEO Concept ${name} şubesi`}
          loading="lazy"
          className="max-h-24 w-auto max-w-[70%] opacity-90 drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)] transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-bronze">
          Şube
        </p>
        <h3 className="mt-1.5 text-3xl">{name}</h3>
        <span className="mt-3 block h-px w-10 bg-bronze/70" />
        <p className="mt-3 text-sm leading-relaxed text-ivory/75">{address}</p>
        <p className="mt-1 text-sm text-ivory/60">{hours}</p>

        <div className="mt-5 flex items-center gap-3">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="rounded-full border border-ivory/40 px-5 py-2 text-xs font-semibold tracking-wide transition-colors hover:border-bronze hover:text-bronze"
          >
            {phone}
          </a>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-bronze/60 bg-bronze/15 px-5 py-2 text-xs font-semibold tracking-wide text-bronze transition-colors hover:bg-bronze hover:text-charcoal"
          >
            Yol Tarifi
          </a>
        </div>
      </div>
    </div>
  );
}
