import { Copy, ThumbsUp, ThumbsDown, Share2, RefreshCw, FileText, FileDown } from "lucide-react";
import { useAppState, type ChatMessage } from "@/lib/app-state";
import { Logo } from "./Logo";
import { toast } from "sonner";


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
    <div className="flex justify-end">
      <h2 className="max-w-[80%] rounded-2xl border border-border bg-card px-4 py-3 text-right font-display text-2xl leading-tight text-foreground sm:text-3xl">
        {message.content}
      </h2>
    </div>
  );
}

function AssistantAnswer() {
  return (
    <div className="flex flex-col gap-5">

      <div className="rounded-2xl bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Logo size={22} showText={false} />
          <span className="text-sm font-medium text-foreground">DOSEN</span>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground">
          DOSEN dapat membantu menjelaskan materi, merangkum dokumen, membuat outline tugas, dan
          mencari referensi akademik.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3">
          <ActionBtn
            icon={<Copy className="h-3.5 w-3.5" />}
            label="Salin"
            onClick={() => toast.success("Disalin ke clipboard")}
          />
          <ActionBtn
            icon={<ThumbsUp className="h-3.5 w-3.5" />}
            label="Suka"
            onClick={() => toast.success("Terima kasih atas umpan balik Anda")}
          />
          <ActionBtn
            icon={<ThumbsDown className="h-3.5 w-3.5" />}
            label="Tidak suka"
            onClick={() => toast.success("Terima kasih atas umpan balik Anda")}
          />
          <ActionBtn
            icon={<Share2 className="h-3.5 w-3.5" />}
            label="Bagikan"
            onClick={() => toast.success("Tautan disalin")}
          />
          <ActionBtn
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            label="Coba lagi"
            onClick={() => toast.info("Membuat ulang jawaban…")}
          />
          <ActionBtn
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Word"
            onClick={() => toast.info("Mengekspor ke Word…")}
          />
          <ActionBtn
            icon={<FileDown className="h-3.5 w-3.5" />}
            label="PDF"
            onClick={() => toast.info("Mengekspor ke PDF…")}
          />
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
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {icon}
    </button>
  );
}
