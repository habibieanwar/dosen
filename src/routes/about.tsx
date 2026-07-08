import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dosen/AppShell";
import { Landmark, ShieldAlert, Award, Star } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-20 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-foreground">
            <Star className="h-3 w-3 fill-foreground" />
            Tentang Platform Kami
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            DOSEN Akademik AI
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            DOSEN adalah platform asisten akademik pintar berbasis kecerdasan buatan (AI) yang dikembangkan khusus untuk mempermudah kegiatan riset, merangkum dokumen ilmiah, serta membantu penulisan jurnal akademik bagi mahasiswa, dosen, dan peneliti di Indonesia.
          </p>
        </div>

        {/* Founder Section */}
        <div className="mt-16 rounded-3xl border border-border bg-zinc-50/50 p-8 shadow-sm transition-all hover:shadow-md md:p-12">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-black text-2xl font-bold text-white shadow-lg">
              H
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Award className="h-3.5 w-3.5" /> Founder & Visionary
              </div>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">Habibie</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sebagai pendiri DOSEN, Habibie menginisiasi platform ini dengan visi untuk meruntuhkan hambatan dalam riset akademik dan penulisan karya tulis ilmiah di Indonesia. Melalui integrasi kecerdasan buatan, platform ini dirancang untuk mendampingi akademisi di seluruh nusantara guna menghasilkan publikasi ilmiah berkualitas internasional secara cepat dan kredibel.
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-foreground">
              <Landmark className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Inovasi Riset</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Mengoptimalkan pencarian data ilmiah dan analisis jurnal multi-dokumen secara cepat dan efisien.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-foreground">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Akurasi & Integritas</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Mengedepankan etika penulisan dan sitasi referensi yang benar untuk menjaga integritas akademik terhindar dari plagiarisme.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
