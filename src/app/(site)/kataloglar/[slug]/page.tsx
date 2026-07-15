import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FlipbookViewer from "@/components/site/FlipbookViewer";

export default async function KatalogDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection || !collection.isActive) notFound();

  let pages = 0;
  try {
    const manifest: Record<string, number> = JSON.parse(
      readFileSync(
        join(process.cwd(), "public", "kataloglar", "manifest.json"),
        "utf-8"
      )
    );
    pages = manifest[slug] ?? 0;
  } catch {
    pages = 0;
  }
  if (pages === 0) notFound();

  return <FlipbookViewer slug={slug} name={collection.name} pages={pages} />;
}
