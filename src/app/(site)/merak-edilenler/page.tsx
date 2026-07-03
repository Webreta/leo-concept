import { prisma } from "@/lib/prisma";

export const metadata = { title: "Merak Edilenler | LEO Concept" };

export default async function MerakEdilenlerPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="mb-12 text-center text-4xl md:text-5xl">
        Merak Edilenler
      </h1>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="group border border-sand bg-white p-6"
          >
            <summary className="cursor-pointer list-none text-lg font-medium">
              <span className="mr-2 text-bronze transition-transform group-open:rotate-90 inline-block">
                ›
              </span>
              {faq.question}
            </summary>
            <p className="mt-4 leading-relaxed whitespace-pre-line text-ink/70">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
