import AuthSplitLayout from "@/components/AuthSplitLayout";
import RegisterForm from "./components/RegisterForm";
import { parseRole } from "@/lib/auth-routes";

interface PageProps {
  searchParams: Promise<{ option?: string; role?: string }>;
}

/**
 * `role` decides which account type the form starts on, so a carer arriving
 * from "Register as a Carer" can never silently create a client account.
 * `option` is unrelated — it only picks the hero image variant.
 */

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const role = parseRole(resolvedParams.role);
  if (role === "carer") {
    return {
      title: "Register as a Live-in Carer | Grace & Goodwill",
      description: "Register with Grace & Goodwill as a self-employed live-in carer. Join our UK-wide network, choose suitable placements, and support people in their own homes."
    };
  }
  return {
    title: "Client Registration | Grace & Goodwill",
    description: "Create your Grace & Goodwill client account to explore live-in care options, share your care needs, and take the first step towards finding the right support."
  };
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const option = resolvedParams.option;
  const role = parseRole(resolvedParams.role);

  const isCarer = role === "carer";

  return (
    <AuthSplitLayout
      title={isCarer ? "Create Account as a Carer" : "Create Account as a Client"}
      subtitle={
        isCarer
          ? "Register as an independent live-in carer to begin your onboarding."
          : "Register to find and compare independent live-in carers."
      }
      option={option}
    >
      <RegisterForm initialRole={isCarer ? "CARER" : "CLIENT"} />
    </AuthSplitLayout>
  );
}
