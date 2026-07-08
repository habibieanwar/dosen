import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAppState } from "@/lib/app-state";

export function LoginModal() {
  const { loginWithGoogle, user } = useAppState();

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  // Selama user belum login, paksa modal login selalu terbuka secara permanen
  const isForcedOpen = !user;

  return (
    <Dialog open={isForcedOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md rounded-3xl border-border p-0 sm:max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-5 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Logo size={44} />
            <div>
              <h2 className="font-display text-2xl text-foreground">Masuk atau daftar gratis</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Simpan dan sinkronkan pencarian Anda
              </p>
            </div>
          </div>

          <Button onClick={handleGoogleLogin} className="h-11 w-full rounded-full cursor-pointer">
            <GoogleIcon />
            Lanjutkan dengan Google
          </Button>

          <button className="text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Single sign-on (SSO)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#FFF"
        d="M21.35 11.1H12v2.9h5.35c-.23 1.5-1.72 4.4-5.35 4.4-3.22 0-5.85-2.66-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.98 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.65-3.66 8.65-8.8 0-.6-.06-1.05-.15-1.5z"
      />
    </svg>
  );
}

