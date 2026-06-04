import AuthSplitLayout from "@/components/AuthSplitLayout";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

interface PageProps {
  searchParams: Promise<{ option?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const option = resolvedParams.option;

  return (
    <AuthSplitLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link."
      option={option}
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
