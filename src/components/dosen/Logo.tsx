import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 32,
  showText = true,
}: {
  className?: string;
  size?: number;
  showText?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="grid shrink-0 place-items-center rounded-xl bg-foreground text-background"
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
      {showText && (
        <span className="font-display text-lg tracking-tight">Dosen</span>
      )}
    </div>
  );
}
