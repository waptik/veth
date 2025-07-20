import { useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
  TRPCClientError,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@repo/api/router";

import { getBaseUrl } from "./base-url";

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export const api = createTRPCContext<AppRouter>();

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _layout.tsx
 */
export const TRPCReactProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiUrl = `${getBaseUrl()}/trpc`;
  console.log("[TRPC.makeQueryClient] Using TRPC URL: ", apiUrl);

  const [queryClient] = useState(() =>
    new QueryClient({
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
          if (isTRPCClientError(error)) {
            console.error(
              "[TRPC.makeQueryClient] >> TRPC Client Error message: ",
              error.message,
            );
            console.error(
              "[TRPC.makeQueryClient] >> TRPC Client Error data: ",
              error.data,
            );
            console.error(
              "[TRPC.makeQueryClient] >> TRPC Client Error shape: ",
              error.shape,
            );
            console.error(
              "[TRPC.makeQueryClient] >> TRPC Client Error stack: ",
              error.stack,
            );
            console.error(
              "[TRPC.makeQueryClient] >> TRPC Client Error cause: ",
              error.cause,
            );
          } else {
            console.error("[TRPC.makeQueryClient] >>Non-TRPC Error: ", error);
          }
        },
      }),
    })
  );
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            __DEV__ || (op.direction === "down" && op.result instanceof Error),
          colorMode: "ansi",
        }),
        httpBatchLink({
          url: apiUrl,
          transformer: superjson,
          headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");

            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </api.TRPCProvider>
    </QueryClientProvider>
  );
};

export { type RouterInputs, type RouterOutputs } from "@repo/api";
