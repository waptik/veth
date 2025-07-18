import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../lib/trpc";

export const appRouter = createTRPCRouter({
    hello: publicProcedure
        .meta({ /* 👉 */ openapi: { method: "GET", path: "/say-hello" } })
        .input(z.object({ name: z.string().default("TRPC") }))
        .output(z.object({ greeting: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.name ?? "World"}!`,
            };
        }),

    health: publicProcedure
        .meta({ /* 👉 */ openapi: { method: "GET", path: "/health" } })
        .input(z.void())
        .output(z.object({
            status: z.string(),
            timestamp: z.string(),
        }))
        .query(() => {
            return {
                status: "ok",
                timestamp: new Date().toISOString(),
            };
        }),
});
