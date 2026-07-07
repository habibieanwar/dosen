import { createFileRoute } from "@tanstack/react-router";
import { AppStateProvider, useAppState } from "@/lib/app-state";
import { AppShell } from "@/components/dosen/AppShell";
import { SearchBox } from "@/components/dosen/SearchBox";
import { FeatureCards } from "@/components/dosen/FeatureCards";
import { ChatView } from "@/components/dosen/ChatView";
import { DocumentAttachedList } from "@/components/dosen/DocumentAttachedCard";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppStateProvider>
      <AppShell>
        <Home />
      </AppShell>
    </AppStateProvider>
  );
}

function Home() {
  const { messages } = useAppState();
  const hasChat = messages.length > 0;

  if (hasChat) {
    return (
      <div className="relative flex min-h-[calc(100vh-57px)] flex-col">
        <div className="flex-1 px-4 pt-8 md:px-8">
          <ChatView />
        </div>
        <div className="sticky bottom-0 border-t border-border/60 bg-background/85 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto max-w-3xl">
            <DocumentAttachedList />
            <div className="mt-2">
              <SearchBox compact />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-10 md:px-8">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Ingin tanya dosen?
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Asisten akademik AI untuk mahasiswa, dosen, dan peneliti
          </p>
        </div>

        <div className="mt-8">
          <DocumentAttachedList />
          <div className="mt-2">
            <SearchBox />
          </div>
        </div>

        <div className="mt-8">
          <FeatureCards />
        </div>
      </div>
    </div>
  );
}
