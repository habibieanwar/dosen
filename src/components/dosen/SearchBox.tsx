import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import {
  Plus,
  ChevronDown,
  ArrowUp,
  ImagePlus,
  Wand2,
  Globe,
  BookOpen,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MODELS, useAppState, type DocKind } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const { model, setModel, submit, addDoc } = useAppState();
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [text]);

  const send = () => {
    if (!text.trim()) return;
    submit(text);
    setText("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleUpload = (kind: DocKind) => {
    addDoc(kind);
    toast.success("Dokumen berhasil ditambahkan", {
      description: "Anda dapat bertanya berdasarkan isi dokumen.",
    });
  };

  const handleAction = (label: string) => {
    toast.info(`${label} dipilih`, {
      description: "Fitur ini akan segera tersedia.",
    });
  };

  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? "DOSEN";

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-border bg-card shadow-[0_2px_20px_-8px_rgba(36,33,30,0.08)] transition-shadow focus-within:shadow-[0_8px_40px_-12px_rgba(36,33,30,0.15)]",
        compact ? "p-3" : "p-4",
      )}
    >
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        rows={compact ? 1 : 2}
        placeholder="Tanya apa saja…"
        className="w-full resize-none border-0 bg-transparent px-2 py-1.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Tambah lampiran"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 rounded-xl">
            <DropdownMenuItem onSelect={() => handleUpload("IMAGE")}>
              <ImagePlus className="h-4 w-4" />
              <span>Upload dokumen atau gambar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAction("Buat gambar")}>
              <Wand2 className="h-4 w-4" />
              <span>Buat gambar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAction("Pencarian di website")}>
              <Globe className="h-4 w-4" />
              <span>Pencarian di website</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleAction("Riset lebih dalam")}>
              <BookOpen className="h-4 w-4" />
              <span>Riset lebih dalam</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <span className="hidden sm:inline">Model:</span>
                <span className="font-medium text-foreground">{modelLabel}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl">
              {MODELS.map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  onSelect={() => setModel(m.id)}
                  className="flex-col items-start gap-0.5 py-2"
                >
                  <div className="flex w-full items-center">
                    <span className="font-medium">{m.label}</span>
                    {model === m.id && <Check className="ml-auto h-4 w-4" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{m.desc}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="icon"
            onClick={send}
            disabled={!text.trim()}
            className="h-9 w-9 shrink-0 rounded-full"
            aria-label="Kirim"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

