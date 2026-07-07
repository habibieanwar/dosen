import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ChatMode = "cari";
export type ModelId =
  | "free"
  | "gpt-5-5"
  | "gemini-3-5-flash"
  | "claude-sonnet-4-6"
  | "claude-opus-4-8"
  | "deepseek-v4-pro"
  | "deepseek-v4-flash"
  | "gpt-4o"
  | "qwen-3-6-plus"
  | "qwen-3-7-max";

export const MODELS: { id: ModelId; label: string; desc: string }[] = [
  { id: "free", label: "free", desc: "Model default gratis" },
  { id: "gpt-5-5", label: "GPT-5.5", desc: "OpenAI GPT-5.5" },
  { id: "gemini-3-5-flash", label: "Gemini 3.5 Flash", desc: "Google Gemini 3.5 Flash" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", desc: "Anthropic Claude Sonnet 4.6" },
  { id: "claude-opus-4-8", label: "Claude Opus 4.8", desc: "Anthropic Claude Opus 4.8" },
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", desc: "DeepSeek V4 Pro" },
  { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash", desc: "DeepSeek V4 Flash" },
  { id: "gpt-4o", label: "GPT-4o", desc: "OpenAI GPT-4o" },
  { id: "qwen-3-6-plus", label: "Qwen3.6 Plus", desc: "Qwen 3.6 Plus" },
  { id: "qwen-3-7-max", label: "Qwen3.7 Max", desc: "Qwen 3.7 Max" },
];

export const CATEGORIES = ["About", "Keuangan", "Tutorial", "Event", "Jurnal"] as const;
export type Category = (typeof CATEGORIES)[number];

export type DocKind = "PDF" | "DOCX" | "TXT" | "IMAGE";
export type AttachedDoc = { id: string; name: string; kind: DocKind };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type State = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;

  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;

  mode: ChatMode;
  setMode: (m: ChatMode) => void;

  model: ModelId;
  setModel: (m: ModelId) => void;

  category: Category;
  setCategory: (c: Category) => void;

  messages: ChatMessage[];
  submit: (text: string) => void;
  resetChat: () => void;

  docs: AttachedDoc[];
  addDoc: (kind: DocKind) => void;
};

const AppStateCtx = createContext<State | null>(null);

const SAMPLE_ANSWER =
  "DOSEN dapat membantu menjelaskan materi, merangkum dokumen, membuat outline tugas, dan mencari referensi akademik.";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("cari");
  const [model, setModel] = useState<ModelId>("free");
  const [category, setCategory] = useState<Category>("About");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [docs, setDocs] = useState<AttachedDoc[]>([]);

  const value = useMemo<State>(
    () => ({
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      mobileOpen,
      setMobileOpen,
      loginOpen,
      setLoginOpen,
      mode,
      setMode,
      model,
      setModel,
      category,
      setCategory,
      messages,
      submit: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "user", content: trimmed },
          { id: crypto.randomUUID(), role: "assistant", content: SAMPLE_ANSWER },
        ]);
      },
      resetChat: () => setMessages([]),
      docs,
      addDoc: (kind) =>
        setDocs((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            kind,
            name: `Dokumen-${prev.length + 1}.${kind.toLowerCase()}`,
          },
        ]),
    }),
    [sidebarCollapsed, mobileOpen, loginOpen, mode, model, category, messages, docs],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
