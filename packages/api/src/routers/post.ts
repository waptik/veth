import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "../lib/trpc";

const posts = [
    {
        id: "1",
        title: "Post 1",
        content: "Content 1",
    },
    {
        id: "2",
        title: "Post 2",
        content: "Content 2",
    },
];

const PostSchema = z.object({
    id: z.string(),
    content: z.string(),
    title: z.string(),
});

const CreatePostSchema = PostSchema.omit({ id: true });

export const postRouter = createTRPCRouter({
    all: publicProcedure
        .meta({ /* 👉 */ openapi: { method: "GET", path: "/posts" } })
        .input(z.void())
        .output(
            z.array(
                PostSchema,
            ),
        )
        .query(({ ctx }) => {
            return posts;
        }),

    byId: publicProcedure
        .meta({ /* 👉 */ openapi: { method: "GET", path: "/posts/{id}" } })
        .input(z.object({ id: z.string() }))
        .output(
            PostSchema.optional(),
        )
        .query(({ ctx, input }) => {
            return posts.find((post) => post.id === input.id);
        }),

    create: protectedProcedure
        .meta({ /* 👉 */ openapi: { method: "POST", path: "/posts" } })
        .input(CreatePostSchema)
        .output(z.number())
        .mutation(({ ctx, input }) => {
            const post = {
                id: Math.random().toString(),
                ...input,
            };
            return posts.push(post);
        }),

    delete: protectedProcedure
        .meta({ /* 👉 */ openapi: { method: "DELETE", path: "/posts/{id}" } })
        .input(z.object({ id: z.string() }))
        .output(z.boolean())
        .mutation(({ ctx, input }) => {
            const updatedPost = posts.filter((post) => post.id !== input.id);
            const isDeleted = posts.find((post) => post.id !== input.id);
            return !!isDeleted;
        }),
});
