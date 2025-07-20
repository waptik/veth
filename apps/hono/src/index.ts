// Cloudflare Workers type
import type { Context } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { requestId } from "hono/request-id";
import { timing } from "hono/timing";

import { createTRPCContext } from "@repo/api";
import { appRouter } from "@repo/api/router";
import { handleTrpcRouterError } from "@repo/api/utils";
import { appContext, HonoEnv } from "@repo/shared";
import { createLogger } from "@repo/shared/utils";

import { openApiTrpcServerHandler } from "./hono-trpc-open-api";
import { openApiDocument } from "./openapi";

const app = new Hono<HonoEnv>();

app.use("*", honoLogger(), poweredBy(), timing());
app.use("*", cors());
app.use(appContext);
app.use("*", requestId());

// Middleware to set up request metadata and logger
// This middleware runs for every request and sets up the logger with request-specific metadata
app.use(async (c, next) => {
  const metadata = c.get("context").requestMetadata;

  const honoLogger = createLogger("hono", {
    requestId: c.var.requestId,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
  });

  c.set("logger", honoLogger);

  await next();
});

/**
 * Mount tRPC handler
 * - Handle incoming tRPC requests
 */
app
  .all(
    "/trpc/*",
    trpcServer({
      router: appRouter,
      endpoint: "/trpc",
      createContext: ({ info, resHeaders }, c: Context<HonoEnv>) =>
        createTRPCContext({ c, requestSource: "app", info, resHeaders }),
      batching: { enabled: true },
      onError: (opts) => handleTrpcRouterError(opts, "trpc"),
    }),
  )
  .get("/", (c: Context<HonoEnv>) => c.text("Hello Hono!"))
  // Setup health check endpoint
  .get("/health", (c: Context<HonoEnv>) => {
    // const environment = getEnvironment(c.env);
    return c.json({
      status: "ok",
      // environment,
      timestamp: new Date().toISOString(),
      service: "tRPC API Server",
    });
  });

// endpoints for OpenAPI
app.get(`/api/openapi.json`, (c: Context<HonoEnv>) => c.json(openApiDocument));
// Use the middleware to serve Swagger UI at /ui
app.get("/api/ui", swaggerUI({ url: "/api/openapi.json" }));
// Use the OpenAPI handler for tRPC requests
app.use(`/api/*`, openApiTrpcServerHandler);

// Export for Cloudflare Workers
export default app;
