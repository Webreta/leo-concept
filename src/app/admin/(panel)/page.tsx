import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [categories, products, collections, stores, faqs, unreadMessages] =
    await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.collection.count(),
      prisma.store.count(),
      prisma.faq.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

  const stats = [
    { label: "Kategori", value: categories, href: "/admin/kategoriler" },
    { label: "Ürün", value: products, href: "/admin/urunler" },
    { label: "Katalog", value: collections, href: "/admin/koleksiyonlar" },
    { label: "Mağaza", value: stores, href: "/admin/magazalar" },
    { label: "SSS", value: faqs, href: "/admin/sss" },
    { label: "Okunmamış Mesaj", value: unreadMessages, href: "/admin/mesajlar" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl">Panel</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border border-sand bg-white p-6 transition-colors hover:border-bronze"
          >
            <div className="text-4xl font-heading">{s.value}</div>
            <div className="mt-1 text-sm text-ink/60">{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
