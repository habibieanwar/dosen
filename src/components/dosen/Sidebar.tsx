import {
  Plus,
  History,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Calendar,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type Item = { key: string; label: string; icon: LucideIcon; primary?: boolean };

const ITEMS: Item[] = [
  { key: "baru", label: "Chat Baru", icon: Plus, primary: true },
  { key: "dibimbing", label: "Dibimbing Dosen", icon: GraduationCap },
  { key: "journals", label: "Journals", icon: BookOpen },
  { key: "event", label: "Event", icon: Calendar },
  { key: "riwayat", label: "Riwayat", icon: History },
];

export function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const { toggleSidebar, resetChat, user, logout } = useAppState();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex items-center gap-2 px-4 pt-5 pb-3",
          collapsed && "justify-center px-2",
        )}
      >
        <Link to="/" className="flex items-center gap-2 hover:opacity-90">
          <Logo size={32} showText={!collapsed} />
        </Link>
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
          const path = item.key === "journals" ? "/journals" : item.key === "event" ? "/event" : null;

          if (path) {
            return (
              <Link
                key={item.key}
                to={path}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors cursor-pointer",
                  "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed && "justify-center px-2",
                )}
                activeProps={{
                  className: "bg-sidebar-accent text-sidebar-foreground font-semibold",
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => item.key === "baru" && resetChat()}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors cursor-pointer",
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

      <div className="mt-auto p-4 flex flex-col gap-2">
        <button
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors cursor-pointer w-full hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Pengaturan" : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">Pengaturan</span>}
        </button>

        {user && (
          <>
            {!collapsed && (
              <div className="flex flex-col gap-1 rounded-xl bg-sidebar-accent p-3 border border-border/40">
                <p className="truncate text-xs font-bold text-foreground">{user.name}</p>
                <p className="truncate text-[10px] font-semibold text-zinc-900 capitalize">
                  {user.role || "Akademisi"}
                  {user.university && ` • ${user.university}`}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            )}
            <button
              onClick={logout}
              className={cn(
                "w-full rounded-xl bg-red-600 p-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 cursor-pointer",
                collapsed && "px-1 text-[10px]"
              )}
            >
              {collapsed ? "Keluar" : "Keluar / Logout"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
