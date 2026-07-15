"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const quoteSchema = z.object({
  name: z.string().min(2, "Adınızı girin"),
  phone: z.string().min(7, "Geçerli bir telefon numarası girin"),
  email: z.string().email("Geçerli bir e-posta girin"),
  product: z.string().min(1),
  note: z.string().optional(),
});

export type QuoteFormState = {
  success?: boolean;
  error?: string;
};

export async function sendQuoteRequest(
  _prev: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const parsed = quoteSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    product: formData.get("product"),
    note: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, phone, email, product, note } = parsed.data;
  const message = `[Teklif Talebi] Ürün: ${product}${note ? `\n\n${note}` : ""}`;
  await prisma.contactMessage.create({
    data: { name, phone, email, message },
  });
  return { success: true };
}
