import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { saveCollection, deleteCollection } from "../actions";
import ImageInput from "@/components/admin/ImageInput";
import {
  PageTitle, Field, inputCls, SubmitButton, DeleteButton,
  ActiveBadge, tableCls, thCls, tdCls,
} from "@/components/admin/ui";

export default async function AdminKoleksiyonlarPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const sp = await searchParams;
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const editing = sp.edit
    ? collections.find((c) => c.id === sp.edit)
    : undefined;
  const showForm = Boolean(sp.new || editing);

  return (
    <div>
      <PageTitle
        title="Kataloglar"
        action={{ href: "/admin/koleksiyonlar?new=1", label: "+ Yeni Katalog" }}
      />

      {showForm && (
        <form
          action={saveCollection}
          className="mb-10 max-w-2xl space-y-4 border border-sand bg-white p-6"
        >
          <h2 className="text-xl">
            {editing ? `Düzenle: ${editing.name}` : "Yeni Katalog"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Katalog Adı *">
            <input name="name" required defaultValue={editing?.name} className={inputCls} />
          </Field>
          <Field label="Slug (boş bırakılırsa otomatik)">
            <input name="slug" defaultValue={editing?.slug} className={inputCls} />
          </Field>
          <Field label="Açıklama">
            <textarea name="description" rows={3} defaultValue={editing?.description ?? ""} className={inputCls} />
          </Field>
          <ImageInput name="coverUrl" label="Kapak Görseli" defaultValue={editing?.coverUrl} />
          <ImageInput
            name="pdfUrl"
            label="Katalog PDF"
            defaultValue={editing?.pdfUrl}
            accept="application/pdf"
          />
          <Field label="Sıra">
            <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} />
            Aktif
          </label>
          <div className="flex gap-3">
            <SubmitButton>Kaydet</SubmitButton>
            <Link href="/admin/koleksiyonlar" className="px-4 py-2.5 text-sm text-ink/60 hover:text-ink">
              Vazgeç
            </Link>
          </div>
        </form>
      )}

      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Ad</th>
            <th className={thCls}>PDF</th>
            <th className={thCls}>Sıra</th>
            <th className={thCls}>Durum</th>
            <th className={thCls}></th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id}>
              <td className={tdCls}>{c.name}</td>
              <td className={tdCls}>{c.pdfUrl ? "✓" : "—"}</td>
              <td className={tdCls}>{c.sortOrder}</td>
              <td className={tdCls}><ActiveBadge active={c.isActive} /></td>
              <td className={`${tdCls} space-x-3 text-right`}>
                <Link href={`/admin/koleksiyonlar?edit=${c.id}`} className="text-sm text-bronze hover:underline">
                  Düzenle
                </Link>
                <DeleteButton action={deleteCollection} id={c.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
