import ClientPage from "./client-page";
import { parseRole } from "@/lib/auth-routes";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const resolvedParams = await searchParams;
  const role = parseRole(resolvedParams.role);

  if (role === "carer") {
    return {
      title: "Carer Login | Grace & Goodwill",
      description: "Log in to your Grace & Goodwill carer account to manage your profile, access placements and stay connected with your care opportunities across the UK.",
      alternates: {
        canonical: "/login",
      },
    };
  }

  return {
    title: "Client Login | Grace & Goodwill",
    description: "Log in to your Grace & Goodwill client account to manage your care arrangements, access your account, and stay connected with your care team.",
    alternates: {
      canonical: "/login",
    },
  };
}

export default function LoginPage() {
  return <ClientPage />;
}
