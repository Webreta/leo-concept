"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "Adınızı girin"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalı"),
});

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  return { success: true };
}
