// leoconcept.com.tr canlı sitesinden iç mekan kategorileri için ürün çeker:
// Vitrin/Konsol (ilk 4 + son ürün), Sandalye/Tabure (tamamı),
// Keyif Ürünleri (Dady ve Charmella hariç), Puf (Tuti, Yulara ve
// Shaggy Yuvarlak Siyah hariç). Galeri görselleri public/uploads altına
// indirilir, sonuçlar data/<kategori>-urunler.json dosyalarına yazılır.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://leoconcept.com.tr";
const UPLOADS = join(__dirname, "..", "public", "uploads");

type PageDef = { path: string; slug: string };
type CategoryDef = { jsonFile: string; label: string; pages: PageDef[] };

// Listeleme sayfalarındaki sırayla (sortOrder bu sırayı takip eder)
const categories: CategoryDef[] = [
  {
    jsonFile: "vitrin-konsol-urunler.json",
    label: "Vitrin Konsol",
    pages: [
      { path: "/kesfet/1014/vitrin-konsol/1193/bonanza-dolap.aspx", slug: "bonanza-dolap" },
      { path: "/kesfet/1014/vitrin-konsol/1192/bonanza-vitrin.aspx", slug: "bonanza-vitrin" },
      { path: "/kesfet/1014/vitrin-konsol/1429/bongo-büfe.aspx", slug: "bongo-bufe" },
      { path: "/kesfet/1014/vitrin-konsol/2390/mandala-büfe.aspx", slug: "mandala-bufe" },
      { path: "/kesfet/1014/vitrin-konsol/1194/bongo-kitaplık.aspx", slug: "bongo-kitaplik" },
    ],
  },
  {
    jsonFile: "ic-sandalye-tabure-urunler.json",
    label: "Sandalye - Tabure",
    pages: [
      { path: "/kesfet/1016/sandalye-tabure/1138/autumn-sandalye.aspx", slug: "autumn-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1140/cup-sandalye.aspx", slug: "cup-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1143/fjord-sandalye.aspx", slug: "fjord-sandalye" },
      // "capetown-bar-taburesi" slug'ı dış mekan kategorisinde kullanımda
      { path: "/kesfet/1016/sandalye-tabure/1153/capetown-bar-taburesi.aspx", slug: "capetown-bar-taburesi-ic" },
      { path: "/kesfet/1016/sandalye-tabure/1149/newyork-sandalye.aspx", slug: "newyork-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1148/manhattean-sandalye.aspx", slug: "manhattean-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1147/loleza-sandalye.aspx", slug: "loleza-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1145/kennedy-sandalye.aspx", slug: "kennedy-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1139/chapung-sandalye.aspx", slug: "chapung-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1352/faroe-sandalye.aspx", slug: "faroe-sandalye" },
      { path: "/kesfet/1016/sandalye-tabure/1150/peacook-tabure.aspx", slug: "peacook-tabure" },
      { path: "/kesfet/1016/sandalye-tabure/1151/mushroom-tabure.aspx", slug: "mushroom-tabure" },
      { path: "/kesfet/1016/sandalye-tabure/1152/ranch-bar-tabure.aspx", slug: "ranch-bar-tabure" },
      { path: "/kesfet/1016/sandalye-tabure/1301/kansas-bar-tabure.aspx", slug: "kansas-bar-tabure" },
      { path: "/kesfet/1016/sandalye-tabure/1142/donna-tabure.aspx", slug: "donna-tabure" },
      { path: "/kesfet/1016/sandalye-tabure/1141/donna-bench.aspx", slug: "donna-bench" },
    ],
  },
  {
    jsonFile: "ic-keyif-urunleri-urunler.json",
    label: "Keyif Ürünleri",
    pages: [
      { path: "/kesfet/1021/keyif-ürünleri/2413/nardi-folio-sallanan-sandalye.aspx", slug: "nardi-folio-sallanan-sandalye" },
      { path: "/kesfet/1021/keyif-ürünleri/1207/ar-drop-yer-minderi.aspx", slug: "ar-drop-yer-minderi" },
      { path: "/kesfet/1021/keyif-ürünleri/1205/peacook-oriental-koltuk.aspx", slug: "peacook-oriental-koltuk" },
      { path: "/kesfet/1021/keyif-ürünleri/1380/buddha-standlı-mask.aspx", slug: "buddha-standli-mask" },
    ],
  },
  {
    jsonFile: "puf-urunler.json",
    label: "Puf",
    pages: [
      { path: "/kesfet/1018/puf/1158/casablanca-05.aspx", slug: "casablanca-05" },
      { path: "/kesfet/1018/puf/1157/casablanca-04.aspx", slug: "casablanca-04" },
      { path: "/kesfet/1018/puf/1156/casablanca-03.aspx", slug: "casablanca-03" },
      { path: "/kesfet/1018/puf/1155/casablanca-02.aspx", slug: "casablanca-02" },
      { path: "/kesfet/1018/puf/1154/casablanca-01.aspx", slug: "casablanca-01" },
      { path: "/kesfet/1018/puf/1401/shaggy-kare-naturel-puf.aspx", slug: "shaggy-kare-naturel-puf" },
      { path: "/kesfet/1018/puf/1402/shaggy-kare-siyah-puf.aspx", slug: "shaggy-kare-siyah-puf" },
      { path: "/kesfet/1018/puf/1404/shaggy-yuvarlak-naturel-puf.aspx", slug: "shaggy-yuvarlak-naturel-puf" },
    ],
  },
];

function decodeEntities(s: string): string {
  return s
    .replace(/&uuml;/g, "ü").replace(/&Uuml;/g, "Ü")
    .replace(/&ouml;/g, "ö").replace(/&Ouml;/g, "Ö")
    .replace(/&ccedil;/g, "ç").replace(/&Ccedil;/g, "Ç")
    .replace(/&Oslash;/g, "Ø").replace(/&oslash;/g, "ø")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

function visibleLines(html: string): string[] {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<input[^>]*__VIEWSTATE[^>]*>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "\n")
  )
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

async function main() {
  for (const cat of categories) {
    const out: {
      name: string;
      slug: string;
      sortOrder: number;
      description: string | null;
      images: { file: string; alt: string }[];
    }[] = [];

    for (let idx = 0; idx < cat.pages.length; idx++) {
      const { path, slug } = cat.pages[idx];
      const res = await fetch(BASE + encodeURI(path));
      if (!res.ok) throw new Error(`${res.status} → ${path}`);
      const html = await res.text();

      const name = decodeEntities(
        (/<title>\s*([^<|]+?)\s*\|/.exec(html)?.[1] ?? slug).trim()
      );

      // Galeri: lightbox anchor'ları. Ana görsel çift, ek galeri görselleri
      // tek tırnaklı href ile yazılmış — ikisini de yakala.
      const galleryUrls = [
        ...new Set(
          [...html.matchAll(
            /<a[^>]*?href=["'](\/images\/[^"']+)["'][^>]*?data-toggle="lightbox"/g
          )].map((m) => m[1])
        ),
      ];
      if (galleryUrls.length === 0) throw new Error(`Galeri görseli yok: ${slug}`);

      // Açıklama: "Bilgi Al" satırından geriye, ürün adı / kategori etiketine
      // kadar olan satırlar (malzeme, BOYUT ve ölçüler dahil).
      const lines = visibleLines(html);
      const stopIdx = lines.findIndex((l) => l === "Bilgi Al");
      let description: string | null = null;
      if (stopIdx !== -1) {
        const desc: string[] = [];
        for (let i = stopIdx - 1; i > 0; i--) {
          if (lines[i] === name || lines[i] === cat.label || /-->/.test(lines[i])) break;
          desc.unshift(lines[i]);
        }
        description = desc.length > 0 ? desc.join("\n") : null;
      }

      const images: { file: string; alt: string }[] = [];
      for (const url of galleryUrls) {
        const imgRes = await fetch(BASE + encodeURI(url));
        if (!imgRes.ok) {
          // Canlı sitede kırık görseller var (404) — atla
          console.warn(`  ! Görsel ${imgRes.status}, atlandı → ${url}`);
          continue;
        }
        const ext = (/\.[a-zA-Z0-9]+$/.exec(url)?.[0] ?? ".jpg").toLowerCase();
        const file = `${slug}-${images.length + 1}${ext}`;
        writeFileSync(join(UPLOADS, file), Buffer.from(await imgRes.arrayBuffer()));
        images.push({ file, alt: `${name} — görsel ${images.length + 1}` });
      }
      if (images.length === 0) throw new Error(`İndirilebilir görsel yok: ${slug}`);

      out.push({ name, slug, sortOrder: idx, description, images });
      console.log(`✓ [${cat.label}] ${name} (${images.length} görsel)${description ? "" : " — açıklama yok"}`);
    }

    writeFileSync(
      join(__dirname, "data", cat.jsonFile),
      JSON.stringify(out, null, 2) + "\n",
      "utf-8"
    );
    console.log(`→ ${out.length} ürün data/${cat.jsonFile} dosyasına yazıldı.\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
