import AuthForm from "@/components/auth/AuthForm";
export default function Login() {
  return <AuthForm mode="login" />;
}

export const metadata = { robots: { index: false, follow: false } };
