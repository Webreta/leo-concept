import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";

export const metadata = { title: "İletişim | LEO Concept" };

export default async function IletisimPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <h1 className="mb-12 text-center text-4xl md:text-5xl">İletişim</h1>
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="text-2xl">Bize Ulaşın</h2>
          <ul className="mt-6 space-y-4 text-ink/70">
            {settings?.address && <li>{settings.address}</li>}
            {settings?.phone && (
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="text-bronze hover:text-bronze-dark"
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-bronze hover:text-bronze-dark"
                >
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
