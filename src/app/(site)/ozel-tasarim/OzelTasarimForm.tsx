"use client";

import { useActionState, useState } from "react";
import { sendDesignRequest, type DesignFormState } from "./actions";

const initialState: DesignFormState = {};

const inputClass =
  "w-full border-0 border-b border-ivory/25 bg-transparent px-0 py-3 text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-bronze";

export default function OzelTasarimForm() {
  const [state, formAction, pending] = useActionState(
    sendDesignRequest,
    initialState
  );
  const [fileNames, setFileNames] = useState<string[]>([]);

  if (state.success) {
    return (
      <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bronze/60 bg-bronze/15 text-2xl text-bronze">
          ✓
        </span>
        <p className="mt-6 text-xl text-ivory">Talebiniz alındı.</p>
        <p className="mt-2 text-ivory/60">
          Tasarım ekibimiz en kısa sürede sizinle iletişime geçecek.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <input
          name="name"
          placeholder="Adınız Soyadınız *"
          required
          className={inputClass}
        />
        <input name="phone" placeholder="Telefon" className={inputClass} />
      </div>
      <input
        name="email"
        type="email"
        placeholder="E-posta *"
        required
        className={inputClass}
      />
      {/* Mekan seçimi — radyo yerine pill etiketler */}
      <fieldset>
        <legend className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory/50">
          Proje Alanı
        </legend>
        <div className="flex flex-wrap gap-3">
          {["İç Mekan", "Dış Mekan", "Her İkisi"].map((label) => (
            <label key={label} className="cursor-pointer">
              <input
                type="radio"
                name="area"
                value={label}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-ivory/30 px-5 py-2 text-sm text-ivory/70 transition-colors peer-checked:border-bronze peer-checked:bg-bronze/15 peer-checked:text-bronze hover:border-ivory/60">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <textarea
        name="message"
        placeholder="Projenizi anlatın: mekan, ölçüler, tarz, hayalinizdeki tasarım... *"
        required
        rows={5}
        className={`${inputClass} resize-none`}
      />
      {/* Dosya yükleme: kesikli çerçeveli alan, seçilen dosya adları altta */}
      <div>
        <label className="group/upload block cursor-pointer rounded-2xl border border-dashed border-ivory/30 px-6 py-7 text-center transition-colors hover:border-bronze/70">
          <input
            type="file"
            name="files"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
            className="sr-only"
            onChange={(e) =>
              setFileNames(
                Array.from(e.target.files ?? []).map((f) => f.name)
              )
            }
          />
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-bronze/50 bg-bronze/10 text-lg text-bronze transition-colors group-hover/upload:bg-bronze group-hover/upload:text-charcoal">
            +
          </span>
          <p className="mt-3 text-sm text-ivory/70">
            Kroki, ilham görseli veya plan ekleyin
          </p>
          <p className="mt-1 text-xs text-ivory/40">
            En fazla 3 dosya · JPG, PNG, WEBP veya PDF · dosya başına 10MB
          </p>
        </label>
        {fileNames.length > 0 && (
          <ul className="mt-3 space-y-1">
            {fileNames.map((n) => (
              <li
                key={n}
                className="flex items-center gap-2 text-sm text-ivory/70"
              >
                <span aria-hidden className="text-bronze">
                  ◆
                </span>
                {n}
              </li>
            ))}
          </ul>
        )}
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-3 rounded-full border border-bronze/60 bg-bronze/10 px-8 py-3.5 text-sm font-semibold tracking-[0.15em] uppercase text-bronze transition-colors hover:bg-bronze hover:text-charcoal disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Teklif İsteyin"}
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      </button>
    </form>
  );
}
