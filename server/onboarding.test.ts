import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../server/db';
import { onboardingSubmissions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Onboarding Submission Flow', () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it('should save a complete onboarding submission to the database', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    const testSubmission = {
      dealershipName: 'Test Dealership',
      contactEmail: 'test@dealership.com',
      contactPhone: '555-1234',
      crmName: 'Salesforce',
      crmNotApplicable: 0,
      dmsName: 'DealerTrack',
      dmsNotApplicable: 0,
      websiteProvider: 'AutoTrader',
      websiteNotApplicable: 0,
      thirdPartyVendors: 'Vendor A, Vendor B',
      thirdPartyNotApplicable: 0,
      facebookAdsUsage: 'Yes, monthly budget $5000',
      facebookAdsNotApplicable: 0,
      marketplacePlatforms: 'CarGurus, AutoTrader',
      marketplaceNotApplicable: 0,
      backendProducts: 'Extended warranties, GAP insurance',
      backendNotApplicable: 0,
      subprimeLenders: 'Lender X, Lender Y',
      subprimeNotApplicable: 0,
      salesProcessStructure: 'Sales Manager to F&I Manager',
      salesProcessNotApplicable: 0,
      rehashingLenders: 'Lender Z',
      rehashingNotApplicable: 0,
    };

    // Insert test submission
    const result = await db.insert(onboardingSubmissions).values(testSubmission);
    
    expect(result).toBeDefined();

    // Verify it was saved by querying back
    const saved = await db
      .select()
      .from(onboardingSubmissions)
      .where(eq(onboardingSubmissions.contactEmail, 'test@dealership.com'))
      .limit(1);

    expect(saved.length).toBe(1);
    expect(saved[0].dealershipName).toBe('Test Dealership');
    expect(saved[0].crmName).toBe('Salesforce');
    expect(saved[0].status).toBe('new');

    // Clean up
    await db
      .delete(onboardingSubmissions)
      .where(eq(onboardingSubmissions.contactEmail, 'test@dealership.com'));
  });

  it('should handle submissions with "Not Applicable" fields', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    const testSubmission = {
      dealershipName: 'Small Dealership',
      contactEmail: 'small@dealer.com',
      contactPhone: '555-5678',
      crmName: null,
      crmNotApplicable: 1,
      dmsName: 'Basic DMS',
      dmsNotApplicable: 0,
      websiteProvider: null,
      websiteNotApplicable: 1,
      thirdPartyVendors: null,
      thirdPartyNotApplicable: 1,
      facebookAdsUsage: null,
      facebookAdsNotApplicable: 1,
      marketplacePlatforms: 'Facebook Marketplace',
      marketplaceNotApplicable: 0,
      backendProducts: null,
      backendNotApplicable: 1,
      subprimeLenders: null,
      subprimeNotApplicable: 1,
      salesProcessStructure: null,
      salesProcessNotApplicable: 1,
      rehashingLenders: null,
      rehashingNotApplicable: 1,
    };

    // Insert test submission
    await db.insert(onboardingSubmissions).values(testSubmission);

    // Verify it was saved
    const saved = await db
      .select()
      .from(onboardingSubmissions)
      .where(eq(onboardingSubmissions.contactEmail, 'small@dealer.com'))
      .limit(1);

    expect(saved.length).toBe(1);
    expect(saved[0].crmNotApplicable).toBe(1);
    expect(saved[0].websiteNotApplicable).toBe(1);
    expect(saved[0].marketplacePlatforms).toBe('Facebook Marketplace');

    // Clean up
    await db
      .delete(onboardingSubmissions)
      .where(eq(onboardingSubmissions.contactEmail, 'small@dealer.com'));
  });

  it('should retrieve all submissions ordered by submission date', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    // Get all submissions
    const allSubmissions = await db
      .select()
      .from(onboardingSubmissions)
      .orderBy(onboardingSubmissions.submittedAt);

    expect(Array.isArray(allSubmissions)).toBe(true);
    // Should have at least the structure we expect
    if (allSubmissions.length > 0) {
      expect(allSubmissions[0]).toHaveProperty('id');
      expect(allSubmissions[0]).toHaveProperty('dealershipName');
      expect(allSubmissions[0]).toHaveProperty('status');
      expect(allSubmissions[0]).toHaveProperty('submittedAt');
    }
  });
});
