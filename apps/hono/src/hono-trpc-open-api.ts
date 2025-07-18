import type { Context } from "hono";
import { createOpenApiFetchHandler } from "trpc-to-openapi";
import { appRouter } from "@repo/api/router";
import {
  AppError,
  genericErrorCodeToTrpcErrorCodeMap,
} from "@repo/shared/errors";
import { createTRPCContext } from "@repo/api";
import { handleTrpcRouterError } from "@repo/api/utils";

export const openApiTrpcServerHandler = (c: Context) => {
  // @ts-ignore - zod mismatch
  return createOpenApiFetchHandler<typeof appRouter>({
    endpoint: "/api",
    router: appRouter,
    createContext: ({ info }) =>
      createTRPCContext({ c, requestSource: "openapi", info }),
    req: c.req.raw,
    onError: (opts) => handleTrpcRouterError(opts, "apiV2"),
    // Not sure why we need to do this since we handle it in errorFormatter which runs after this.
    responseMeta: (opts) => {
      if (opts.errors[0]?.cause instanceof AppError) {
        const appError = AppError.parseError(opts.errors[0].cause);

        const httpStatus =
          genericErrorCodeToTrpcErrorCodeMap[appError.code]?.status ?? 400;

        return {
          status: httpStatus,
        };
      }

      return {};
    },
  });
};
