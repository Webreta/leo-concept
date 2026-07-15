import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <Header
        siteName={settings?.siteName ?? "LEO Concept"}
        logoUrl={settings?.logoUrl}
        socials={[
          { label: "Instagram", url: settings?.instagramUrl ?? "" },
          { label: "Facebook", url: settings?.facebookUrl ?? "" },
          { label: "LinkedIn", url: settings?.linkedinUrl ?? "" },
        ].filter((s) => s.url)}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
