"use client";

import { useActionState, useEffect, useState } from "react";
import { sendQuoteRequest, type QuoteFormState } from "@/lib/quote-action";

const initialState: QuoteFormState = {};

export default function QuoteModal({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    sendQuoteRequest,
    initialState
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="whitespace-nowrap rounded-full border border-charcoal bg-white px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-charcoal hover:text-ivory"
      >
        Bilgi &amp; Teklif Al
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Bilgi ve teklif formu"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] rounded-tr-[4rem] bg-ivory shadow-2xl"
          >
            {/* Üst şerit */}
            <div className="bg-gradient-to-r from-charcoal to-charcoal/90 px-8 pb-6 pt-7 text-ivory">
              <span className="text-xs font-semibold tracking-widest uppercase text-bronze">
                Bilgi &amp; Teklif
              </span>
              <h2 className="mt-1 font-heading text-2xl">{productName}</h2>
              <p className="mt-1 text-sm text-ivory/60">
                Formu doldurun, size en kısa sürede dönelim.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute right-5 top-4 text-3xl leading-none text-ivory/70 transition-colors hover:text-ivory"
            >
              ×
            </button>

            <div className="px-8 py-7">
              {state.success ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bronze/15 text-2xl text-bronze">
                    ✓
                  </div>
                  <p className="text-lg">Talebiniz alındı!</p>
                  <p className="mt-1 text-sm text-ink/60">
                    En kısa sürede size dönüş yapacağız.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-6 rounded-full bg-charcoal px-8 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-bronze-dark"
                  >
                    Kapat
                  </button>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="product" value={productName} />
                  <input
                    name="name"
                    placeholder="Adınız Soyadınız *"
                    required
                    className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 outline-none transition-colors focus:border-bronze"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Telefon *"
                      required
                      className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 outline-none transition-colors focus:border-bronze"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="E-posta *"
                      required
                      className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 outline-none transition-colors focus:border-bronze"
                    />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Eklemek istedikleriniz (ölçü, renk, adet...)"
                    rows={3}
                    className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 outline-none transition-colors focus:border-bronze"
                  />
                  {state.error && (
                    <p className="text-sm text-red-600">{state.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-full bg-charcoal py-3.5 text-sm font-semibold tracking-widest uppercase text-ivory transition-colors hover:bg-bronze-dark disabled:opacity-50"
                  >
                    {pending ? "Gönderiliyor..." : "Teklif İste"}
                  </button>
                  <p className="text-center text-xs text-ink/40">
                    Bilgileriniz yalnızca size dönüş yapmak için kullanılır.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
