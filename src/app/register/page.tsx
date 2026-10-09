import AuthForm from "@/components/auth/AuthForm";
export default function Register() {
  return <AuthForm mode="register" />;
}

export const metadata = { robots: { index: false, follow: false } };
