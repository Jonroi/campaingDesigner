import { postRouter } from "~/server/api/routers/post";
import { companyRouter } from "~/server/api/routers/company";
import { icpRouter } from "~/server/api/routers/icp";
import { campaignRouter } from "~/server/api/routers/campaign";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  company: companyRouter,
  icp: icpRouter,
  campaign: campaignRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
