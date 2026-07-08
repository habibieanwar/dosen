import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "./supabase";
import { toast } from "sonner";

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

export type User = {
  id?: string;
  name: string;
  email: string;
  isProfileCompleted: boolean;
  university?: string;
  nimOrNip?: string;
  role?: string;
  phoneNumber?: string;
};

type State = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;

  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;

  user: User | null;
  loginWithGoogle: () => void;
  completeProfile: (data: { university: string; fullName?: string; nimOrNip?: string; role: string; phoneNumber?: string }) => void;
  logout: () => void;

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

  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Load profile from Supabase Database
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.fullname || "User Akademisi",
          isProfileCompleted: data.is_profile_completed,
          university: data.university,
          role: data.role,
          phoneNumber: data.phone_number,
        });
      } else {
        // Fallback jika profile belum terbuat di DB (karena lag sinkronisasi trigger)
        setUser({
          id: userId,
          email: email,
          name: "User Akademisi",
          isProfileCompleted: false,
        });
      }
    } catch (err) {
      console.error("Gagal memuat profil database:", err);
    }
  };

  // Listen to Auth changes via Supabase
  useEffect(() => {
    // Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || "");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || "");
          if (event === "SIGNED_IN") {
            toast.success("Berhasil masuk dengan Google!");
          }
        } else {
          if (user) {
            toast.info("Anda telah keluar dari sesi.");
          }
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<State>(
    () => ({
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      mobileOpen,
      setMobileOpen,
      loginOpen,
      setLoginOpen,
      user,
      loginWithGoogle: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/`,
            },
          });
          if (error) throw error;
        } catch (err: any) {
          console.error("OAuth gagal:", err.message);
        }
      },
      completeProfile: async (profileData) => {
        if (!user || !user.id) return;
        try {
          const { error } = await supabase
            .from("profiles")
            .update({
              fullname: profileData.fullName,
              university: profileData.university,
              role: profileData.role,
              phone_number: profileData.phoneNumber,
              is_profile_completed: true,
            })
            .eq("id", user.id);

          if (error) throw error;

          // Update local state setelah sukses update di Supabase
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  name: profileData.fullName || prev.name,
                  university: profileData.university,
                  role: profileData.role,
                  phoneNumber: profileData.phoneNumber,
                  isProfileCompleted: true,
                }
              : null
          );
        } catch (err: any) {
          console.error("Gagal melengkapi profil:", err.message);
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
        setUser(null);
      },
      mode,
      setMode,
      model,
      setModel,
      feature,
      setFeature,
      category,
      setCategory,
      messages,
      submit: async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMsgId = crypto.randomUUID();
        const assistantMsgId = crypto.randomUUID();

        // 1. Tambahkan pesan user & placeholder loading assistant
        setMessages((prev) => [
          ...prev,
          { id: userMsgId, role: "user", content: trimmed },
          { id: assistantMsgId, role: "assistant", content: "Sedang merumuskan jawaban..." },
        ]);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

        if (!apiKey) {
          // Jika API Key kosong, tampilkan panduan pengaturan API Key Gemini
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content:
                        "API Key Gemini belum terpasang di berkas `.env` Anda.\n\n" +
                        "Silakan ikuti 3 langkah mudah ini untuk mengaktifkannya:\n" +
                        "1. Dapatkan API Key gratis di Google AI Studio (https://aistudio.google.com)\n" +
                        "2. Tambahkan baris baru berikut di akhir berkas `.env` Anda:\n" +
                        "   `VITE_GEMINI_API_KEY=KUNCI_API_GEMINI_ANDA`\n" +
                        "3. Simpan dan restart dev server Anda.\n\n" +
                        "Setelah terpasang, Gemini akan langsung menjawab pertanyaan Anda secara interaktif di sini!",
                    }
                  : m
              )
            );
          }, 800);
          return;
        }

        try {
          // 2. Lakukan POST request ke Google Gemini API (model gemini-1.5-flash yang stabil)
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `Anda adalah DOSEN, asisten AI akademik pintar untuk mahasiswa, dosen, dan peneliti. Jawab pertanyaan berikut dengan bahasa Indonesia yang formal, terstruktur, ramah akademis, dan edukatif:\n\n${trimmed}`
                      }
                    ]
                  }
                ]
              }),
            }
          );

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Gagal memanggil API Gemini");
          }

          const resData = await response.json();
          const geminiText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada jawaban dari Gemini.";

          // 3. Masukkan jawaban riil dari Gemini ke state
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: geminiText }
                : m
            )
          );

          // 4. Update pemakaian chat (chat_usage) di Supabase dan Admin Local Storage
          if (user && user.id) {
            // Kita asumsikan user memiliki database profiles
            // Di profiles, simpan chat_usage ke Supabase
            const nextUsage = ((user as any).chat_usage || 0) + 1;
            
            setUser((prev) => prev ? { ...prev, chat_usage: nextUsage } as any : null);
            
            const { error: dbErr } = await supabase
              .from("profiles")
              .update({ chat_usage: nextUsage })
              .eq("id", user.id);

            if (dbErr) {
              console.warn("Gagal update chat_usage di Supabase:", dbErr.message);
            }

            // Sync ke admin local storage
            const saved = localStorage.getItem("admin_users");
            if (saved) {
              const currentList = JSON.parse(saved);
              const idx = currentList.findIndex((u: any) => u.id === user.id);
              if (idx > -1) {
                currentList[idx].usage = nextUsage;
                localStorage.setItem("admin_users", JSON.stringify(currentList));
              }
            }
          }
        } catch (err: any) {
          console.error("Gagal memproses AI response:", err);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: `Terjadi kesalahan saat menghubungi Gemini API: ${err.message || err}` }
                : m
            )
          );
        }
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
    [sidebarCollapsed, mobileOpen, loginOpen, user, mode, model, feature, category, messages, docs],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
