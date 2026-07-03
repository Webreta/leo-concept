import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { saveCategory, deleteCategory } from "../actions";
import ImageInput from "@/components/admin/ImageInput";
import {
  PageTitle, Field, inputCls, SubmitButton, DeleteButton,
  ActiveBadge, tableCls, thCls, tdCls,
} from "@/components/admin/ui";

export default async function AdminKategorilerPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  const editing = sp.edit
    ? categories.find((c) => c.id === sp.edit)
    : undefined;
  const showForm = Boolean(sp.new || editing);

  return (
    <div>
      <PageTitle
        title="Kategoriler"
        action={{ href: "/admin/kategoriler?new=1", label: "+ Yeni Kategori" }}
      />

      {showForm && (
        <form
          action={saveCategory}
          className="mb-10 max-w-2xl space-y-4 border border-sand bg-white p-6"
        >
          <h2 className="text-xl">
            {editing ? `Düzenle: ${editing.name}` : "Yeni Kategori"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Kategori Adı *">
            <input name="name" required defaultValue={editing?.name} className={inputCls} />
          </Field>
          <Field label="Slug (boş bırakılırsa otomatik)">
            <input name="slug" defaultValue={editing?.slug} className={inputCls} />
          </Field>
          <Field label="Açıklama">
            <textarea name="description" rows={3} defaultValue={editing?.description ?? ""} className={inputCls} />
          </Field>
          <ImageInput name="imageUrl" label="Kategori Görseli" defaultValue={editing?.imageUrl} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Alan">
              <select name="area" defaultValue={editing?.area ?? "ic-mekan"} className={inputCls}>
                <option value="ic-mekan">İç Mekan</option>
                <option value="dis-mekan">Dış Mekan</option>
              </select>
            </Field>
            <Field label="Sıra">
              <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className={inputCls} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} />
            Aktif
          </label>
          <div className="flex gap-3">
            <SubmitButton>Kaydet</SubmitButton>
            <Link href="/admin/kategoriler" className="px-4 py-2.5 text-sm text-ink/60 hover:text-ink">
              Vazgeç
            </Link>
          </div>
        </form>
      )}

      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Ad</th>
            <th className={thCls}>Alan</th>
            <th className={thCls}>Ürün</th>
            <th className={thCls}>Sıra</th>
            <th className={thCls}>Durum</th>
            <th className={thCls}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className={tdCls}>{c.name}</td>
              <td className={tdCls}>{c.area === "dis-mekan" ? "Dış Mekan" : "İç Mekan"}</td>
              <td className={tdCls}>{c._count.products}</td>
              <td className={tdCls}>{c.sortOrder}</td>
              <td className={tdCls}><ActiveBadge active={c.isActive} /></td>
              <td className={`${tdCls} space-x-3 text-right`}>
                <Link href={`/admin/kategoriler?edit=${c.id}`} className="text-sm text-bronze hover:underline">
                  Düzenle
                </Link>
                <DeleteButton action={deleteCategory} id={c.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
