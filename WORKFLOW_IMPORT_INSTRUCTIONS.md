# Import Modified Workflow to n8n

## What Changed

The workflow has been modified to work with the web app:
- ✅ Added "Respond to Webhook" node to return results to the app
- ✅ Removed connection to ClickUp upload (keeps workflow web-app focused)
- ✅ Ready to accept file uploads for product images

## How to Import

1. **Download the modified workflow**
   - File: `workflow_modified_for_import.json` (in this directory)

2. **Open n8n**
   - Go to: https://n8n.srv1300789.hstgr.cloud

3. **Import the workflow**
   - Click "Workflows" in the sidebar
   - Click "Import from File" or the import icon
   - Select `workflow_modified_for_import.json`
   - The workflow will be imported as "✔️POC Stage: Product Research + Banners - KIE.AI - webapp (Web App Ready)"

4. **Activate the workflow**
   - Open the imported workflow
   - Toggle the "Active" switch to ON (green)
   - Save

5. **Test it**
   - Go back to the web app and submit the form
   - It should now work without the 500 error!

## What the Modified Workflow Does

1. Receives form data from web app (including uploaded image)
2. Runs AI research
3. Generates banners with KIE.ai
4. **Returns results to web app** (new!)

## Note

You can keep both workflows:
- Original: For ClickUp automation
- Modified: For web app use

Or delete the original if you only need the web app version.
