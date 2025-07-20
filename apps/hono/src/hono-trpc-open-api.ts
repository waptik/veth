import type { Context } from "hono";
import { createOpenApiFetchHandler } from "trpc-to-openapi";

import type { AppRouter } from "@repo/api";
import { createTRPCContext } from "@repo/api";
import { appRouter } from "@repo/api/router";
import { handleTrpcRouterError } from "@repo/api/utils";
import {
  AppError,
  genericErrorCodeToTrpcErrorCodeMap,
} from "@repo/shared/errors";

export const openApiTrpcServerHandler = (c: Context) => {
  return createOpenApiFetchHandler<AppRouter>({
    endpoint: "/api",
    router: appRouter,
    createContext: ({ info, resHeaders }) =>
      createTRPCContext({ c, requestSource: "openapi", info, resHeaders }),
    req: c.req.raw,
    onError: (opts) => handleTrpcRouterError(opts, "api"),
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
