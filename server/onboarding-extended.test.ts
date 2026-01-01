import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../server/db';
import { onboardingSubmissions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Extended Onboarding Fields', () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it('should save dealership information and primary contact', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    const testSubmission = {
      dealershipName: 'Test Auto Group',
      dealershipAddress: '123 Main St, Springfield, IL 62701',
      dealershipPhone: '(555) 123-4567',
      primaryContactName: 'John Doe',
      primaryContactEmail: 'john.doe@testauto.com',
      primaryContactCell: '(555) 987-6543',
      crmName: 'Test CRM',
      crmNotApplicable: 0,
      dmsName: 'Test DMS',
      dmsNotApplicable: 0,
      websiteProvider: 'Test Website',
      websiteNotApplicable: 0,
      thirdPartyVendors: 'Vendor A',
      thirdPartyNotApplicable: 0,
      facebookAdsUsage: 'Yes',
      facebookAdsNotApplicable: 0,
      marketplacePlatforms: 'CarGurus',
      marketplaceNotApplicable: 0,
      backendProducts: 'Warranties',
      backendNotApplicable: 0,
      subprimeLenders: 'Lender X',
      subprimeNotApplicable: 0,
      salesProcessStructure: 'Standard',
      salesProcessNotApplicable: 0,
      rehashingLenders: 'Lender Y',
      rehashingNotApplicable: 0,
      platformName: null,
      colorScheme: null,
      tireWheelSales: null,
      platformUsage: null,
    };

    await db.insert(onboardingSubmissions).values(testSubmission);

    const saved = await db
      .select()
      .from(onboardingSubmissions)
      .where(eq(onboardingSubmissions.primaryContactEmail, 'john.doe@testauto.com'))
      .limit(1);

    expect(saved.length).toBe(1);
    expect(saved[0].dealershipName).toBe('Test Auto Group');
    expect(saved[0].dealershipAddress).toBe('123 Main St, Springfield, IL 62701');
    expect(saved[0].dealershipPhone).toBe('(555) 123-4567');
    expect(saved[0].primaryContactName).toBe('John Doe');
    expect(saved[0].primaryContactEmail).toBe('john.doe@testauto.com');
    expect(saved[0].primaryContactCell).toBe('(555) 987-6543');

    // Clean up
    await db
      .delete(onboardingSubmissions)
      .where(eq(onboardingSubmissions.primaryContactEmail, 'john.doe@testauto.com'));
  });

  it('should save platform customization preferences', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    const testSubmission = {
      dealershipName: 'Custom Platform Dealer',
      dealershipAddress: '456 Oak Ave, Chicago, IL 60601',
      dealershipPhone: '(555) 222-3333',
      primaryContactName: 'Jane Smith',
      primaryContactEmail: 'jane@customdealer.com',
      primaryContactCell: '(555) 444-5555',
      crmName: null,
      crmNotApplicable: 1,
      dmsName: null,
      dmsNotApplicable: 1,
      websiteProvider: null,
      websiteNotApplicable: 1,
      thirdPartyVendors: null,
      thirdPartyNotApplicable: 1,
      facebookAdsUsage: null,
      facebookAdsNotApplicable: 1,
      marketplacePlatforms: null,
      marketplaceNotApplicable: 1,
      backendProducts: null,
      backendNotApplicable: 1,
      subprimeLenders: null,
      subprimeNotApplicable: 1,
      salesProcessStructure: null,
      salesProcessNotApplicable: 1,
      rehashingLenders: null,
      rehashingNotApplicable: 1,
      platformName: 'DealFlow Pro',
      colorScheme: 'Professional Blue',
      tireWheelSales: 'Yes - Full Integration',
      platformUsage: 'Public Marketing',
    };

    await db.insert(onboardingSubmissions).values(testSubmission);

    const saved = await db
      .select()
      .from(onboardingSubmissions)
      .where(eq(onboardingSubmissions.primaryContactEmail, 'jane@customdealer.com'))
      .limit(1);

    expect(saved.length).toBe(1);
    expect(saved[0].platformName).toBe('DealFlow Pro');
    expect(saved[0].colorScheme).toBe('Professional Blue');
    expect(saved[0].tireWheelSales).toBe('Yes - Full Integration');
    expect(saved[0].platformUsage).toBe('Public Marketing');

    // Clean up
    await db
      .delete(onboardingSubmissions)
      .where(eq(onboardingSubmissions.primaryContactEmail, 'jane@customdealer.com'));
  });

  it('should handle complete submission with all new fields', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    const completeSubmission = {
      dealershipName: 'Complete Test Dealership',
      dealershipAddress: '789 Elm St, Los Angeles, CA 90001',
      dealershipPhone: '(555) 666-7777',
      primaryContactName: 'Bob Johnson',
      primaryContactEmail: 'bob@completetest.com',
      primaryContactCell: '(555) 888-9999',
      crmName: 'Salesforce',
      crmNotApplicable: 0,
      dmsName: 'CDK',
      dmsNotApplicable: 0,
      websiteProvider: 'Dealer.com',
      websiteNotApplicable: 0,
      thirdPartyVendors: 'AutoTrader, CarGurus',
      thirdPartyNotApplicable: 0,
      facebookAdsUsage: 'Yes, $10k/month',
      facebookAdsNotApplicable: 0,
      marketplacePlatforms: 'Facebook, Craigslist',
      marketplaceNotApplicable: 0,
      backendProducts: 'Extended warranties, GAP',
      backendNotApplicable: 0,
      subprimeLenders: 'Santander, Credit Acceptance',
      subprimeNotApplicable: 0,
      salesProcessStructure: 'Sales Manager to F&I',
      salesProcessNotApplicable: 0,
      rehashingLenders: 'Chase, Wells Fargo',
      rehashingNotApplicable: 0,
      platformName: 'AutoConnect Hub',
      colorScheme: 'Bold Red',
      tireWheelSales: 'Yes - Basic Catalog',
      platformUsage: 'Hybrid Approach',
    };

    await db.insert(onboardingSubmissions).values(completeSubmission);

    const saved = await db
      .select()
      .from(onboardingSubmissions)
      .where(eq(onboardingSubmissions.primaryContactEmail, 'bob@completetest.com'))
      .limit(1);

    expect(saved.length).toBe(1);
    expect(saved[0].dealershipName).toBe('Complete Test Dealership');
    expect(saved[0].primaryContactName).toBe('Bob Johnson');
    expect(saved[0].platformName).toBe('AutoConnect Hub');
    expect(saved[0].colorScheme).toBe('Bold Red');
    expect(saved[0].tireWheelSales).toBe('Yes - Basic Catalog');
    expect(saved[0].platformUsage).toBe('Hybrid Approach');
    expect(saved[0].crmName).toBe('Salesforce');
    expect(saved[0].status).toBe('new');

    // Clean up
    await db
      .delete(onboardingSubmissions)
      .where(eq(onboardingSubmissions.primaryContactEmail, 'bob@completetest.com'));
  });
});
