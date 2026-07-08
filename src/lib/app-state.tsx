import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ChatMode = "cari";
export type ModelId =
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
  { id: "gpt-5-5", label: "GPT-5.5", desc: "Model canggih untuk penalaran kompleks" },
  { id: "gemini-3-5-flash", label: "Gemini 3.5 Flash", desc: "Model cepat dan efisien untuk tugas umum" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", desc: "Model seimbang untuk penulisan dan analisis" },
  { id: "claude-opus-4-8", label: "Claude Opus 4.8", desc: "Model premium untuk tugas berat" },
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", desc: "Model reasoning untuk kode dan matematika" },
  { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash", desc: "Model ringan dengan latensi rendah" },
  { id: "gpt-4o", label: "GPT-4o", desc: "Model serbaguna untuk multimodal" },
  { id: "qwen-3-6-plus", label: "Qwen3.6 Plus", desc: "Model kuat untuk berbagai bahasa" },
  { id: "qwen-3-7-max", label: "Qwen3.7 Max", desc: "Model unggulan untuk performa tinggi" },
];

export type FeatureId =
  | "auto"
  | "proposal-penelitian"
  | "metodologi-penelitian"
  | "riset-akademik"
  | "hasil-penelitian"
  | "pembahasan-penelitian"
  | "kesimpulan-penelitian";

export const FEATURES: { id: FeatureId; label: string; desc: string }[] = [
  { id: "auto", label: "AUTO", desc: "Pilih respons terbaik secara otomatis" },
  { id: "proposal-penelitian", label: "Proposal Penelitian", desc: "Susun ide, latar belakang, dan rumusan masalah" },
  { id: "metodologi-penelitian", label: "Metodologi Penelitian", desc: "Tentukan desain, teknik pengumpulan, dan analisis data" },
  { id: "riset-akademik", label: "Riset Akademik", desc: "Cari dan rangkum referensi ilmiah" },
  { id: "hasil-penelitian", label: "Hasil Penelitian", desc: "Susun temuan utama dan interpretasi data" },
  { id: "pembahasan-penelitian", label: "Pembahasan Penelitian", desc: "Hubungkan hasil dengan teori dan penelitian sebelumnya" },
  { id: "kesimpulan-penelitian", label: "Kesimpulan Penelitian", desc: "Ringkas jawaban, implikasi, dan rekomendasi" },
];

export const CATEGORIES = ["About", "Panduan", "Journals", "Event"] as const;
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

  feature: FeatureId;
  setFeature: (f: FeatureId) => void;

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
  const [model, setModel] = useState<ModelId>("gpt-5-5");
  const [feature, setFeature] = useState<FeatureId>("auto");
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
      feature,
      setFeature,
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
    [sidebarCollapsed, mobileOpen, loginOpen, mode, model, feature, category, messages, docs],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
