import { PageHeader } from "@/components/admin/AdminShell";
import { Inbox } from "@/components/admin/Inbox";

export const metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Messages" subtitle="Enquiries submitted through the contact form" />
      <Inbox />
    </>
  );
}
