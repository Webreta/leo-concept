import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { saveHeroSlide, deleteHeroSlide } from "../actions";
import ImageInput from "@/components/admin/ImageInput";
import {
  PageTitle, Field, inputCls, SubmitButton, DeleteButton,
  ActiveBadge, tableCls, thCls, tdCls,
} from "@/components/admin/ui";

export default async function AdminSliderPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const sp = await searchParams;
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const editing = sp.edit ? slides.find((s) => s.id === sp.edit) : undefined;
  const showForm = Boolean(sp.new || editing);

  return (
    <div>
      <PageTitle
        title="Hero Slider"
        action={{ href: "/admin/slider?new=1", label: "+ Yeni Slide" }}
      />

      {showForm && (
        <form
          action={saveHeroSlide}
          className="mb-10 max-w-2xl space-y-4 border border-sand bg-white p-6"
        >
          <h2 className="text-xl">
            {editing ? `Düzenle: ${editing.title}` : "Yeni Slide"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Başlık *">
            <input name="title" required defaultValue={editing?.title} className={inputCls} />
          </Field>
          <Field label="Alt Başlık">
            <input name="subtitle" defaultValue={editing?.subtitle ?? ""} className={inputCls} />
          </Field>
          <ImageInput name="imageUrl" label="Arka Plan Görseli *" defaultValue={editing?.imageUrl} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Buton Metni">
              <input name="buttonText" defaultValue={editing?.buttonText ?? ""} className={inputCls} />
            </Field>
            <Field label="Buton Linki">
              <input name="buttonUrl" defaultValue={editing?.buttonUrl ?? ""} placeholder="/kategoriler" className={inputCls} />
            </Field>
          </div>
          <Field label="Sıra">
            <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={editing?.isActive ?? true} />
            Aktif
          </label>
          <div className="flex gap-3">
            <SubmitButton>Kaydet</SubmitButton>
            <Link href="/admin/slider" className="px-4 py-2.5 text-sm text-ink/60 hover:text-ink">
              Vazgeç
            </Link>
          </div>
        </form>
      )}

      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Başlık</th>
            <th className={thCls}>Sıra</th>
            <th className={thCls}>Durum</th>
            <th className={thCls}></th>
          </tr>
        </thead>
        <tbody>
          {slides.map((s) => (
            <tr key={s.id}>
              <td className={tdCls}>{s.title}</td>
              <td className={tdCls}>{s.sortOrder}</td>
              <td className={tdCls}><ActiveBadge active={s.isActive} /></td>
              <td className={`${tdCls} space-x-3 text-right`}>
                <Link href={`/admin/slider?edit=${s.id}`} className="text-sm text-bronze hover:underline">
                  Düzenle
                </Link>
                <DeleteButton action={deleteHeroSlide} id={s.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
