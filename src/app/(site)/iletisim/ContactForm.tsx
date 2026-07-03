"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState
  );

  if (state.success) {
    return (
      <div className="border border-bronze/40 bg-white p-8 text-center">
        <p className="text-lg">
          Mesajınız alındı. En kısa sürede size dönüş yapacağız.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <input
          name="name"
          placeholder="Adınız Soyadınız *"
          required
          className="w-full border border-sand bg-white px-4 py-3 outline-none focus:border-bronze"
        />
        <input
          name="phone"
          placeholder="Telefon"
          className="w-full border border-sand bg-white px-4 py-3 outline-none focus:border-bronze"
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="E-posta *"
        required
        className="w-full border border-sand bg-white px-4 py-3 outline-none focus:border-bronze"
      />
      <textarea
        name="message"
        placeholder="Mesajınız *"
        required
        rows={6}
        className="w-full border border-sand bg-white px-4 py-3 outline-none focus:border-bronze"
      />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-charcoal px-8 py-3 text-sm tracking-widest uppercase text-ivory transition-colors hover:bg-bronze-dark disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
