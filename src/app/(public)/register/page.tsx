import AuthSplitLayout from "@/components/AuthSplitLayout";
import RegisterForm from "./components/RegisterForm";

interface PageProps {
  searchParams: Promise<{ option?: string }>;
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const option = resolvedParams.option;

  return (
    <AuthSplitLayout
      title="Create Account"
      subtitle="Register to access the carer matching platform."
      option={option}
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
