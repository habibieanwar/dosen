import { Menu, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAppState } from "@/lib/app-state";

export function TopBar() {
  const { setMobileOpen, user, setLoginOpen } = useAppState();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border/60 bg-[#FFFFFF] px-4 py-3 md:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer to push user button to the right on desktop when menu button is hidden */}
      <div className="hidden md:block" />

      {/* Indikator Login User di TopBar */}
      <div className="flex items-center gap-2">
        {user ? (
          <div 
            title={`Masuk sebagai: ${user.name} (${user.email})`}
            className="flex items-center gap-2.5 rounded-full border border-green-200 bg-green-50/50 py-1 pl-2 pr-3 text-xs text-green-800 transition-all hover:bg-green-50"
          >
            {/* Indikator aktif hijau */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <div className="flex items-center gap-1.5 font-medium max-w-[100px] sm:max-w-[150px]">
              <span className="truncate">{user.name.split(" ")[0]}</span>
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-600" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-zinc-50 hover:text-foreground cursor-pointer"
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Masuk</span>
          </button>
        )}
      </div>
    </header>
  );
}
