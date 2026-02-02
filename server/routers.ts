import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { onboardingSubmissions } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { appendToGoogleSheet } from "./services/googleSheets";

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
        crmLeadEmail: z.string().email().optional().or(z.literal('')),
        crmNotApplicable: z.boolean(),
        dmsName: z.string().optional(),
        dmsInventoryFeed: z.string().optional(),
        dmsNotApplicable: z.boolean(),
        websiteProvider: z.string().optional(),
        websiteNotApplicable: z.boolean(),
        thirdPartyVendors: z.string().optional(),
        thirdPartyNotApplicable: z.boolean(),
        facebookAdsUsage: z.string().optional(),
        facebookAdsNotApplicable: z.boolean(),
        marketplacePlatforms: z.string().optional(),
        marketplaceNotApplicable: z.boolean(),
        subprimeLenders: z.string().optional(),
        subprimeNotApplicable: z.boolean(),
        salesProcessStructure: z.string().optional(),
        salesProcessNotApplicable: z.boolean(),
        specialFinancePlatform: z.string().optional(),
        specialFinancePlatformNotApplicable: z.boolean(),
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
          crmLeadEmail: input.crmLeadEmail,
          crmNotApplicable: input.crmNotApplicable ? 1 : 0,
          dmsName: input.dmsName,
          dmsInventoryFeed: input.dmsInventoryFeed,
          dmsNotApplicable: input.dmsNotApplicable ? 1 : 0,
          websiteProvider: input.websiteProvider,
          websiteNotApplicable: input.websiteNotApplicable ? 1 : 0,
          thirdPartyVendors: input.thirdPartyVendors,
          thirdPartyNotApplicable: input.thirdPartyNotApplicable ? 1 : 0,
          facebookAdsUsage: input.facebookAdsUsage,
          facebookAdsNotApplicable: input.facebookAdsNotApplicable ? 1 : 0,
          marketplacePlatforms: input.marketplacePlatforms,
          marketplaceNotApplicable: input.marketplaceNotApplicable ? 1 : 0,
          subprimeLenders: input.subprimeLenders,
          subprimeNotApplicable: input.subprimeNotApplicable ? 1 : 0,
          salesProcessStructure: input.salesProcessStructure,
          salesProcessNotApplicable: input.salesProcessNotApplicable ? 1 : 0,
          specialFinancePlatform: input.specialFinancePlatform,
          specialFinancePlatformNotApplicable: input.specialFinancePlatformNotApplicable ? 1 : 0,
          platformName: input.platformName,
          colorScheme: input.colorScheme,
          tireWheelSales: input.tireWheelSales,
          platformUsage: input.platformUsage,
        });

        // Export to Google Sheets (non-blocking)
        appendToGoogleSheet({
          dealershipName: input.dealershipName || '',
          dealershipAddress: input.dealershipAddress || '',
          dealershipPhone: input.dealershipPhone || '',
          primaryContactName: input.primaryContactName || '',
          primaryContactEmail: input.primaryContactEmail || '',
          primaryContactCell: input.primaryContactCell || '',
          crmCompany: input.crmNotApplicable ? 'N/A' : (input.crmName || ''),
          crmLeadEmail: input.crmNotApplicable ? 'N/A' : (input.crmLeadEmail || ''),
          dmsCompany: input.dmsNotApplicable ? 'N/A' : (input.dmsName || ''),
          dmsInventoryFeed: input.dmsNotApplicable ? 'N/A' : (input.dmsInventoryFeed || ''),
          websiteCompany: input.websiteNotApplicable ? 'N/A' : (input.websiteProvider || ''),
          thirdPartyVendors: input.thirdPartyNotApplicable ? 'N/A' : (input.thirdPartyVendors || ''),
          facebookAds: input.facebookAdsNotApplicable ? 'N/A' : (input.facebookAdsUsage || ''),
          marketplacePlatforms: input.marketplaceNotApplicable ? 'N/A' : (input.marketplacePlatforms || ''),
          subprimeLenders: input.subprimeNotApplicable ? 'N/A' : (input.subprimeLenders || ''),
          salesProcess: input.salesProcessNotApplicable ? 'N/A' : (input.salesProcessStructure || ''),
          specialFinancePlatform: input.specialFinancePlatformNotApplicable ? 'N/A' : (input.specialFinancePlatform || ''),
          platformName: input.platformName || '',
          colorScheme: input.colorScheme || '',
          tireWheelSales: input.tireWheelSales || '',
          platformUsage: input.platformUsage || '',
        }).catch(err => {
          console.error('Failed to export to Google Sheets:', err);
          // Don't fail the submission if Google Sheets export fails
        });

        return { success: true };
      }),

    generateNames: publicProcedure
      .input(z.object({
        dealershipName: z.string(),
        keywords: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are a creative branding expert specializing in automotive dealership platforms with a focus on subprime lending and automotive finance. Generate 5 catchy, professional platform names that are modern, memorable, and relevant to car sales, dealership operations, and subprime financing. Names should convey trust, accessibility, and financial solutions for customers with credit challenges. Return only a JSON array of 5 strings, no additional text.',
                },
                {
                  role: 'user',
                  content: `Generate 5 platform name suggestions for ${input.dealershipName}. The platform helps dealerships sell cars smarter with a focus on subprime lending and financing solutions for customers with credit challenges. Names should be short (1-3 words), professional, and convey trust and financial accessibility.${input.keywords ? ` Incorporate these keywords or themes: ${input.keywords}` : ''}`,
                },
              ],
              temperature: 0.9,
            }),
          });

          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
          }

          const data = await response.json();
          const content = data.choices[0].message.content;
          
          // Parse the JSON array from the response
          const suggestions = JSON.parse(content);
          
          return { suggestions };
        } catch (error) {
          console.error('Failed to generate names:', error);
          // Return fallback suggestions if AI fails
          return {
            suggestions: [
              `${input.dealershipName} Pro`,
              `${input.dealershipName} Connect`,
              `${input.dealershipName} Hub`,
              `${input.dealershipName} Platform`,
              `${input.dealershipName} Direct`,
            ],
          };
        }
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
