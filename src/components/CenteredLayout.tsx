import { ReactNode } from "react";

interface CenteredLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function CenteredLayout({
  title,
  subtitle,
  children,
}: CenteredLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1>{title}</h1>
          {subtitle && (
            <p className="body-small text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
