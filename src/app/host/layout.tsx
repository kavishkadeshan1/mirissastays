import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkspaceNav from "@/components/layout/WorkspaceNav";
export const dynamic = "force-dynamic";
export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const u = await getCurrentUser();
  if (!u || !["host", "admin"].includes(u.role) || u.status === "suspended")
    redirect("/login?callbackUrl=/host");
  if (u.status === "pending")
    return (
      <>
        <WorkspaceNav kind="host" />
        <div className="container-wide section-space">
          <p className="eyebrow">One more step</p>
          <h1 className="text-4xl my-6">
            Your host account is being reviewed.
          </h1>
          <p>
            We’ll make your listing tools available when your account is
            approved.
          </p>
          <a className="btn btn-primary mt-6" href="/contact">
            Contact our team
          </a>
        </div>
      </>
    );
  return (
    <>
      <WorkspaceNav kind="host" />
      <div className="workspace-content">{children}</div>
    </>
  );
}
