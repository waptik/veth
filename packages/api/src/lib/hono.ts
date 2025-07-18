import type { Hono } from "hono";
import { type TimingVariables } from "hono/timing";
import { appRouter } from "../root";
import type { TRPCContext } from "./context.js";
import { trpcServer } from "@hono/trpc-server";

export type HonoVariables = TimingVariables;

/**
 * Setup tRPC routes for Hono.
 *
 * @see https://github.com/avarayr/suaveui/blob/master/src/hono.ts#L10C1-L11C1
 */
export function setupRoutes(app: Hono<{ Variables: HonoVariables }>) {
    app.all(
        "/trpc/*",
        trpcServer({
            router: appRouter,
            createContext({ req, resHeaders, info }): TRPCContext {
                return {
                    req,
                    resHeaders,
                    info,
                    cache: new Map<string | symbol, unknown>(),
                };
            },
            batching: { enabled: true },
            onError({ error, path }) {
                console.error("tRPC error on path", path, ":", error);
            },
        }),
    );
}

async function gracefulShutdown(signal: string) {
    console.log(`📡 Received ${signal}. Shutting down gracefully...`);
    try {
        // wait for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        //   await db.close();
        console.log("📡 Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Error during graceful shutdown:", error);
        process.exit(1);
    }
}

export function setupSignalHandlers() {
    // Check if we've already added the listeners
    if (
        (globalThis as { _signal_handlers_added__?: boolean })
            ?._signal_handlers_added__
    ) {
        return;
    }

    const signals: NodeJS.Signals[] = [
        "SIGINT",
        "SIGTERM",
        "SIGQUIT",
        "SIGHUP",
        "SIGABRT",
    ];
    signals.forEach((signal) => {
        process.on(signal, () => void gracefulShutdown(signal));
    });

    (globalThis as unknown as { _signal_handlers_added__: boolean })
        ._signal_handlers_added__ = true;

    process.on("uncaughtException", (error) => {
        console.error("Uncaught exception:", error);
    });

    process.on("unhandledRejection", (reason) => {
        console.error("Unhandled rejection:", reason);
    });
}
