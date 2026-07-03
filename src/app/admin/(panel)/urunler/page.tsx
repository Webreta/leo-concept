import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { saveProduct, deleteProduct } from "../actions";
import ImageInput from "@/components/admin/ImageInput";
import {
  PageTitle, Field, inputCls, SubmitButton, DeleteButton,
  ActiveBadge, tableCls, thCls, tdCls,
} from "@/components/admin/ui";

export default async function AdminUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const editing = sp.edit ? products.find((p) => p.id === sp.edit) : undefined;
  const showForm = Boolean(sp.new || editing);

  return (
    <div>
      <PageTitle
        title="Ürünler"
        action={{ href: "/admin/urunler?new=1", label: "+ Yeni Ürün" }}
      />

      {showForm && (
        <form
          action={saveProduct}
          className="mb-10 max-w-2xl space-y-4 border border-sand bg-white p-6"
        >
          <h2 className="text-xl">
            {editing ? `Düzenle: ${editing.name}` : "Yeni Ürün"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Ürün Adı *">
            <input name="name" required defaultValue={editing?.name} className={inputCls} />
          </Field>
          <Field label="Slug (boş bırakılırsa otomatik)">
            <input name="slug" defaultValue={editing?.slug} className={inputCls} />
          </Field>
          <Field label="Kategori *">
            <select name="categoryId" required defaultValue={editing?.categoryId} className={inputCls}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Açıklama">
            <textarea name="description" rows={4} defaultValue={editing?.description ?? ""} className={inputCls} />
          </Field>
          <Field label="Görsel URL'leri (her satıra bir adet)">
            <textarea
              name="imageUrls"
              rows={4}
              defaultValue={editing?.images.map((i) => i.url).join("\n") ?? ""}
              placeholder={"/uploads/koltuk-1.jpg\n/uploads/koltuk-2.jpg"}
              className={inputCls}
            />
          </Field>
          <ImageInput
            name="_uploadHelper"
            label="Görsel Yükle (yüklenen dosyanın URL'ini yukarıdaki listeye yapıştırın)"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sıra">
              <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className={inputCls} />
            </Field>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isFeatured" defaultChecked={editing?.isFeatured ?? false} />
                Öne Çıkan
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} />
                Aktif
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <SubmitButton>Kaydet</SubmitButton>
            <Link href="/admin/urunler" className="px-4 py-2.5 text-sm text-ink/60 hover:text-ink">
              Vazgeç
            </Link>
          </div>
        </form>
      )}

      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Ürün</th>
            <th className={thCls}>Kategori</th>
            <th className={thCls}>Görsel</th>
            <th className={thCls}>Durum</th>
            <th className={thCls}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className={tdCls}>{p.name}</td>
              <td className={tdCls}>{p.category.name}</td>
              <td className={tdCls}>{p.images.length} görsel</td>
              <td className={tdCls}><ActiveBadge active={p.isActive} /></td>
              <td className={`${tdCls} space-x-3 text-right`}>
                <Link href={`/admin/urunler?edit=${p.id}`} className="text-sm text-bronze hover:underline">
                  Düzenle
                </Link>
                <DeleteButton action={deleteProduct} id={p.id} />
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td className={`${tdCls} text-center text-ink/50`} colSpan={5}>
                Henüz ürün yok. &quot;+ Yeni Ürün&quot; ile ekleyin.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
