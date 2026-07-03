"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <form
        action={formAction}
        className="w-full max-w-sm bg-white p-8 shadow-xl"
      >
        <h1 className="mb-1 text-center text-2xl">LEO Concept</h1>
        <p className="mb-8 text-center text-sm text-ink/50">Yönetim Paneli</p>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-ink/70">E-posta</span>
          <input
            name="email"
            type="email"
            required
            autoFocus
            className="w-full border border-sand px-4 py-2.5 outline-none focus:border-bronze"
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm text-ink/70">Şifre</span>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-sand px-4 py-2.5 outline-none focus:border-bronze"
          />
        </label>

        {state.error && (
          <p className="mb-4 text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-charcoal py-3 text-sm tracking-widest uppercase text-ivory transition-colors hover:bg-bronze-dark disabled:opacity-50"
        >
          {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
