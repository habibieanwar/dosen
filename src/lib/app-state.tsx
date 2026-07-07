import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ChatMode = "cari" | "computer";
export type ModelId = "basic" | "academic" | "research";

export const MODELS: { id: ModelId; label: string; desc: string }[] = [
  { id: "basic", label: "DOSEN Basic", desc: "Cepat untuk pertanyaan umum" },
  { id: "academic", label: "DOSEN Academic", desc: "Optimal untuk tugas akademik" },
  { id: "research", label: "DOSEN Research", desc: "Analisis mendalam & referensi" },
];

export const CATEGORIES = ["Temukan", "Keuangan", "Kesehatan", "Akademik", "Paten"] as const;
export type Category = (typeof CATEGORIES)[number];

export type DocKind = "PDF" | "DOCX" | "TXT";
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
  const [model, setModel] = useState<ModelId>("academic");
  const [category, setCategory] = useState<Category>("Akademik");
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
