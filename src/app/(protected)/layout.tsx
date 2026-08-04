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
      <div className="flex-grow pt-[72px]">{children}</div>
    </AgreementsGuard>
  );
}
