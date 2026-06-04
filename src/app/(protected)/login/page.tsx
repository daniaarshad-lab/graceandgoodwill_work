import AuthSplitLayout from "@/components/AuthSplitLayout";
import LoginForm from "./components/LoginForm";

interface PageProps {
  searchParams: Promise<{ option?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const option = resolvedParams.option;

  return (
    <AuthSplitLayout
      title="Welcome Back"
      subtitle="Login to continue managing care services."
      option={option}
    >
      <LoginForm />

      {/* ── Branded Placeholder ── */}
      <div className="mt-12 flex flex-col items-center justify-center text-center select-none">
        <h2
          className="text-2xl sm:text-3xl font-serif text-[#e8ba7a] tracking-widest mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          GRACE &amp; GOODWILL
        </h2>

        <div className="flex items-center gap-4 mb-2">
          <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#b8915e]/70" />
          <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#b8915e]/70" />
        </div>
      </div>
    </AuthSplitLayout>
  );
}
