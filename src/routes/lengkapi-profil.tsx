import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppState } from "@/lib/app-state";
import { useEffect, useState } from "react";
import { Logo } from "@/components/dosen/Logo";
import { GraduationCap, Landmark, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lengkapi-profil")({
  component: LengkapiProfilPage,
});

function LengkapiProfilPage() {
  const { user, completeProfile } = useAppState();
  const navigate = useNavigate();

  // Form State
  const [university, setUniversity] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security & UX Route Guard:
  // 1. Jika belum login, redirect ke beranda (karena tidak boleh akses halaman ini)
  // 2. Jika sudah login dan profil sudah lengkap, redirect ke beranda (mencegah kembali ke form ini)
  useEffect(() => {
    if (!user) {
      navigate({ to: "/", replace: true });
      return;
    }
    if (user.isProfileCompleted) {
      navigate({ to: "/", replace: true });
      return;
    }
  }, [user, navigate]);

  if (!user || user.isProfileCompleted) {
    return null; // Don't render anything while redirecting
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Input Sisi Klien (Cybersecurity Best Practice: Strict Validation)
    if (!university.trim()) {
      toast.error("Universitas / Institusi tidak boleh kosong");
      return;
    }
    if (phoneNumber && !/^[0-9+ -]{10,15}$/.test(phoneNumber)) {
      toast.error("Nomor telepon tidak valid (10-15 digit angka)");
      return;
    }

    setIsSubmitting(true);

    // Simulasi penyimpanan ke database
    setTimeout(() => {
      completeProfile({
        university: university.trim(),
        role,
        phoneNumber: phoneNumber.trim(),
      });

      toast.success("Profil Anda berhasil dilengkapi!");
      setIsSubmitting(false);

      // Cybersecurity & UX: Menggunakan replace: true agar halaman ini dihapus dari browser history
      // Pengguna tidak bisa memencet tombol 'Back' untuk kembali ke halaman formulir ini.
      navigate({ to: "/", replace: true });
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50/50 px-4 py-12 md:bg-zinc-100/40">
      <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-white p-8 shadow-xl shadow-zinc-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-300/40 md:p-10">
        <div className="flex flex-col items-center text-center">
          <Logo size={48} />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Satu langkah lagi!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lengkapi data profil Anda untuk mengaktifkan akun akademik DOSEN.
          </p>
        </div>

        {/* Info Box Security Warning */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50/60 p-4 text-xs text-amber-800 border border-amber-200/40">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-semibold">Info Keamanan:</span> Sesi akun Google Anda ({user.email}) telah terverifikasi. Untuk mencegah kebocoran sesi, selesaikan profil Anda sekarang. Anda tidak dapat kembali ke halaman login atau beranda sebelum melengkapi form ini.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Peran / Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Peran Anda
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "mahasiswa", label: "Mahasiswa" },
                { id: "dosen", label: "Dosen" },
                { id: "peneliti", label: "Peneliti" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl border py-3 px-2 text-center transition-all cursor-pointer ${
                    role === item.id
                      ? "border-primary bg-primary/5 text-primary shadow-sm font-medium"
                      : "border-border bg-white text-muted-foreground hover:border-zinc-300 hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mb-1.5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Universitas / Institusi */}
          <div className="space-y-2">
            <label htmlFor="university" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Universitas / Institusi
            </label>
            <div className="relative">
              <Landmark className="absolute top-3 left-3 h-5 w-5 text-muted-foreground/75" />
              <input
                id="university"
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Contoh: Universitas Indonesia"
                className="h-11 w-full rounded-2xl border border-border bg-white pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>



          {/* Nomor Telepon */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nomor Telepon <span className="text-muted-foreground/60">(Opsional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-black font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-neutral-900 active:scale-[0.98] disabled:bg-neutral-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan & Lanjutkan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
