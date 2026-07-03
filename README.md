# LEO Concept

Mobilya ve tasarım firması için özel geliştirilmiş kurumsal web sitesi + yönetim paneli.

Demo/taslak referans: https://webretawork2.com.tr/leo/ (WordPress) — bu proje aynı içerik yapısını özel yazılım olarak yeniden inşa eder.

## Teknolojiler

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4**
- **Prisma 7** + **SQLite** (better-sqlite3 adapter — ileride PostgreSQL'e geçiş kolay)
- Oturum: **jose** (JWT, httpOnly cookie) + **bcryptjs**

## Kurulum

```bash
npm install            # prisma generate otomatik çalışır (postinstall)
cp .env.example .env   # değerleri düzenleyin
npm run db:push        # veritabanını oluşturur
npm run db:seed        # örnek içerik + admin kullanıcısı
npm run dev
```

- Site: http://localhost:3000
- Yönetim paneli: http://localhost:3000/admin
  - Varsayılan giriş: `.env` içindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD` (seed ile oluşturulur)

## Yönetim Panelinden Yönetilebilenler

| Bölüm | İçerik |
|---|---|
| Slider | Ana sayfa hero slaytları (görsel, başlık, buton) |
| Kategoriler | İç/dış mekan kategorileri, görsel, sıra |
| Ürünler | Kategoriye bağlı ürünler, çoklu görsel, açıklama |
| Kataloglar | Koleksiyonlar, kapak görseli, PDF katalog |
| Mağazalar | Adres, telefon, harita linki |
| SSS | Merak edilenler soru/cevap |
| Mesajlar | İletişim formundan gelen mesajlar |
| Site Ayarları | Logo, iletişim bilgileri, sosyal medya, SEO meta |

Görsel/PDF yüklemeleri `public/uploads/` klasörüne kaydedilir (git'e dahil değildir).

## Sayfa Yapısı

```
/                    Ana sayfa (hero, kategoriler, kataloglar, özel tasarım)
/kategoriler         Kategori listesi
/kategoriler/[slug]  Kategori ürünleri
/urunler/[slug]      Ürün detayı (teklif CTA)
/kataloglar          Katalog/koleksiyonlar
/ozel-tasarim        Özel tasarım tanıtımı
/merak-edilenler     SSS
/magazalar           Mağazalar
/iletisim            İletişim formu
/admin               Yönetim paneli (oturum korumalı)
```

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # production build
npm run start      # production sunucu
npm run db:push    # şemayı veritabanına uygula
npm run db:seed    # örnek verileri yükle
npm run db:studio  # Prisma Studio (görsel DB arayüzü)
```

## Notlar

- Production'da `.env` içindeki `SESSION_SECRET` mutlaka uzun ve rastgele bir değerle değiştirilmelidir.
- `prisma/dev.db` (SQLite) ve `public/uploads/` git'e dahil edilmez; sunucuda kalıcı disk gerektirir.
