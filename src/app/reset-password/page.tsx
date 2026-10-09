import AuthForm from "@/components/auth/AuthForm";
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return <AuthForm mode="reset" token={(await searchParams).token || ""} />;
}

export const metadata = { robots: { index: false, follow: false } };
