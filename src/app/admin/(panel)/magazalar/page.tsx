import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { saveStore, deleteStore } from "../actions";
import ImageInput from "@/components/admin/ImageInput";
import {
  PageTitle, Field, inputCls, SubmitButton, DeleteButton,
  ActiveBadge, tableCls, thCls, tdCls,
} from "@/components/admin/ui";

export default async function AdminMagazalarPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const sp = await searchParams;
  const stores = await prisma.store.findMany({ orderBy: { sortOrder: "asc" } });
  const editing = sp.edit ? stores.find((s) => s.id === sp.edit) : undefined;
  const showForm = Boolean(sp.new || editing);

  return (
    <div>
      <PageTitle
        title="Mağazalar"
        action={{ href: "/admin/magazalar?new=1", label: "+ Yeni Mağaza" }}
      />

      {showForm && (
        <form
          action={saveStore}
          className="mb-10 max-w-2xl space-y-4 border border-sand bg-white p-6"
        >
          <h2 className="text-xl">
            {editing ? `Düzenle: ${editing.name}` : "Yeni Mağaza"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Mağaza Adı *">
            <input name="name" required defaultValue={editing?.name} className={inputCls} />
          </Field>
          <Field label="Adres *">
            <textarea name="address" required rows={2} defaultValue={editing?.address} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefon">
              <input name="phone" defaultValue={editing?.phone ?? ""} className={inputCls} />
            </Field>
            <Field label="Harita Linki (Google Maps)">
              <input name="mapUrl" defaultValue={editing?.mapUrl ?? ""} className={inputCls} />
            </Field>
          </div>
          <ImageInput name="imageUrl" label="Mağaza Görseli" defaultValue={editing?.imageUrl} />
          <Field label="Sıra">
            <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} />
            Aktif
          </label>
          <div className="flex gap-3">
            <SubmitButton>Kaydet</SubmitButton>
            <Link href="/admin/magazalar" className="px-4 py-2.5 text-sm text-ink/60 hover:text-ink">
              Vazgeç
            </Link>
          </div>
        </form>
      )}

      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Ad</th>
            <th className={thCls}>Telefon</th>
            <th className={thCls}>Durum</th>
            <th className={thCls}></th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td className={tdCls}>{s.name}</td>
              <td className={tdCls}>{s.phone ?? "—"}</td>
              <td className={tdCls}><ActiveBadge active={s.isActive} /></td>
              <td className={`${tdCls} space-x-3 text-right`}>
                <Link href={`/admin/magazalar?edit=${s.id}`} className="text-sm text-bronze hover:underline">
                  Düzenle
                </Link>
                <DeleteButton action={deleteStore} id={s.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
