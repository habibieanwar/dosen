import { Menu } from "lucide-react";
import { CATEGORIES, useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { category, setCategory, setMobileOpen, setLoginOpen } = useAppState();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav
        className="mx-auto flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:justify-center"
        aria-label="Kategori"
      >
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          );
        })}
      </nav>

      <Button
        size="sm"
        className="shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
        onClick={() => setLoginOpen(true)}
      >
        Masuk
      </Button>
    </header>
  );
}
