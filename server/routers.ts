import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { onboardingSubmissions } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  onboarding: router({
    submit: publicProcedure
      .input(z.object({
        dealershipName: z.string().optional(),
        dealershipAddress: z.string().optional(),
        dealershipPhone: z.string().optional(),
        primaryContactName: z.string().optional(),
        primaryContactEmail: z.string().email().optional(),
        primaryContactCell: z.string().optional(),
        crmName: z.string().optional(),
        crmNotApplicable: z.boolean(),
        dmsName: z.string().optional(),
        dmsNotApplicable: z.boolean(),
        websiteProvider: z.string().optional(),
        websiteNotApplicable: z.boolean(),
        thirdPartyVendors: z.string().optional(),
        thirdPartyNotApplicable: z.boolean(),
        facebookAdsUsage: z.string().optional(),
        facebookAdsNotApplicable: z.boolean(),
        marketplacePlatforms: z.string().optional(),
        marketplaceNotApplicable: z.boolean(),
        backendProducts: z.string().optional(),
        backendNotApplicable: z.boolean(),
        subprimeLenders: z.string().optional(),
        subprimeNotApplicable: z.boolean(),
        salesProcessStructure: z.string().optional(),
        salesProcessNotApplicable: z.boolean(),
        rehashingLenders: z.string().optional(),
        rehashingNotApplicable: z.boolean(),
        platformName: z.string().optional(),
        colorScheme: z.string().optional(),
        tireWheelSales: z.string().optional(),
        platformUsage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        const result = await db.insert(onboardingSubmissions).values({
          dealershipName: input.dealershipName,
          dealershipAddress: input.dealershipAddress,
          dealershipPhone: input.dealershipPhone,
          primaryContactName: input.primaryContactName,
          primaryContactEmail: input.primaryContactEmail,
          primaryContactCell: input.primaryContactCell,
          crmName: input.crmName,
          crmNotApplicable: input.crmNotApplicable ? 1 : 0,
          dmsName: input.dmsName,
          dmsNotApplicable: input.dmsNotApplicable ? 1 : 0,
          websiteProvider: input.websiteProvider,
          websiteNotApplicable: input.websiteNotApplicable ? 1 : 0,
          thirdPartyVendors: input.thirdPartyVendors,
          thirdPartyNotApplicable: input.thirdPartyNotApplicable ? 1 : 0,
          facebookAdsUsage: input.facebookAdsUsage,
          facebookAdsNotApplicable: input.facebookAdsNotApplicable ? 1 : 0,
          marketplacePlatforms: input.marketplacePlatforms,
          marketplaceNotApplicable: input.marketplaceNotApplicable ? 1 : 0,
          backendProducts: input.backendProducts,
          backendNotApplicable: input.backendNotApplicable ? 1 : 0,
          subprimeLenders: input.subprimeLenders,
          subprimeNotApplicable: input.subprimeNotApplicable ? 1 : 0,
          salesProcessStructure: input.salesProcessStructure,
          salesProcessNotApplicable: input.salesProcessNotApplicable ? 1 : 0,
          rehashingLenders: input.rehashingLenders,
          rehashingNotApplicable: input.rehashingNotApplicable ? 1 : 0,
          platformName: input.platformName,
          colorScheme: input.colorScheme,
          tireWheelSales: input.tireWheelSales,
          platformUsage: input.platformUsage,
        });

        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      // Only allow admins to view submissions
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can view submissions',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      const submissions = await db
        .select()
        .from(onboardingSubmissions)
        .orderBy(desc(onboardingSubmissions.submittedAt));

      return submissions;
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "in_progress", "completed"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Only allow admins to update submissions
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only admins can update submissions',
          });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        await db
          .update(onboardingSubmissions)
          .set({
            status: input.status,
            notes: input.notes,
          })
          .where(eq(onboardingSubmissions.id, input.id));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
