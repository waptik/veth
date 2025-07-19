import { swaggerUI } from "@hono/swagger-ui";
import { trpcServer } from "@hono/trpc-server";

import { createTRPCContext } from "@repo/api";
import { appRouter } from "@repo/api/router";

import { openApiTrpcServerHandler } from "./hono-trpc-open-api.ts";
import { openApiDocument } from "./openapi.ts";
import { HttpApplication } from "./server.ts";

async function main() {
  const httpApp = new HttpApplication();
  httpApp.addRestEndpoints((app) => {
    /**
     * Mount tRPC handler
     * - Handle incoming tRPC requests
     */
    app
      .all(
        "/api/trpc/*",
        trpcServer({
          router: appRouter,
          endpoint: "/api/trpc",
          createContext: ({ info }, c) =>
            createTRPCContext({ c, requestSource: "app", info }),
          batching: { enabled: true },
          onError({ error, path }) {
            console.error("tRPC error on path", path, ":", error);
          },
        }),
      )
      .get("/", (c) => c.text("Hello Hono!"))
      // Setup health check endpoint
      .get("/health", (c) => {
        // const environment = getEnvironment(c.env);
        return c.json({
          status: "ok",
          // environment,
          timestamp: new Date().toISOString(),
          service: "tRPC API Server",
        });
      });

    // endpoints for OpenAPI
    app.get(`/api/openapi.json`, (c) => c.json(openApiDocument));
    app.use(`/api/*`, openApiTrpcServerHandler);

    // Use the middleware to serve Swagger UI at /ui
    app.get("/ui", swaggerUI({ url: "/api/openapi.json" }));

    return app;
  });
  await httpApp.listen();
}

main().catch((error) => {
  console.error("Error starting the application:", error);
  Deno.exit(1);
});

// app.get("*", async (c) => {
//   try {
//     // First try to serve the exact requested path
//     const requestUrl = new URL(c.req.url);
//     let response = await c.env.ASSETS.fetch(requestUrl, c.req.raw);

//     // If not found, fall back to index.html for SPA routing
//     if (response.status === 404) {
//       const indexUrl = new URL("/index.html", c.req.url);
//       response = await c.env.ASSETS.fetch(indexUrl, c.req.raw);
//     }

//     return response;
//   } catch (error) {
//     console.error("Error serving static content:", error);
//     return c.text("Error serving content", 500);
//   }
// });
