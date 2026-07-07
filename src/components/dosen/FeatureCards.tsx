import { Search, GraduationCap, FileSearch, Terminal, type LucideIcon } from "lucide-react";

type Feature = { icon: LucideIcon; title: string; desc: string };

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Cari apa saja",
    desc: "Dapatkan jawaban cepat dan akurat dari sumber terpercaya.",
  },
  {
    icon: GraduationCap,
    title: "Selesaikan pekerjaan akademik",
    desc: "Bantu ringkas materi, buat outline, jelaskan konsep, dan susun ide penelitian.",
  },
  {
    icon: FileSearch,
    title: "Analisis dokumen",
    desc: "Upload PDF atau dokumen, lalu tanyakan isi dokumen tersebut.",
  },
  {
    icon: Terminal,
    title: "Mode Computer",
    desc: "Bantu coding, debugging, query database, dan masalah teknis.",
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_8px_30px_-12px_rgba(36,33,30,0.15)]"
          >
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-accent text-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
