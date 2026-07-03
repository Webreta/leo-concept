import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { saveFaq, deleteFaq } from "../actions";
import {
  PageTitle, Field, inputCls, SubmitButton, DeleteButton,
  ActiveBadge, tableCls, thCls, tdCls,
} from "@/components/admin/ui";

export default async function AdminSssPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const sp = await searchParams;
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  const editing = sp.edit ? faqs.find((f) => f.id === sp.edit) : undefined;
  const showForm = Boolean(sp.new || editing);

  return (
    <div>
      <PageTitle
        title="Merak Edilenler (SSS)"
        action={{ href: "/admin/sss?new=1", label: "+ Yeni Soru" }}
      />

      {showForm && (
        <form
          action={saveFaq}
          className="mb-10 max-w-2xl space-y-4 border border-sand bg-white p-6"
        >
          <h2 className="text-xl">{editing ? "Düzenle" : "Yeni Soru"}</h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Soru *">
            <input name="question" required defaultValue={editing?.question} className={inputCls} />
          </Field>
          <Field label="Cevap *">
            <textarea name="answer" required rows={4} defaultValue={editing?.answer} className={inputCls} />
          </Field>
          <Field label="Sıra">
            <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} />
            Aktif
          </label>
          <div className="flex gap-3">
            <SubmitButton>Kaydet</SubmitButton>
            <Link href="/admin/sss" className="px-4 py-2.5 text-sm text-ink/60 hover:text-ink">
              Vazgeç
            </Link>
          </div>
        </form>
      )}

      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Soru</th>
            <th className={thCls}>Sıra</th>
            <th className={thCls}>Durum</th>
            <th className={thCls}></th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((f) => (
            <tr key={f.id}>
              <td className={tdCls}>{f.question}</td>
              <td className={tdCls}>{f.sortOrder}</td>
              <td className={tdCls}><ActiveBadge active={f.isActive} /></td>
              <td className={`${tdCls} space-x-3 text-right`}>
                <Link href={`/admin/sss?edit=${f.id}`} className="text-sm text-bronze hover:underline">
                  Düzenle
                </Link>
                <DeleteButton action={deleteFaq} id={f.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
