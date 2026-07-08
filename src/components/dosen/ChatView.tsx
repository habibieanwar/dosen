import { Copy, BookOpen, ThumbsUp, ThumbsDown, Share2, RefreshCw, FileText, FileDown } from "lucide-react";
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
          <Logo size={22} showText={false} />
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
