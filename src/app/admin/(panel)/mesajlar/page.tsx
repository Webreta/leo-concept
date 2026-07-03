import { prisma } from "@/lib/prisma";
import { toggleMessageRead, deleteMessage } from "../actions";
import { PageTitle, DeleteButton } from "@/components/admin/ui";

export default async function AdminMesajlarPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageTitle title="İletişim Mesajları" />

      {messages.length === 0 && (
        <p className="text-ink/50">Henüz mesaj yok.</p>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`border bg-white p-6 ${
              m.isRead ? "border-sand opacity-70" : "border-bronze"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="font-medium">{m.name}</span>
                <span className="ml-3 text-sm text-ink/60">{m.email}</span>
                {m.phone && (
                  <span className="ml-3 text-sm text-ink/60">{m.phone}</span>
                )}
              </div>
              <span className="text-xs text-ink/40">
                {m.createdAt.toLocaleString("tr-TR")}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
              {m.message}
            </p>
            <div className="mt-4 flex gap-4">
              <form action={toggleMessageRead}>
                <input type="hidden" name="id" value={m.id} />
                <button className="text-sm text-bronze hover:underline">
                  {m.isRead ? "Okunmadı işaretle" : "Okundu işaretle"}
                </button>
              </form>
              <DeleteButton action={deleteMessage} id={m.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
