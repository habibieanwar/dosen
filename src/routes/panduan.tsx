import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dosen/AppShell";
import { HelpCircle, Sparkles, FileText, Settings } from "lucide-react";

export const Route = createFileRoute("/panduan")({
  component: PanduanPage,
});

function PanduanPage() {
  const steps = [
    {
      icon: Sparkles,
      title: "1. Mulai Ajukan Pertanyaan",
      desc: "Ketik pertanyaan akademik, rancangan judul, atau konsep metodologi penelitian Anda di kolom pencarian di halaman utama untuk memulai percakapan pintar dengan asisten AI.",
    },
    {
      icon: FileText,
      title: "2. Unggah Dokumen Referensi",
      desc: "Gunakan tombol unggah berkas (PDF, DOCX, TXT) untuk melampirkan berkas rujukan. AI akan menganalisis isi file tersebut dan menjawab berdasarkan referensi yang Anda berikan.",
    },
    {
      icon: Settings,
      title: "3. Sesuaikan Model AI",
      desc: "Pilih model penalaran AI terbaik (GPT-5, Gemini, Claude, DeepSeek) dari panel setelan di atas kotak pencarian untuk mendapatkan gaya jawaban, penalaran logika, atau analisis coding yang sesuai.",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-20 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-foreground">
            <HelpCircle className="h-3 w-3" />
            Pusat Bantuan
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Panduan Penggunaan
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pelajari langkah-langkah mudah di bawah ini untuk memaksimalkan penggunaan DOSen AI demi mempercepat riset dan penulisan ilmiah Anda.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:gap-6 md:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
