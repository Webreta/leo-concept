// leoconcept.com.tr canlı sitesindeki Aydınlatma kategorisinden ürünleri çeker:
// ürün adı + açıklama (malzeme/BOYUT) ayrıştırılır, galeri görselleri
// public/uploads altına indirilir, sonuç data/aydinlatma-urunler.json'a yazılır.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://leoconcept.com.tr";

// Listeleme sayfasındaki sırayla (sortOrder bu sırayı takip eder)
const pages: { path: string; slug: string }[] = [
  { path: "/kesfet/1019/aydınlatma/1341/sauca-konik-gaz-lambası.aspx", slug: "sauca-konik-gaz-lambasi" },
  { path: "/kesfet/1019/aydınlatma/1339/sauca-tombul-gaz-lambası.aspx", slug: "sauca-tombul-gaz-lambasi" },
  { path: "/kesfet/1019/aydınlatma/1340/sauca-kulplu-gaz-lambası.aspx", slug: "sauca-kulplu-gaz-lambasi" },
  { path: "/kesfet/1019/aydınlatma/1297/toothpick-lambader.aspx", slug: "toothpick-lambader" },
  { path: "/kesfet/1019/aydınlatma/1268/lime-lambader.aspx", slug: "lime-lambader" },
  { path: "/kesfet/1019/aydınlatma/1267/twisted-lambader.aspx", slug: "twisted-lambader" },
  { path: "/kesfet/1019/aydınlatma/1412/jepare-2li-fener-seti.aspx", slug: "jepare-2li-fener-seti" },
  { path: "/kesfet/1019/aydınlatma/1273/kariatis-tavan-lambası-serisi.aspx", slug: "kariatis-tavan-lambasi-serisi" },
  { path: "/kesfet/1019/aydınlatma/1271/atom-rattan-tavan-lambası.aspx", slug: "atom-rattan-tavan-lambasi" },
  { path: "/kesfet/1019/aydınlatma/1270/globe-tavan-lambası-serisi.aspx", slug: "globe-tavan-lambasi-serisi" },
  { path: "/kesfet/1019/aydınlatma/1269/marocco-tavan-lambası-serisi.aspx", slug: "marocco-tavan-lambasi-serisi" },
  { path: "/kesfet/1019/aydınlatma/1272/diana-rattan-tavan-lambası.aspx", slug: "diana-rattan-tavan-lambasi" },
  { path: "/kesfet/1019/aydınlatma/1343/dusseldorf-fener.aspx", slug: "dusseldorf-fener" },
  { path: "/kesfet/1019/aydınlatma/1410/knot-lamba-serisi.aspx", slug: "knot-lamba-serisi" },
];

const UPLOADS = join(__dirname, "..", "public", "uploads");

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
  const out: {
    name: string;
    slug: string;
    sortOrder: number;
    description: string | null;
    images: { file: string; alt: string }[];
  }[] = [];

  for (let idx = 0; idx < pages.length; idx++) {
    const { path, slug } = pages[idx];
    const res = await fetch(BASE + encodeURI(path));
    if (!res.ok) throw new Error(`${res.status} → ${path}`);
    const html = await res.text();

    const name = decodeEntities(
      (/<title>\s*([^<|]+?)\s*\|/.exec(html)?.[1] ?? slug).trim()
    );

    // Galeri: lightbox anchor'ları (benzer ürünler bölümünde lightbox yok)
    const galleryUrls = [
      ...new Set(
        [...html.matchAll(/<a href="(\/images\/urunler\/[^"]+)"[^>]*data-toggle="lightbox"/g)].map(
          (m) => m[1]
        )
      ),
    ];
    if (galleryUrls.length === 0) throw new Error(`Galeri görseli yok: ${slug}`);

    // Açıklama: "BOYUT" satırından önce malzeme, sonrasında ölçüler
    // ("Bilgi Al" / "Benzer Ürünler" bölümüne kadar)
    const lines = visibleLines(html);
    const bIdx = lines.findIndex((l) => l === "BOYUT");
    let description: string | null = null;
    if (bIdx !== -1) {
      const material =
        bIdx > 0 && lines[bIdx - 1] !== name && lines[bIdx - 1] !== "Aydınlatma"
          ? lines[bIdx - 1]
          : null;
      const sizes: string[] = [];
      for (let i = bIdx + 1; i < lines.length; i++) {
        if (/Bilgi Al|Benzer Ürünler|-->/.test(lines[i])) break;
        sizes.push(lines[i]);
      }
      const parts = [material, "BOYUT", ...sizes].filter(Boolean) as string[];
      description = sizes.length > 0 ? parts.join("\n") : material;
    }

    const images: { file: string; alt: string }[] = [];
    for (let i = 0; i < galleryUrls.length; i++) {
      const url = galleryUrls[i];
      const ext = (/\.[a-zA-Z0-9]+$/.exec(url)?.[0] ?? ".jpg").toLowerCase();
      const file = `${slug}-${i + 1}${ext}`;
      const imgRes = await fetch(BASE + encodeURI(url));
      if (!imgRes.ok) throw new Error(`Görsel ${imgRes.status} → ${url}`);
      writeFileSync(join(UPLOADS, file), Buffer.from(await imgRes.arrayBuffer()));
      images.push({ file, alt: `${name} — görsel ${i + 1}` });
    }

    out.push({ name, slug, sortOrder: idx, description, images });
    console.log(`✓ ${name} (${images.length} görsel)${description ? "" : " — açıklama yok"}`);
  }

  writeFileSync(
    join(__dirname, "data", "aydinlatma-urunler.json"),
    JSON.stringify(out, null, 2) + "\n",
    "utf-8"
  );
  console.log(`\n${out.length} ürün data/aydinlatma-urunler.json dosyasına yazıldı.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
