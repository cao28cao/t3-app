import { Prisma } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";

export const threadRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteThreads({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      });
    }),

  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )

    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfiniteThreads({
          limit,
          ctx,
          cursor,
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : {
                  user: {
                    followers: {
                      some: { id: currentUserId },
                    },
                  },
                },
        });
      },
    ),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const thread = await ctx.db.thread.create({
        data: { content, userId: ctx.session.user.id },
      });
      return thread;
    }),

  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { threadId: id, userId: ctx.session.user.id };
      const existingLike = await ctx.db.like.findUnique({
        where: { userId_threadId: data },
      });
      if (existingLike == null) {
        await ctx.db.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.db.like.delete({ where: { userId_threadId: data } });
        return { addedLike: false };
      }
    }),
});

async function getInfiniteThreads({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.ThreadWhereInput;
  limit: number;
  cursor:
      {
        id: string;
        createdAt: Date;
      } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.db.thread.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes:
        currentUserId == null
          ? false
          : {
              where: { userId: currentUserId },
            },
      user: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = {
        id: nextItem.id,
        createdAt: nextItem.createdAt,
      };
    }
  }

  return {
    threads: data.map((thread) => ({
      id: thread.id,
      content: thread.content,
      createdAt: thread.createdAt,
      likeCount: thread._count.likes,
      user: thread.user,
      likedByMe: thread.likes?.length > 0,
    })),
    nextCursor,
  };
}
