import { type ReactNode } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import { TopBar } from "./TopBar";
import { LoginModal } from "./LoginModal";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { sidebarCollapsed, mobileOpen, setMobileOpen } = useAppState();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border transition-[width] duration-200 md:block",
          sidebarCollapsed ? "w-16" : "w-[280px]",
        )}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] border-r border-border p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 bg-[#FFFFFF]">{children}</main>
      </div>

      <LoginModal />
    </div>
  );
}
