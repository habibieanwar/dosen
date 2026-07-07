import { FileText, X } from "lucide-react";
import { useAppState } from "@/lib/app-state";

export function DocumentAttachedList() {
  const { docs } = useAppState();
  if (docs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {docs.map((d) => (
        <div
          key={d.id}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent">
            <FileText className="h-4 w-4 text-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              Dokumen berhasil ditambahkan
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {d.name} · Anda dapat bertanya berdasarkan isi dokumen.
            </p>
          </div>
          <button
            aria-label="Hapus"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
