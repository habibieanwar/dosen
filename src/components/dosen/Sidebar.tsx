import {
  Plus,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type Item = { key: string; label: string; icon: LucideIcon; primary?: boolean };

const ITEMS: Item[] = [
  { key: "baru", label: "Baru", icon: Plus, primary: true },
  { key: "riwayat", label: "Riwayat", icon: History },
];

export function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const { toggleSidebar, resetChat } = useAppState();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex items-center gap-2 px-4 pt-5 pb-3",
          collapsed && "justify-center px-2",
        )}
      >
        <Logo size={32} showText={!collapsed} />
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            aria-label="Tutup sidebar"
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggleSidebar}
          aria-label="Buka sidebar"
          className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      <nav className={cn("flex flex-col gap-1 px-3 pt-2", collapsed && "px-2")}>
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => item.key === "baru" && resetChat()}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                item.primary && "bg-sidebar-accent text-sidebar-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-6 px-6">
          <p className="text-xs text-muted-foreground">Tidak ada sesi terbaru</p>
        </div>
      )}

      <div className="mt-auto p-4">
        {!collapsed && (
          <div className="rounded-xl border border-sidebar-border bg-background/50 p-3">
            <p className="text-xs font-medium text-foreground">Masuk</p>
          </div>
        )}
      </div>
    </div>
  );
}
