import { postRouter } from "./routers/post";
import { createTRPCRouter } from "./lib/trpc";
import { appRouter } from "./routers/app";

const mainRouter = createTRPCRouter({
    post: postRouter,
    app: appRouter,
});

// export type definition of API
export type AppRouter = typeof mainRouter;

// Export the router as default for easier imports
export { mainRouter as appRouter, mainRouter as router };
