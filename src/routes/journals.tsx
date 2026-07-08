import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dosen/AppShell";
import { HardHat, Compass, Home } from "lucide-react";

export const Route = createFileRoute("/journals")({
  component: JournalsPage,
});

function JournalsPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-20 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
          <HardHat className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Database Jurnal Akademik
        </h1>
        <p className="mt-2 text-sm text-amber-700/90 font-medium uppercase tracking-wider">
          🚧 Under Construction / Sedang Dikembangkan
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Kami sedang menyiapkan fitur integrasi langsung dengan pangkalan data jurnal bereputasi nasional dan internasional (seperti SINTA, Scopus, DOAJ, dan Google Scholar). Anda akan dapat melakukan pencarian paper dan kutipan langsung dari dashboard DOSEN.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-neutral-900 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/panduan"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-zinc-50"
          >
            <Compass className="h-4 w-4" />
            Lihat Panduan
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
