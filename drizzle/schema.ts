import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Onboarding submissions table
 * Stores all dealership onboarding form responses
 */
export const onboardingSubmissions = mysqlTable("onboarding_submissions", {
  id: int("id").autoincrement().primaryKey(),
  
  // Dealership info
  dealershipName: varchar("dealership_name", { length: 255 }),
  dealershipAddress: text("dealership_address"),
  dealershipPhone: varchar("dealership_phone", { length: 50 }),
  
  // Primary contact info
  primaryContactName: varchar("primary_contact_name", { length: 255 }),
  primaryContactEmail: varchar("primary_contact_email", { length: 320 }),
  primaryContactCell: varchar("primary_contact_cell", { length: 50 }),
  
  // Form responses
  crmName: text("crm_name"),
  crmNotApplicable: int("crm_not_applicable").default(0).notNull(),
  
  dmsName: text("dms_name"),
  dmsNotApplicable: int("dms_not_applicable").default(0).notNull(),
  
  websiteProvider: text("website_provider"),
  websiteNotApplicable: int("website_not_applicable").default(0).notNull(),
  
  thirdPartyVendors: text("third_party_vendors"),
  thirdPartyNotApplicable: int("third_party_not_applicable").default(0).notNull(),
  
  facebookAdsUsage: text("facebook_ads_usage"),
  facebookAdsNotApplicable: int("facebook_ads_not_applicable").default(0).notNull(),
  
  marketplacePlatforms: text("marketplace_platforms"),
  marketplaceNotApplicable: int("marketplace_not_applicable").default(0).notNull(),
  
  backendProducts: text("backend_products"),
  backendNotApplicable: int("backend_not_applicable").default(0).notNull(),
  
  subprimeLenders: text("subprime_lenders"),
  subprimeNotApplicable: int("subprime_not_applicable").default(0).notNull(),
  
  salesProcessStructure: text("sales_process_structure"),
  salesProcessNotApplicable: int("sales_process_not_applicable").default(0).notNull(),
  
  rehashingLenders: text("rehashing_lenders"),
  rehashingNotApplicable: int("rehashing_not_applicable").default(0).notNull(),
  
  // Platform customization
  platformName: varchar("platform_name", { length: 255 }),
  colorScheme: varchar("color_scheme", { length: 100 }),
  tireWheelSales: varchar("tire_wheel_sales", { length: 50 }),
  platformUsage: varchar("platform_usage", { length: 100 }),
  
  // Metadata
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: mysqlEnum("status", ["new", "in_progress", "completed"]).default("new").notNull(),
  notes: text("notes"),
});

export type OnboardingSubmission = typeof onboardingSubmissions.$inferSelect;
export type InsertOnboardingSubmission = typeof onboardingSubmissions.$inferInsert;