"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const topics = ["Product enquiry", "Place an order", "Custom request", "Order & delivery", "Collaboration"];

// UI only — submission will be wired to the backend later.
export function ContactForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-start border border-sand bg-linen/60 p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-white">
          <Check className="size-5" />
        </span>
        <h2 className="mt-6 font-serif text-4xl font-light">Thank you</h2>
        <p className="mt-3 max-w-md leading-relaxed text-taupe">
          Your message has been received. A member of our client care team will
          be in touch within one business day.
        </p>
        <button onClick={() => setSent(false)} className="btn-outline mt-8">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="text-xs tracking-[0.2em] uppercase">How can we help?</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTopic(t)}
            className={`border px-4 py-2 text-xs transition ${
              topic === t ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <input required className="input-lux" placeholder="First name *" />
        <input required className="input-lux" placeholder="Last name *" />
        <input required type="email" className="input-lux" placeholder="Email address *" />
        <input className="input-lux" placeholder="Phone (optional)" />
        {(topic === "Place an order" || topic === "Custom request") && (
          <input className="input-lux sm:col-span-2" placeholder="Which piece are you interested in?" />
        )}
        <textarea
          required
          rows={5}
          className="input-lux resize-none sm:col-span-2"
          placeholder="Your message *"
        />
      </div>

      <label className="mt-8 flex items-start gap-3 text-xs text-taupe">
        <input type="checkbox" className="mt-0.5 accent-ink" />
        I&apos;d like to receive news about new pieces and collections from
        Roze Déco.
      </label>

      <button type="submit" className="btn-dark mt-10">
        Send message
      </button>
    </form>
  );
}
