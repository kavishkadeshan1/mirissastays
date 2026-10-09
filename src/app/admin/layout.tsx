import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkspaceNav from "@/components/layout/WorkspaceNav";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const u = await getCurrentUser();
  if (!u || u.role !== "admin" || u.status !== "active")
    redirect("/login?callbackUrl=/admin");
  return (
    <>
      <WorkspaceNav kind="admin" />
      <div className="workspace-content">{children}</div>
    </>
  );
}
