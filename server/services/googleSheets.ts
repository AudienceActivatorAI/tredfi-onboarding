import { google } from 'googleapis';

interface FormSubmission {
  dealershipName: string;
  dealershipAddress: string;
  dealershipPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactCell: string;
  crmCompany: string;
  crmLeadEmail: string;
  dmsCompany: string;
  dmsInventoryFeed: string;
  websiteCompany: string;
  thirdPartyVendors: string;
  facebookAds: string;
  marketplacePlatforms: string;
  subprimeLenders: string;
  salesProcess: string;
  specialFinancePlatform: string;
  platformName: string;
  colorScheme: string;
  tireWheelSales: string;
  platformUsage: string;
}

export async function appendToGoogleSheet(submission: FormSubmission) {
  try {
    // Check if credentials are provided
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!credentials || !spreadsheetId) {
      console.log('Google Sheets credentials not configured. Skipping export.');
      return { success: false, message: 'Google Sheets not configured' };
    }

    // Parse the service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare the row data
    const timestamp = new Date().toISOString();
    const values = [[
      timestamp,
      submission.dealershipName,
      submission.dealershipAddress,
      submission.dealershipPhone,
      submission.primaryContactName,
      submission.primaryContactEmail,
      submission.primaryContactCell,
      submission.crmCompany,
      submission.crmLeadEmail,
      submission.dmsCompany,
      submission.dmsInventoryFeed,
      submission.websiteCompany,
      submission.thirdPartyVendors,
      submission.facebookAds,
      submission.marketplacePlatforms,
      submission.subprimeLenders,
      submission.salesProcess,
      submission.specialFinancePlatform,
      submission.platformName,
      submission.colorScheme,
      submission.tireWheelSales,
      submission.platformUsage,
    ]];

    // Append the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:V', // Updated range for new columns
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Successfully exported submission to Google Sheets');
    return { success: true, message: 'Exported to Google Sheets' };
  } catch (error) {
    console.error('Error exporting to Google Sheets:', error);
    return { success: false, message: 'Failed to export to Google Sheets', error };
  }
}

export async function initializeGoogleSheet() {
  try {
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!credentials || !spreadsheetId) {
      return { success: false, message: 'Google Sheets not configured' };
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Check if the sheet has headers, if not, add them
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:V1',
    });

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers
      const headers = [[
        'Timestamp',
        'Dealership Name',
        'Dealership Address',
        'Dealership Phone',
        'Primary Contact Name',
        'Primary Contact Email',
        'Primary Contact Cell',
        'CRM Company',
        'CRM Lead Email',
        'DMS Company',
        'DMS Inventory Feed',
        'Website Company',
        'Website Conversion Tools',
        'Facebook Ads',
        '3rd Party Vendors',
        'Subprime Lenders',
        'Sales Process',
        'Special Finance Platform',
        'Platform Name',
        'Color Scheme',
        'Tire/Wheel Sales',
        'Platform Usage',
      ]];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:V1',
        valueInputOption: 'RAW',
        requestBody: {
          values: headers,
        },
      });

      console.log('Initialized Google Sheet with headers');
    }

    return { success: true, message: 'Google Sheet initialized' };
  } catch (error) {
    console.error('Error initializing Google Sheet:', error);
    return { success: false, message: 'Failed to initialize Google Sheet', error };
  }
}
