import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-foreground text-background",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="DOSEN"
    >
      <span
        className="font-display leading-none"
        style={{ fontSize: size * 0.62 }}
      >
        D
      </span>
    </div>
  );
}
