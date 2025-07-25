import type { ErrorHandlerOptions } from "@trpc/server/unstable-core-do-not-import";

import { AppError, AppErrorCode } from "@repo/shared/errors";
import { createLogger, logger } from "@repo/shared/utils";

import type { TRPCContext } from "./context";

// Parameters<NonNullable<Parameters<typeof trpcServer>[0]['onError']>>[0], // :-)
export const handleTrpcRouterError = (
  {
    error,
    ctx,
  }: Pick<ErrorHandlerOptions<TRPCContext>, "error" | "path" | "ctx">,
  _source: "trpc" | "api",
) => {
  const appError = AppError.parseError(error.cause || error);

  const isAppError = error.cause instanceof AppError;

  // Only log AppErrors that are explicitly set to 500 or the error code
  // is in the errorCodesToAlertOn list.
  const isLoggableAppError =
    isAppError &&
    (appError.statusCode === 500 ||
      errorCodesToAlertOn.includes(appError.code));

  // Only log TRPC errors that are in the `errorCodesToAlertOn` list and is
  // not an AppError.
  const isLoggableTrpcError =
    !isAppError && errorCodesToAlertOn.includes(error.code);

  const isExistingLogger = !!(ctx?.logger instanceof logger.Logger);
  const loggerName = ctx?.logger
    ? `${ctx.logger.loggerName}.TrpcError`
    : "TrpcError";
  const errorLogger = createLogger(
    loggerName,
    {
      status: "error",
      appError: AppError.toJSON(appError),
    },
    isExistingLogger,
  );

  // Only fully log the error on certain conditions since some errors are expected.
  if (isLoggableAppError || isLoggableTrpcError) {
    errorLogger.error(error);
  } else {
    errorLogger.info("TRPC_ERROR_HANDLER");
  }
};

const errorCodesToAlertOn = [
  AppErrorCode.UNKNOWN_ERROR,
  "INTERNAL_SERVER_ERROR",
];
