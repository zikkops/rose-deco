"use client";

import { useState } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { deleteMessage, markMessageRead, useMessages } from "@/lib/store";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Beirut" });

export function Inbox() {
  const messages = useMessages();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = messages.find((m) => m.id === activeId) ?? messages[0];

  if (messages.length === 0) {
    return <div className="card-admin p-12 text-center text-stone">No messages yet. Messages sent from the Contact page appear here.</div>;
  }

  return (
    <div className="card-admin grid overflow-hidden lg:h-[calc(100vh-210px)] lg:grid-cols-[360px_1fr]">
      <ul className="max-h-72 divide-y divide-sand/50 overflow-y-auto border-b border-sand/60 lg:max-h-none lg:border-r lg:border-b-0">
        {messages.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => {
                setActiveId(m.id);
                if (!m.read) markMessageRead(m.id);
              }}
              className={`block w-full p-4 text-left ${active?.id === m.id ? "bg-linen/60" : "hover:bg-linen/30"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm ${m.read ? "" : "font-semibold"}`}>
                  {!m.read && <span className="mr-2 inline-block size-2 rounded-full bg-ink" />}
                  {m.name || "—"}
                </p>
                <span className="text-[11px] whitespace-nowrap text-stone">{fmtDate(m.createdAt)}</span>
              </div>
              <p className="mt-0.5 text-xs text-taupe">{m.topic}</p>
              <p className="mt-1 line-clamp-2 text-xs text-stone">{m.message}</p>
            </button>
          </li>
        ))}
      </ul>
      {active && (
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-sand/60 p-5">
            <div>
              <p className="text-xs text-taupe">{active.topic}</p>
              <h2 className="mt-1 font-serif text-2xl">{active.name}</h2>
              <p className="text-xs text-stone">{fmtDate(active.createdAt)}</p>
            </div>
            <button onClick={() => { deleteMessage(active.id); setActiveId(null); }} className="rounded-md border border-sand p-2 text-stone hover:text-danger" aria-label="Delete message">
              <Trash2 className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed whitespace-pre-line text-taupe">{active.message}</div>
          <div className="flex flex-wrap gap-2 border-t border-sand/60 p-4">
            {active.email && (
              <a href={`mailto:${active.email}?subject=${encodeURIComponent("Re: " + active.topic)}`} className="flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
                <Mail className="size-4" /> Reply by email
              </a>
            )}
            {active.phone && (
              <a href={`tel:${active.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-md border border-sand px-4 py-2 text-sm hover:border-ink">
                <Phone className="size-4" /> {active.phone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
