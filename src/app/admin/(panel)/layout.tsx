import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/auth";

const menu = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/slider", label: "Slider" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/koleksiyonlar", label: "Kataloglar" },
  { href: "/admin/magazalar", label: "Mağazalar" },
  { href: "/admin/sss", label: "SSS" },
  { href: "/admin/mesajlar", label: "Mesajlar" },
  { href: "/admin/ayarlar", label: "Site Ayarları" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  async function logout() {
    "use server";
    await destroySession();
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <aside className="flex w-60 shrink-0 flex-col bg-charcoal text-ivory">
        <div className="border-b border-ivory/10 p-5">
          <div className="font-heading text-lg tracking-widest uppercase">
            LEO Concept
          </div>
          <div className="text-xs text-ivory/50">Yönetim Paneli</div>
        </div>
        <nav className="flex-1 p-3">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-3 py-2.5 text-sm transition-colors hover:bg-ivory/10 hover:text-bronze"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ivory/10 p-4">
          <div className="mb-2 truncate text-xs text-ivory/50">
            {session.email}
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="text-xs text-ivory/70 hover:text-bronze">
              Siteyi Gör →
            </Link>
            <form action={logout}>
              <button className="text-xs text-ivory/70 hover:text-bronze">
                Çıkış Yap
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
