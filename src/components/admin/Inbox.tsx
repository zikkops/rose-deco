"use client";

import { useState } from "react";
import { Archive, Reply } from "lucide-react";
import { messages } from "@/lib/admin-data";

export function Inbox() {
  const [activeId, setActiveId] = useState(messages[0].id);
  const [read, setRead] = useState<string[]>([]);
  const active = messages.find((m) => m.id === activeId)!;

  return (
    <div className="card-admin grid overflow-hidden lg:h-[calc(100vh-210px)] lg:grid-cols-[360px_1fr]">
      <ul className="max-h-72 divide-y divide-sand/50 overflow-y-auto border-b lg:max-h-none border-sand/60 lg:border-r lg:border-b-0">
        {messages.map((m) => {
          const unread = m.unread && !read.includes(m.id);
          return (
            <li key={m.id}>
              <button
                onClick={() => {
                  setActiveId(m.id);
                  setRead((r) => [...r, m.id]);
                }}
                className={`block w-full p-4 text-left ${activeId === m.id ? "bg-accent-light/30" : "hover:bg-linen/40"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${unread ? "font-semibold" : ""}`}>
                    {unread && <span className="mr-2 inline-block size-2 rounded-full bg-accent" />}
                    {m.name}
                  </p>
                  <span className="text-[11px] whitespace-nowrap text-stone">{m.date.slice(5, 10)}</span>
                </div>
                <p className="mt-0.5 text-xs text-accent-dark">{m.topic}</p>
                <p className="mt-1 line-clamp-2 text-xs text-stone">{m.preview}</p>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-sand/60 p-5">
          <div>
            <p className="text-xs text-accent-dark">{active.topic}</p>
            <h2 className="mt-1 font-serif text-2xl">{active.name}</h2>
            <p className="text-xs text-stone">{active.email} · {active.date}</p>
          </div>
          <button className="rounded-md border border-sand p-2 text-stone hover:text-ink" aria-label="Archive">
            <Archive className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-taupe">
          <p>{active.preview}</p>
          <p className="mt-4">
            Please let me know what information you need from me. Looking
            forward to hearing from you.
          </p>
          <p className="mt-4">Kind regards,<br />{active.name}</p>
        </div>
        <div className="border-t border-sand/60 p-4">
          <textarea rows={3} className="input-admin" placeholder={`Reply to ${active.name.split(" ")[0]}…`} />
          <button className="mt-3 flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-ivory hover:bg-accent-dark">
            <Reply className="size-4" /> Send reply
          </button>
        </div>
      </div>
    </div>
  );
}
