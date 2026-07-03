// Admin panelde tekrar eden küçük form/tablo parçaları
import Link from "next/link";

export function PageTitle({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl">{title}</h1>
      {action && (
        <Link
          href={action.href}
          className="bg-charcoal px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-bronze-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-ink/70">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-bronze";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="bg-charcoal px-6 py-2.5 text-sm tracking-wide text-ivory transition-colors hover:bg-bronze-dark"
    >
      {children}
    </button>
  );
}

export function DeleteButton({
  action,
  id,
}: {
  action: (formData: FormData) => void;
  id: string;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-red-600 hover:underline">Sil</button>
    </form>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs ${
        active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
      }`}
    >
      {active ? "Aktif" : "Pasif"}
    </span>
  );
}

export const tableCls = "w-full border-collapse bg-white text-sm";
export const thCls =
  "border-b border-sand px-4 py-3 text-left font-medium text-ink/60";
export const tdCls = "border-b border-sand px-4 py-3";
