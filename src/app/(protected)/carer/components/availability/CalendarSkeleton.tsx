"use client";

export default function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-44 bg-gold-muted/8 rounded-lg" />
        <div className="flex gap-1">
          <div className="h-9 w-9 bg-gold-muted/8 rounded-xl" />
          <div className="h-9 w-9 bg-gold-muted/8 rounded-xl" />
        </div>
      </div>

      {/* Weekday header skeleton */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-4 mx-auto w-8 bg-gold-muted/6 rounded" />
        ))}
      </div>

      {/* Date grid skeleton — 6 rows × 7 columns */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gold-muted/5 calendar-skeleton"
            style={{ animationDelay: `${(i % 7) * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
