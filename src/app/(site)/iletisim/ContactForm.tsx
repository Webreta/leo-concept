"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = {};

// Özel Tasarım formuyla aynı dark stil: alt çizgili şeffaf inputlar
const inputClass =
  "w-full border-0 border-b border-ivory/25 bg-transparent px-0 py-3 text-ivory placeholder:text-ivory/40 outline-none transition-colors focus:border-bronze";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bronze/60 bg-bronze/15 text-2xl text-bronze">
          ✓
        </span>
        <p className="mt-6 text-xl text-ivory">Mesajınız alındı.</p>
        <p className="mt-2 text-ivory/60">
          En kısa sürede size dönüş yapacağız.
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
      <textarea
        name="message"
        placeholder="Mesajınız *"
        required
        rows={5}
        className={`${inputClass} resize-none`}
      />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-3 rounded-full border border-bronze/60 bg-bronze/10 px-8 py-3.5 text-sm font-semibold tracking-[0.15em] uppercase text-bronze transition-colors hover:bg-bronze hover:text-charcoal disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Gönder"}
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
