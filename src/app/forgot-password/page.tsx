import AuthForm from "@/components/auth/AuthForm";
export default function Forgot() {
  return <AuthForm mode="forgot" />;
}

export const metadata = { robots: { index: false, follow: false } };
