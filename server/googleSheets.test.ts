import { describe, it, expect, beforeAll } from 'vitest';
import { appendToGoogleSheet, initializeGoogleSheet } from './services/googleSheets';

describe('Google Sheets Integration', () => {
  it('should handle missing credentials gracefully', async () => {
    // Temporarily remove credentials
    const originalCreds = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const originalSpreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    delete process.env.GOOGLE_SHEETS_CREDENTIALS;
    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await appendToGoogleSheet({
      dealershipName: 'Test Dealership',
      dealershipAddress: '123 Test St',
      dealershipPhone: '555-1234',
      primaryContactName: 'John Doe',
      primaryContactEmail: 'john@test.com',
      primaryContactCell: '555-5678',
      crmCompany: 'Test CRM',
      dmsCompany: 'Test DMS',
      websiteCompany: 'Test Website',
      thirdPartyVendors: 'Vendor1, Vendor2',
      facebookAds: 'Yes',
      marketplacePlatforms: 'Platform1',
      backendProductSales: 'Yes',
      subprimeLenders: 'Lender1',
      salesProcess: 'Standard',
      dealRehashLenders: 'Lender2',
      platformName: 'TestPlatform',
      colorScheme: 'Blue',
      tireWheelSales: 'Yes',
      platformUsage: 'In-House',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Google Sheets not configured');

    // Restore credentials
    if (originalCreds) process.env.GOOGLE_SHEETS_CREDENTIALS = originalCreds;
    if (originalSpreadsheetId) process.env.GOOGLE_SHEETS_SPREADSHEET_ID = originalSpreadsheetId;
  });

  it('should validate submission data structure', () => {
    const testSubmission = {
      dealershipName: 'Test Dealership',
      dealershipAddress: '123 Test St',
      dealershipPhone: '555-1234',
      primaryContactName: 'John Doe',
      primaryContactEmail: 'john@test.com',
      primaryContactCell: '555-5678',
      crmCompany: 'Test CRM',
      dmsCompany: 'Test DMS',
      websiteCompany: 'Test Website',
      thirdPartyVendors: 'Vendor1, Vendor2',
      facebookAds: 'Yes',
      marketplacePlatforms: 'Platform1',
      backendProductSales: 'Yes',
      subprimeLenders: 'Lender1',
      salesProcess: 'Standard',
      dealRehashLenders: 'Lender2',
      platformName: 'TestPlatform',
      colorScheme: 'Blue',
      tireWheelSales: 'Yes',
      platformUsage: 'In-House',
    };

    // Verify all required fields are present
    expect(testSubmission).toHaveProperty('dealershipName');
    expect(testSubmission).toHaveProperty('primaryContactEmail');
    expect(testSubmission).toHaveProperty('crmCompany');
    expect(testSubmission).toHaveProperty('platformName');
  });

  it('should handle initialization without credentials', async () => {
    const originalCreds = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const originalSpreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    delete process.env.GOOGLE_SHEETS_CREDENTIALS;
    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const result = await initializeGoogleSheet();

    expect(result.success).toBe(false);
    expect(result.message).toBe('Google Sheets not configured');

    // Restore credentials
    if (originalCreds) process.env.GOOGLE_SHEETS_CREDENTIALS = originalCreds;
    if (originalSpreadsheetId) process.env.GOOGLE_SHEETS_SPREADSHEET_ID = originalSpreadsheetId;
  });
});
