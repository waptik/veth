import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { requestId } from "hono/request-id";
import { timing } from "hono/timing";

import { appContext, HonoEnv } from "@repo/shared";
import { logger as mainLogger } from "@repo/shared/utils";

export class HttpApplication {
  private readonly app: Hono<HonoEnv>;
  private controller: AbortController = new AbortController();
  // protected internalHttpServer?: Deno.HttpServer;
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
  // public listen(port: number = 8000): Promise<{ port: number }> {
  //   this.controller = new AbortController();
  //   const { signal } = this.controller;
  //   const listen = new Promise<{ port: number }>((resolve) => {
  //     this.internalHttpServer = Deno.serve({
  //       signal,
  //       port,
  //       onListen: (listen) => {
  //         const hostname = listen.hostname === "0.0.0.0"
  //           ? "localhost"
  //           : listen.hostname;
  //         log.info(`Listening on http://${hostname}:${listen.port}`);
  //         resolve({ ...listen });
  //       },
  //     }, this.app.fetch);
  //   });
  //   return listen;
  // }

  /**
   * Builds the Hono application instance.
   *
   * @returns {Hono<HonoEnv>} The Hono application instance.
   *
   * @remarks
   * This method finalizes the application setup and returns the configured Hono instance.
   */
  public build() {
    return this.app;
  }
}
