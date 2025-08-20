import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { aiService } from "~/server/ai/ollama";
import { redisService } from "~/server/redis";

export const campaignRouter = createTRPCRouter({
  // Get all campaigns for an ICP with caching
  list: protectedProcedure
    .input(z.object({ icpId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = redisService.getCampaignKey(input.icpId);

      // Try to get from cache first
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get from database
      const campaigns = await ctx.db.campaign.findMany({
        where: { icpId: input.icpId },
        include: {
          icpProfile: {
            include: {
              company: {
                include: {
                  companyData: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Cache for 5 minutes
      await redisService.set(cacheKey, campaigns, 300);

      return campaigns;
    }),

  // Get a single campaign by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.campaign.findFirst({
        where: { id: input.id },
        include: {
          icpProfile: {
            include: {
              company: {
                include: {
                  companyData: true,
                },
              },
            },
          },
        },
      });
    }),

  // Generate campaign using AI
  generate: protectedProcedure
    .input(
      z.object({
        icpId: z.string(),
        name: z.string().min(1),
        copyStyle: z.string().min(1),
        mediaType: z.string().min(1),
        cta: z.string().min(1),
        hooks: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get ICP profile for AI analysis
      const icpProfile = await ctx.db.iCPProfile.findFirst({
        where: { id: input.icpId },
        include: {
          company: {
            include: {
              companyData: true,
            },
          },
        },
      });

      if (!icpProfile) {
        throw new Error("ICP profile not found");
      }

      // Generate campaign using AI
      const campaignData = await aiService.generateCampaign({
        icpProfile: icpProfile.profileData,
        copyStyle: input.copyStyle,
        mediaType: input.mediaType,
        cta: input.cta,
        hooks: input.hooks,
      });

      // Create campaign in database
      const campaign = await ctx.db.campaign.create({
        data: {
          name: input.name,
          icpId: input.icpId,
          copyStyle: input.copyStyle,
          mediaType: input.mediaType,
          adCopy:
            campaignData.adCopy?.headline ||
            campaignData.adCopy ||
            "Compelling ad copy",
          imagePrompt:
            campaignData.imagePrompt || "Professional marketing imagery",
          imageUrl: null, // Will be generated later
          cta: input.cta,
          hooks: input.hooks,
          landingPageCopy:
            campaignData.landingPageCopy?.heroSection?.headline ||
            campaignData.landingPageCopy ||
            "Landing page copy",
        },
        include: {
          icpProfile: {
            include: {
              company: {
                include: {
                  companyData: true,
                },
              },
            },
          },
        },
      });

      // Invalidate cache
      await redisService.invalidateCampaignCache(input.icpId);

      return campaign;
    }),

  // Update campaign
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        copyStyle: z.string().min(1).optional(),
        mediaType: z.string().min(1).optional(),
        adCopy: z.string().optional(),
        imagePrompt: z.string().optional(),
        imageUrl: z.string().optional(),
        cta: z.string().min(1).optional(),
        hooks: z.string().min(1).optional(),
        landingPageCopy: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const campaign = await ctx.db.campaign.update({
        where: { id },
        data: updateData,
        include: {
          icpProfile: true,
        },
      });

      // Invalidate cache
      await redisService.invalidateCampaignCache(campaign.icpId);

      return campaign;
    }),

  // Delete campaign
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.campaign.findFirst({
        where: { id: input.id },
        include: { icpProfile: true },
      });

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      await ctx.db.campaign.delete({
        where: { id: input.id },
      });

      // Invalidate cache
      await redisService.invalidateCampaignCache(campaign.icpId);

      return { success: true };
    }),

  // Regenerate campaign with AI
  regenerate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        copyStyle: z.string().min(1).optional(),
        mediaType: z.string().min(1).optional(),
        cta: z.string().min(1).optional(),
        hooks: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get existing campaign
      const existingCampaign = await ctx.db.campaign.findFirst({
        where: { id: input.id },
        include: {
          icpProfile: {
            include: {
              company: {
                include: {
                  companyData: true,
                },
              },
            },
          },
        },
      });

      if (!existingCampaign) {
        throw new Error("Campaign not found");
      }

      // Generate new campaign data using AI
      const campaignData = await aiService.generateCampaign({
        icpProfile: existingCampaign.icpProfile.profileData,
        copyStyle: input.copyStyle || existingCampaign.copyStyle,
        mediaType: input.mediaType || existingCampaign.mediaType,
        cta: input.cta || existingCampaign.cta,
        hooks: input.hooks || existingCampaign.hooks,
      });

      // Update campaign with new AI-generated content
      const campaign = await ctx.db.campaign.update({
        where: { id: input.id },
        data: {
          adCopy:
            campaignData.adCopy?.headline ||
            campaignData.adCopy ||
            existingCampaign.adCopy,
          imagePrompt: campaignData.imagePrompt || existingCampaign.imagePrompt,
          landingPageCopy:
            campaignData.landingPageCopy?.heroSection?.headline ||
            campaignData.landingPageCopy ||
            existingCampaign.landingPageCopy,
          copyStyle: input.copyStyle || existingCampaign.copyStyle,
          mediaType: input.mediaType || existingCampaign.mediaType,
          cta: input.cta || existingCampaign.cta,
          hooks: input.hooks || existingCampaign.hooks,
        },
        include: {
          icpProfile: {
            include: {
              company: {
                include: {
                  companyData: true,
                },
              },
            },
          },
        },
      });

      // Invalidate cache
      await redisService.invalidateCampaignCache(campaign.icpId);

      return campaign;
    }),

  // Get campaign analytics (placeholder for future implementation)
  analytics: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // This would integrate with analytics services in the future
      return {
        id: input.id,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
      };
    }),
});
