import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { timing } from "hono/timing";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { type HonoVariables } from "@repo/api/hono";

import { appContext, HonoEnv } from "@repo/shared";
import { logger as mainLogger } from "@repo/shared/utils";

import { log } from "./core/log.ts";

type Variables = HonoVariables;

export class HttpApplication {
  private readonly app: Hono<HonoEnv>;
  private controller: AbortController = new AbortController();
  protected internalHttpServer?: Deno.HttpServer;
  constructor() {
    this.app = new Hono<HonoEnv>();
    this.mountRoutes();
  }

  private mountRoutes() {
    this.app.use("*", logger(), poweredBy(), timing());
    this.app.use(
      "*",
      cors({
        origin: (origin) => origin,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
      }),
    );
    this.app.use(appContext);
    this.app.use("*", requestId());

    this.app.use(async (c, next) => {
      const metadata = c.get("context").requestMetadata;
      console.log("[HttpApplication] >> requestId", c.get("requestId")); // Debug

      const honoLogger = mainLogger.child({
        requestId: c.var.requestId,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });

      c.set("logger", honoLogger);

      await next();
    });

    // this.app.route("/", routes);
  }

  /**
   * Starts the HTTP server and begins listening on the specified port.
   *
   * @param {number} [port=3000] - The port number on which the server will listen.
   * @returns {Promise<{ port: number }>} A promise that resolves with an object containing the port number.
   *
   * @remarks
   * This method initializes an `AbortController` to manage the server's lifecycle and uses Deno's `serve` function to start the server.
   * The server will log a message indicating the port it is listening on.
   *
   * @example
   * ```typescript
   * const app = new DanetApplication();
   * await app.init(FirstModule);
   * const { port } = app.listen(3000);
   * ```
   */
  public listen(port: number = 8000): Promise<{ port: number }> {
    this.controller = new AbortController();
    const { signal } = this.controller;
    const listen = new Promise<{ port: number }>((resolve) => {
      this.internalHttpServer = Deno.serve({
        signal,
        port,
        onListen: (listen) => {
          const hostname = listen.hostname === "0.0.0.0"
            ? "localhost"
            : listen.hostname;
          log.info(`Listening on http://${hostname}:${listen.port}`);
          resolve({ ...listen });
        },
      }, this.app.fetch);
    });
    return listen;
  }

  /**
   * Adds REST endpoints to the application.
   *
   * @param {Function} setupFunc - A function that takes a Hono instance and returns a Hono instance.
   * @returns {HttpApplication} The current HttpApplication instance.
   *
   * @example
   * ```typescript
   * const app = new HttpApplication();
   * app.addRestEndpoints((app) => {
   *   app.get("/", (c) => c.text("Hello World!"));
   *   return app;
   * });
   * ```
   */
  public addRestEndpoints(
    setupFunc: (
      app: Hono<HonoEnv>,
    ) => Hono<HonoEnv>,
  ): HttpApplication {
    this.app.route("/api", setupFunc(this.app));
    return this;
  }

  public build() {
    return this.app;
  }
}
