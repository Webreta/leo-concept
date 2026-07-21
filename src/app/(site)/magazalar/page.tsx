import BranchCard, { branches } from "@/components/site/BranchCard";

export const metadata = { title: "Mağazalar | LEO Concept" };

export default function MagazalarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-bronze">
        Sizi Bekliyoruz
      </p>
      <h1 className="mt-3 text-center text-4xl md:text-5xl">Mağazalar</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <BranchCard key={b.name} {...b} />
        ))}
      </div>
    </div>
  );
}
