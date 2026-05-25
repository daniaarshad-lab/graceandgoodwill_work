import Card from "./Card";
import Button from "./Button";
import { ReactNode } from "react";

interface TrainingCardProps {
  title: string;
  description: string;
  bullets?: string[];
  cta?: string;
  icon?: ReactNode;
}

export default function TrainingCard({
  title,
  description,
  bullets = [],
  cta = "Learn more",
  icon,
}: TrainingCardProps) {
  return (
    <Card className="hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon ?? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 14l9-5-9-5-9 5 9 5z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="grow">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>

          {bullets.length > 0 && (
            <ul className="mb-4 ml-4 list-disc text-sm text-muted-foreground">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          <div className="mt-2">
            <Button text={cta} variant="outline" />
          </div>
        </div>
      </div>
    </Card>
  );
}
