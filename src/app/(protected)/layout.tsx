import AgreementsGuard from "@/guards/AgreementsGuard";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgreementsGuard>
      <AuthenticatedHeader />
      <div className="flex-grow w-full min-w-0 pt-[72px]">{children}</div>
    </AgreementsGuard>
  );
}
