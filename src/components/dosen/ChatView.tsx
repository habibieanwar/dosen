import { Copy, ThumbsUp, ThumbsDown, ExternalLink, BookOpen } from "lucide-react";
import { useAppState, type ChatMessage } from "@/lib/app-state";
import { Logo } from "./Logo";
import { toast } from "sonner";

const SOURCES = [
  {
    title: "Panduan Metode Penelitian Kualitatif",
    domain: "jurnal.ac.id",
    snippet: "Kerangka dasar untuk merancang studi kualitatif di bidang sosial dan humaniora.",
  },
  {
    title: "Teknik Menyusun Outline Karya Ilmiah",
    domain: "repositori.kampus.id",
    snippet: "Struktur outline yang efektif untuk skripsi, tesis, dan artikel jurnal.",
  },
  {
    title: "Referensi Sitasi Akademik Modern",
    domain: "scholar.example.org",
    snippet: "Standar sitasi APA, MLA, dan IEEE untuk kebutuhan publikasi ilmiah.",
  },
];

export function ChatView() {
  const { messages } = useAppState();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-40">
      {messages.map((m) =>
        m.role === "user" ? <UserBubble key={m.id} message={m} /> : <AssistantAnswer key={m.id} />,
      )}
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div>
      <h2 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
        {message.content}
      </h2>
    </div>
  );
}

function AssistantAnswer() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" />
        <span>Jawaban</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Logo size={22} />
          <span className="text-sm font-medium text-foreground">DOSEN</span>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground">
          DOSEN dapat membantu menjelaskan materi, merangkum dokumen, membuat outline tugas, dan
          mencari referensi akademik.
        </p>

        <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
          <ActionBtn
            icon={<Copy className="h-3.5 w-3.5" />}
            label="Salin"
            onClick={() => toast.success("Disalin ke clipboard")}
          />
          <ActionBtn icon={<ThumbsUp className="h-3.5 w-3.5" />} label="Suka" />
          <ActionBtn icon={<ThumbsDown className="h-3.5 w-3.5" />} label="Tidak suka" />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Sumber</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SOURCES.map((s, i) => (
            <a
              key={s.title}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {i + 1}. {s.domain}
                </span>
                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="line-clamp-2 text-sm font-medium text-foreground">{s.title}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{s.snippet}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
