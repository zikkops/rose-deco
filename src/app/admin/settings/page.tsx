import { PageHeader } from "@/components/admin/AdminShell";

export const metadata = { title: "Settings" };

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-sand/60 py-8 first:pt-0 lg:grid-cols-3">
      <div>
        <h2 className="font-medium">{title}</h2>
        <p className="mt-1 text-sm text-stone">{desc}</p>
      </div>
      <div className="card-admin grid gap-4 p-5 sm:grid-cols-2 lg:col-span-2">{children}</div>
    </section>
  );
}

function Field({ label, value, full, type = "text" }: { label: string; value?: string; full?: boolean; type?: string }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label-admin">{label}</label>
      <input type={type} className="input-admin" defaultValue={value} />
    </div>
  );
}

function Toggle({ label, on }: { label: string; on?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-sand/60 px-3 py-2.5 text-sm sm:col-span-2">
      {label}
      <input type="checkbox" defaultChecked={on} className="size-4 accent-ink" />
    </label>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Store configuration (preview only)"
        actions={<button className="rounded-md bg-ink px-5 py-2 text-sm text-ivory hover:bg-accent-dark">Save settings</button>}
      />
      <Section title="Store details" desc="Shown on invoices, emails and the contact page.">
        <Field label="Store name" value="Roze Déco" />
        <Field label="Contact email" value="hello@rozedeco.com" type="email" />
        <Field label="Phone" value="+961 1 234 567" />
        <Field label="Currency" value="USD ($)" />
        <Field label="Showroom address" value="24 Rue du Faubourg, Design District, Beirut" full />
      </Section>
      <Section title="Shipping" desc="Delivery thresholds and fees.">
        <Field label="Free white-glove delivery over" value="2500" type="number" />
        <Field label="Standard delivery fee" value="150" type="number" />
        <Toggle label="Offer international shipping" on />
        <Toggle label="Allow showroom pickup" on />
      </Section>
      <Section title="Notifications" desc="Who gets notified when things happen.">
        <Toggle label="Email me on new orders" on />
        <Toggle label="Email me on new contact messages" on />
        <Toggle label="Daily sales summary" />
        <Toggle label="Low-stock alerts (5 units or fewer)" on />
      </Section>
      <Section title="Team" desc="People with access to the back office.">
        {[
          ["Rozalie Haddad", "Owner"],
          ["Léa Fontaine", "Editor"],
          ["Client Care", "Support"],
        ].map(([n, r]) => (
          <div key={n} className="flex items-center justify-between rounded-md border border-sand/60 px-3 py-2.5 text-sm sm:col-span-2">
            <span>{n}</span>
            <span className="rounded-full bg-linen px-2.5 py-0.5 text-xs text-taupe">{r}</span>
          </div>
        ))}
      </Section>
    </>
  );
}
