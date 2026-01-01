# Google Sheets Integration Setup

This guide will help you set up automatic export of onboarding form submissions to Google Sheets.

## Prerequisites

- A Google account
- A Google Sheet where you want to store the submissions

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

## Step 3: Create a Service Account

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the service account details:
   - Name: `tredfi-onboarding-sheets`
   - Description: `Service account for Tredfi onboarding form Google Sheets integration`
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

## Step 4: Generate Service Account Key

1. In the **Credentials** page, find your newly created service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** > **Create new key**
5. Select **JSON** format
6. Click **Create** - this will download a JSON file to your computer
7. **Important**: Keep this file secure and never commit it to version control

## Step 5: Share Your Google Sheet

1. Open the Google Sheet where you want to store submissions
2. Click the **Share** button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it **Editor** permissions
5. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - Copy the `{SPREADSHEET_ID}` part

## Step 6: Configure Environment Variables in Manus

1. Open your Tredfi onboarding project in Manus
2. Go to **Management UI** > **Settings** > **Secrets**
3. Add the following two secrets:

### Secret 1: GOOGLE_SHEETS_CREDENTIALS
- **Key**: `GOOGLE_SHEETS_CREDENTIALS`
- **Value**: Paste the entire contents of the JSON file you downloaded in Step 4
  - Open the JSON file in a text editor
  - Copy everything (it should start with `{` and end with `}`)
  - Paste it as the value

### Secret 2: GOOGLE_SHEETS_SPREADSHEET_ID
- **Key**: `GOOGLE_SHEETS_SPREADSHEET_ID`
- **Value**: Paste the Spreadsheet ID you copied in Step 5

## Step 7: Test the Integration

1. Submit a test form through your onboarding page
2. Check your Google Sheet - a new row should appear with the submission data
3. The first row will contain headers if the sheet was empty

## Troubleshooting

### "Permission denied" error
- Make sure you shared the Google Sheet with the service account email
- Verify the service account has Editor permissions

### "Invalid credentials" error
- Double-check that you copied the entire JSON file contents correctly
- Ensure there are no extra spaces or line breaks

### Data not appearing in the sheet
- Check the browser console and server logs for error messages
- Verify the Spreadsheet ID is correct
- Make sure the Google Sheets API is enabled in your Google Cloud project

## Sheet Structure

The integration will automatically create the following columns in your Google Sheet:

1. Timestamp
2. Dealership Name
3. Dealership Address
4. Dealership Phone
5. Primary Contact Name
6. Primary Contact Email
7. Primary Contact Cell
8. CRM Company
9. DMS Company
10. Website Company
11. Third Party Vendors
12. Facebook Ads
13. Marketplace Platforms
14. Backend Product Sales
15. Subprime Lenders
16. Sales Process
17. Deal Rehash Lenders
18. Platform Name
19. Color Scheme
20. Tire/Wheel Sales
21. Platform Usage

## Security Notes

- The service account JSON file contains sensitive credentials
- Never share this file publicly or commit it to version control
- Store it securely in the Manus Secrets panel
- You can revoke access at any time by removing the service account from the Google Sheet's sharing settings
