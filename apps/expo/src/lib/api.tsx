import { useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@repo/api/router";

import { getBaseUrl } from "./base-url";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("[TRPC.makeQueryClient] Error happened: ", error);
    },
  }),
});

export const api = createTRPCContext<AppRouter>();

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _layout.tsx
 */
export const TRPCReactProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const url = getBaseUrl();
  console.log("[TRPCReactProvider] >> url", url);

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            __DEV__ || (op.direction === "down" && op.result instanceof Error),
          colorMode: "ansi",
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <api.TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.TRPCProvider>
  );
};

// eslint-disable-next-line import/no-unresolved
export { type RouterInputs, type RouterOutputs } from "@repo/api";
