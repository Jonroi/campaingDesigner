import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { aiService } from "~/server/ai/ollama";
import { redisService } from "~/server/redis";

export const icpRouter = createTRPCRouter({
  // Get all ICP profiles for a company with caching
  list: protectedProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = redisService.getICPKey(input.companyId);

      // Try to get from cache first
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get from database
      const icpProfiles = await ctx.db.iCPProfile.findMany({
        where: { companyId: input.companyId },
        include: {
          campaigns: true,
          company: {
            include: {
              companyData: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Cache for 5 minutes
      await redisService.set(cacheKey, icpProfiles, 300);

      return icpProfiles;
    }),

  // Get a single ICP profile by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.iCPProfile.findFirst({
        where: { id: input.id },
        include: {
          campaigns: true,
          company: {
            include: {
              companyData: true,
            },
          },
        },
      });
    }),

  // Generate ICP profile using AI
  generate: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get company data for AI analysis
      const company = await ctx.db.company.findFirst({
        where: {
          id: input.companyId,
          userId: ctx.session.user.id,
        },
        include: {
          companyData: true,
        },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      // Prepare data for AI analysis
      const companyDataMap = company.companyData.reduce(
        (acc, data) => {
          acc[data.fieldName] = data.fieldValue;
          return acc;
        },
        {} as Record<string, string>,
      );

      // Generate ICP profile using AI
      const icpData = await aiService.generateICPProfile({
        companyName: company.name,
        industry: companyDataMap.industry || "Technology",
        location: companyDataMap.location || "Global",
        size: companyDataMap.size || "10-500 employees",
        revenue: companyDataMap.revenue || "$1M-$10M",
        targetMarket: companyDataMap.targetMarket || "B2B",
        painPoints: companyDataMap.painPoints
          ? companyDataMap.painPoints.split(",")
          : ["Limited resources", "Need for solutions"],
        goals: companyDataMap.goals
          ? companyDataMap.goals.split(",")
          : ["Growth", "Efficiency", "Innovation"],
      });

      // Create ICP profile in database
      const icpProfile = await ctx.db.iCPProfile.create({
        data: {
          name: input.name,
          description: input.description,
          profileData: icpData,
          companyId: input.companyId,
          confidenceLevel: "high",
        },
        include: {
          campaigns: true,
          company: {
            include: {
              companyData: true,
            },
          },
        },
      });

      // Invalidate cache
      await redisService.invalidateICPCache(input.companyId);

      return icpProfile;
    }),

  // Update ICP profile
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        profileData: z.any().optional(),
        confidenceLevel: z.enum(["low", "medium", "high"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const icpProfile = await ctx.db.iCPProfile.update({
        where: { id },
        data: updateData,
        include: {
          campaigns: true,
          company: true,
        },
      });

      // Invalidate cache
      await redisService.invalidateICPCache(icpProfile.companyId);

      return icpProfile;
    }),

  // Delete ICP profile
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const icpProfile = await ctx.db.iCPProfile.findFirst({
        where: { id: input.id },
        include: { company: true },
      });

      if (!icpProfile) {
        throw new Error("ICP profile not found");
      }

      await ctx.db.iCPProfile.delete({
        where: { id: input.id },
      });

      // Invalidate cache
      await redisService.invalidateICPCache(icpProfile.companyId);

      return { success: true };
    }),

  // Analyze company data for ICP insights
  analyze: protectedProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = redisService.getAnalysisKey(input.companyId);

      // Try to get from cache first
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get company data
      const company = await ctx.db.company.findFirst({
        where: {
          id: input.companyId,
          userId: ctx.session.user.id,
        },
        include: {
          companyData: true,
        },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      // Analyze with AI
      const analysis = await aiService.analyzeCompanyData(company.companyData);

      // Cache for 10 minutes
      await redisService.set(cacheKey, analysis, 600);

      return analysis;
    }),
});
