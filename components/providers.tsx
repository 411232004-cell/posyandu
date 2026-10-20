"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { flushPendingQueue } from "@/lib/api";
import { usePosyanduStore } from "@/lib/store";

function ConnectivityWatcher() {
  const setOnline = usePosyanduStore((s) => s.setOnline);

  useEffect(() => {
    const update = () => {
      const online = navigator.onLine;
      setOnline(online);
      if (online) void flushPendingQueue();
    };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [setOnline]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <ConnectivityWatcher />
      {children}
    </QueryClientProvider>
  );
}
