import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { appRouter } from "./root";
import { createTRPCContext } from "./lib/trpc";
import type { TRPCContext } from "./lib/context";

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 */
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { appRouter, createTRPCContext };
export type { AppRouter, RouterInputs, RouterOutputs, TRPCContext };
