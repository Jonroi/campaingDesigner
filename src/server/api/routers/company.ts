import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { redisService } from "~/server/redis";

export const companyRouter = createTRPCRouter({
  // Get all companies for the current user with caching
  list: protectedProcedure.query(async ({ ctx }) => {
    const cacheKey = redisService.getCompanyKey(ctx.session.user.id);

    // Try to get from cache first
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get from database
    const companies = await ctx.db.company.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        companyData: true,
        icpProfiles: {
          include: {
            campaigns: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Cache for 5 minutes
    await redisService.set(cacheKey, companies, 300);

    return companies;
  }),

  // Get a single company by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.company.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          companyData: true,
          icpProfiles: {
            include: {
              campaigns: true,
            },
          },
        },
      });
    }),

  // Create a new company
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        companyData: z
          .array(
            z.object({
              fieldName: z.string(),
              fieldValue: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
          companyData: input.companyData
            ? {
                create: input.companyData,
              }
            : undefined,
        },
        include: {
          companyData: true,
        },
      });

      // Invalidate cache
      await redisService.invalidateCompanyCache(ctx.session.user.id);

      return company;
    }),

  // Update company data
  updateData: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        fieldName: z.string(),
        fieldValue: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const companyData = await ctx.db.companyData.upsert({
        where: {
          companyId_fieldName: {
            companyId: input.companyId,
            fieldName: input.fieldName,
          },
        },
        update: {
          fieldValue: input.fieldValue,
          version: { increment: 1 },
        },
        create: {
          companyId: input.companyId,
          fieldName: input.fieldName,
          fieldValue: input.fieldValue,
        },
      });

      // Invalidate caches
      await redisService.invalidateCompanyCache(ctx.session.user.id);
      await redisService.invalidateICPCache(input.companyId);
      await redisService.invalidateAnalysisCache(input.companyId);

      return companyData;
    }),

  // Update company information
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const company = await ctx.db.company.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: updateData,
        include: {
          companyData: true,
          icpProfiles: {
            include: {
              campaigns: true,
            },
          },
        },
      });

      // Invalidate caches
      await redisService.invalidateCompanyCache(ctx.session.user.id);
      await redisService.invalidateICPCache(id);
      await redisService.invalidateAnalysisCache(id);

      return company;
    }),

  // Delete a company
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.company.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      // Invalidate caches
      await redisService.invalidateCompanyCache(ctx.session.user.id);
      await redisService.invalidateICPCache(input.id);
      await redisService.invalidateAnalysisCache(input.id);

      return { success: true };
    }),

  // Get company statistics
  stats: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          _count: {
            select: {
              companyData: true,
              icpProfiles: true,
            },
          },
          icpProfiles: {
            include: {
              _count: {
                select: {
                  campaigns: true,
                },
              },
            },
          },
        },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      const totalCampaigns = company.icpProfiles.reduce(
        (sum, icp) => sum + icp._count.campaigns,
        0,
      );

      return {
        companyId: input.id,
        dataFields: company._count.companyData,
        icpProfiles: company._count.icpProfiles,
        totalCampaigns,
        lastUpdated: company.updatedAt,
      };
    }),

  // Bulk update company data
  bulkUpdateData: protectedProcedure
    .input(
      z.object({
        companyId: z.number(),
        companyData: z.array(
          z.object({
            fieldName: z.string(),
            fieldValue: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updates = await Promise.all(
        input.companyData.map((data) =>
          ctx.db.companyData.upsert({
            where: {
              companyId_fieldName: {
                companyId: input.companyId,
                fieldName: data.fieldName,
              },
            },
            update: {
              fieldValue: data.fieldValue,
              version: { increment: 1 },
            },
            create: {
              companyId: input.companyId,
              fieldName: data.fieldName,
              fieldValue: data.fieldValue,
            },
          }),
        ),
      );

      // Invalidate caches
      await redisService.invalidateCompanyCache(ctx.session.user.id);
      await redisService.invalidateICPCache(input.companyId);
      await redisService.invalidateAnalysisCache(input.companyId);

      return updates;
    }),
});
