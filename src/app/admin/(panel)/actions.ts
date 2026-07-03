"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optStr(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v === "" ? null : v;
}

function num(formData: FormData, key: string): number {
  return Number(formData.get(key) ?? 0) || 0;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

// ---------- Hero Slider ----------

export async function saveHeroSlide(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    title: str(formData, "title"),
    subtitle: optStr(formData, "subtitle"),
    imageUrl: str(formData, "imageUrl"),
    buttonText: optStr(formData, "buttonText"),
    buttonUrl: optStr(formData, "buttonUrl"),
    sortOrder: num(formData, "sortOrder"),
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.heroSlide.update({ where: { id }, data });
  else await prisma.heroSlide.create({ data });
  revalidateSite();
  redirect("/admin/slider");
}

export async function deleteHeroSlide(formData: FormData) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
  revalidatePath("/admin/slider");
}

// ---------- Kategoriler ----------

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const name = str(formData, "name");
  const data = {
    name,
    slug: optStr(formData, "slug") ?? slugify(name),
    description: optStr(formData, "description"),
    imageUrl: optStr(formData, "imageUrl"),
    area: str(formData, "area") || "ic-mekan",
    sortOrder: num(formData, "sortOrder"),
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidateSite();
  redirect("/admin/kategoriler");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
  revalidatePath("/admin/kategoriler");
}

// ---------- Ürünler ----------

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const name = str(formData, "name");
  const data = {
    name,
    slug: optStr(formData, "slug") ?? slugify(name),
    description: optStr(formData, "description"),
    categoryId: str(formData, "categoryId"),
    isFeatured: bool(formData, "isFeatured"),
    sortOrder: num(formData, "sortOrder"),
    isActive: bool(formData, "isActive"),
  };

  // Görseller: her satırda bir URL (textarea)
  const imageUrls = str(formData, "imageUrls")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (id) {
    await prisma.product.update({ where: { id }, data });
    await prisma.productImage.deleteMany({ where: { productId: id } });
    if (imageUrls.length) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          url,
          productId: id,
          sortOrder: i,
        })),
      });
    }
  } else {
    await prisma.product.create({
      data: {
        ...data,
        images: {
          create: imageUrls.map((url, i) => ({ url, sortOrder: i })),
        },
      },
    });
  }
  revalidateSite();
  redirect("/admin/urunler");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
  revalidatePath("/admin/urunler");
}

// ---------- Kataloglar / Koleksiyonlar ----------

export async function saveCollection(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const name = str(formData, "name");
  const data = {
    name,
    slug: optStr(formData, "slug") ?? slugify(name),
    description: optStr(formData, "description"),
    coverUrl: optStr(formData, "coverUrl"),
    pdfUrl: optStr(formData, "pdfUrl"),
    sortOrder: num(formData, "sortOrder"),
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.collection.update({ where: { id }, data });
  else await prisma.collection.create({ data });
  revalidateSite();
  redirect("/admin/koleksiyonlar");
}

export async function deleteCollection(formData: FormData) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
  revalidatePath("/admin/koleksiyonlar");
}

// ---------- Mağazalar ----------

export async function saveStore(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    name: str(formData, "name"),
    address: str(formData, "address"),
    phone: optStr(formData, "phone"),
    mapUrl: optStr(formData, "mapUrl"),
    imageUrl: optStr(formData, "imageUrl"),
    sortOrder: num(formData, "sortOrder"),
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.store.update({ where: { id }, data });
  else await prisma.store.create({ data });
  revalidateSite();
  redirect("/admin/magazalar");
}

export async function deleteStore(formData: FormData) {
  await requireAdmin();
  await prisma.store.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
  revalidatePath("/admin/magazalar");
}

// ---------- SSS ----------

export async function saveFaq(formData: FormData) {
  await requireAdmin();
  const id = optStr(formData, "id");
  const data = {
    question: str(formData, "question"),
    answer: str(formData, "answer"),
    sortOrder: num(formData, "sortOrder"),
    isActive: bool(formData, "isActive"),
  };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  revalidateSite();
  redirect("/admin/sss");
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id: str(formData, "id") } });
  revalidateSite();
  revalidatePath("/admin/sss");
}

// ---------- Mesajlar ----------

export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (msg) {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: !msg.isRead },
    });
  }
  revalidatePath("/admin/mesajlar");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/mesajlar");
}

// ---------- Site Ayarları ----------

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const data = {
    siteName: str(formData, "siteName") || "LEO Concept",
    logoUrl: optStr(formData, "logoUrl"),
    phone: optStr(formData, "phone"),
    email: optStr(formData, "email"),
    address: optStr(formData, "address"),
    facebookUrl: optStr(formData, "facebookUrl"),
    instagramUrl: optStr(formData, "instagramUrl"),
    linkedinUrl: optStr(formData, "linkedinUrl"),
    footerText: optStr(formData, "footerText"),
    metaTitle: optStr(formData, "metaTitle"),
    metaDescription: optStr(formData, "metaDescription"),
    outdoorImageUrl: optStr(formData, "outdoorImageUrl"),
    outdoorText: optStr(formData, "outdoorText"),
    indoorImageUrl: optStr(formData, "indoorImageUrl"),
    indoorText: optStr(formData, "indoorText"),
  };
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidateSite();
  revalidatePath("/admin/ayarlar");
}
