import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";
import { useAppState } from "@/lib/app-state";

export function LoginModal() {
  const { loginOpen, setLoginOpen } = useAppState();
  const [email, setEmail] = useState("");
  const valid = /.+@.+\..+/.test(email);

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="max-w-md rounded-3xl border-border p-0 sm:max-w-md">
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

          <div className="flex flex-col gap-2">
            <Button className="h-11 w-full rounded-full">
              <GoogleIcon />
              Lanjutkan dengan Google
            </Button>
            <Button
              variant="secondary"
              className="h-11 w-full rounded-full border border-border"
            >
              <AppleIcon />
              Lanjutkan dengan Apple
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">atau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-full border-border px-4"
            />
            <Button disabled={!valid} className="h-11 w-full rounded-full">
              Lanjutkan dengan email
            </Button>
          </div>

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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.23-1.11 3.03-.74.87-1.94 1.55-3.11 1.46-.13-1.12.41-2.29 1.09-3.03.74-.83 2.04-1.44 3.13-1.46zM20.5 17.29c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.53-4.13 3.54-1.55.02-1.95-1.01-4.06-1-2.11.01-2.55 1.02-4.1 1-1.74-.02-3.06-1.79-4.05-3.36C.03 16.7-.28 11.6 2.19 8.91c1.22-1.34 3.14-2.19 4.85-2.19 1.75 0 2.85.99 4.29.99 1.4 0 2.25-.99 4.27-.99 1.53 0 3.15.83 4.31 2.28-3.79 2.08-3.17 7.5.59 8.29z" />
    </svg>
  );
}
