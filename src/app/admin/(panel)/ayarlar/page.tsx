import { prisma } from "@/lib/prisma";
import { saveSettings } from "../actions";
import ImageInput from "@/components/admin/ImageInput";
import { PageTitle, Field, inputCls, SubmitButton } from "@/components/admin/ui";

export default async function AdminAyarlarPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div>
      <PageTitle title="Site Ayarları" />

      <form
        action={saveSettings}
        className="max-w-2xl space-y-4 border border-sand bg-white p-6"
      >
        <Field label="Site Adı *">
          <input name="siteName" required defaultValue={s?.siteName ?? "LEO Concept"} className={inputCls} />
        </Field>
        <ImageInput name="logoUrl" label="Logo" defaultValue={s?.logoUrl} />

        <h2 className="pt-4 text-lg">İletişim Bilgileri</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefon">
            <input name="phone" defaultValue={s?.phone ?? ""} className={inputCls} />
          </Field>
          <Field label="E-posta">
            <input name="email" defaultValue={s?.email ?? ""} className={inputCls} />
          </Field>
        </div>
        <Field label="Adres">
          <textarea name="address" rows={2} defaultValue={s?.address ?? ""} className={inputCls} />
        </Field>

        <h2 className="pt-4 text-lg">Sosyal Medya</h2>
        <Field label="Facebook">
          <input name="facebookUrl" defaultValue={s?.facebookUrl ?? ""} className={inputCls} />
        </Field>
        <Field label="Instagram">
          <input name="instagramUrl" defaultValue={s?.instagramUrl ?? ""} className={inputCls} />
        </Field>
        <Field label="LinkedIn">
          <input name="linkedinUrl" defaultValue={s?.linkedinUrl ?? ""} className={inputCls} />
        </Field>

        <h2 className="pt-4 text-lg">Ana Sayfa Blokları</h2>
        <ImageInput name="outdoorImageUrl" label="Dış Mekan Görseli" defaultValue={s?.outdoorImageUrl} />
        <Field label="Dış Mekan Metni">
          <input name="outdoorText" defaultValue={s?.outdoorText ?? ""} className={inputCls} />
        </Field>
        <ImageInput name="indoorImageUrl" label="İç Mekan Görseli" defaultValue={s?.indoorImageUrl} />
        <Field label="İç Mekan Metni">
          <input name="indoorText" defaultValue={s?.indoorText ?? ""} className={inputCls} />
        </Field>

        <h2 className="pt-4 text-lg">İçerik &amp; SEO</h2>
        <Field label="Footer Metni">
          <textarea name="footerText" rows={2} defaultValue={s?.footerText ?? ""} className={inputCls} />
        </Field>
        <Field label="Meta Başlık">
          <input name="metaTitle" defaultValue={s?.metaTitle ?? ""} className={inputCls} />
        </Field>
        <Field label="Meta Açıklama">
          <textarea name="metaDescription" rows={2} defaultValue={s?.metaDescription ?? ""} className={inputCls} />
        </Field>

        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </div>
  );
}
