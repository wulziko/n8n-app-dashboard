# Workflow Fix Guide: Product Image Handling

## Problem Summary
The n8n workflow was failing with error: **"URL parameter must be a string, got undefined"**

### Root Cause
The "KIE.ai - Submit Task" node was hardcoded to get the product image from ClickUp data:
```javascript
$("Get a task").first().json.custom_fields[11].value[0].url_w_host
```

When triggered from the web app, this ClickUp data doesn't exist, causing the image URL to be `undefined`.

Additionally, the web app sends base64-encoded images, but KIE.ai expects a public URL.

## Solution Implemented

### Fixed Workflow File
**Location:** `/Users/guymargi/Documents/Automations/n8n to app/workflow_web_app_ready.json`

### Changes Made

#### 1. Replaced Form Trigger with Webhook Trigger
- **ID:** `ccbf1e03-2ef5-410a-8e81-03f8b1355393` (matches tools.json)
- **Method:** POST
- **Path:** `ccbf1e03-2ef5-410a-8e81-03f8b1355393`

#### 2. Added "Upload Image to imgBB" Node
Converts base64 images to public URLs:
- Receives `product_image` (base64 string) from webhook
- Uploads to imgBB API
- Returns `product_image_url` (permanent public URL)
- Preserves all other form fields

#### 3. Updated "HTTP Request - AI Research" Node
Changed data source from:
```javascript
$("Get a task").first().json.custom_fields
```
To:
```javascript
$("Upload Image to imgBB").first().json
```

#### 4. Updated "KIE.ai - Submit Task" Node
Changed image source from:
```javascript
$("Get a task").first().json.custom_fields[11].value[0].url_w_host
```
To:
```javascript
$("Upload Image to imgBB").first().json.product_image_url
```

## How to Import

### Option 1: Via n8n Web UI (Recommended)
1. Open n8n: https://n8n.srv1300789.hstgr.cloud
2. Go to **Workflows** tab
3. Find the existing "Product Research + Banners - webapp" workflow
4. **Delete or deactivate it** (to avoid conflicts)
5. Click **Import from File**
6. Select: `/Users/guymargi/Documents/Automations/n8n to app/workflow_web_app_ready.json`
7. Click **Activate** (toggle in top-right)

### Option 2: Via n8n CLI (if available)
```bash
n8n import:workflow --input=workflow_web_app_ready.json --separate
```

### Option 3: Via n8n API
```bash
# Get existing workflow ID
WORKFLOW_ID=$(curl -X GET 'https://n8n.srv1300789.hstgr.cloud/api/v1/workflows' \
  -H 'X-N8N-API-KEY: YOUR_API_KEY' | jq '.data[] | select(.name | contains("Product Research")) | .id')

# Delete old workflow
curl -X DELETE "https://n8n.srv1300789.hstgr.cloud/api/v1/workflows/${WORKFLOW_ID}" \
  -H 'X-N8N-API-KEY: YOUR_API_KEY'

# Import new workflow
curl -X POST 'https://n8n.srv1300789.hstgr.cloud/api/v1/workflows' \
  -H 'Content-Type: application/json' \
  -H 'X-N8N-API-KEY: YOUR_API_KEY' \
  --data @workflow_web_app_ready.json
```

## Testing the Fix

### 1. Test from Web App
```bash
cd "/Users/guymargi/Documents/Automations/n8n to app"
npm run dev
```

1. Open http://localhost:3000
2. Navigate to "Product Research + Banners"
3. Fill the form:
   - Product Name: Test Product
   - Niche: Beauty
   - Country: US
   - Language: English
   - Amazon Link: (any URL)
   - **Upload a product image** (PNG/JPG)
4. Submit and watch the progress loader
5. Verify workflow executes without "undefined" error
6. Verify banners are generated and displayed

### 2. Test via n8n Execution History
1. Open n8n workflow editor
2. Go to **Executions** tab
3. Check the most recent execution
4. Verify:
   - ✅ "Webhook Trigger" received data
   - ✅ "Upload Image to imgBB" uploaded successfully
   - ✅ "KIE.ai - Submit Task" received valid image URL
   - ✅ All 10 banners generated
   - ✅ "Respond to Webhook" returned results

### 3. Manual Webhook Test
```bash
# Create a test base64 image (1x1 red pixel)
TEST_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

# Call webhook
curl -X POST 'https://n8n.srv1300789.hstgr.cloud/webhook/ccbf1e03-2ef5-410a-8e81-03f8b1355393' \
  -H 'Content-Type: application/json' \
  -d "{
    \"product_name\": \"Test Product\",
    \"niche\": \"Beauty\",
    \"country\": \"US\",
    \"language\": \"English\",
    \"amazon_link\": \"https://amazon.com/test\",
    \"competitors_link_#1\": \"\",
    \"product_image\": \"$TEST_IMAGE\"
  }"
```

## Expected Behavior After Fix

### Before Fix (BROKEN)
```
Web App → Webhook → KIE.ai
                      ↓
                  undefined ❌
                      ↓
Error: "URL parameter must be a string, got undefined"
```

### After Fix (WORKING)
```
Web App → Webhook → Upload to imgBB → HTTP Research → Creative Summary → Splitter → KIE.ai
  (base64)           (returns URL)                                                    ↓
                                                                             Uses uploaded URL ✅
                                                                                      ↓
                                                                          10 Banners Generated
```

## Verification Checklist
- [ ] Old workflow deleted/deactivated in n8n
- [ ] New workflow imported successfully
- [ ] Workflow is **activated** (toggle ON)
- [ ] Webhook URL matches tools.json: `ccbf1e03-2ef5-410a-8e81-03f8b1355393`
- [ ] Test execution shows image upload success
- [ ] Test execution shows KIE.ai receives valid URL
- [ ] Web app receives banner results
- [ ] All 10 banners display in gallery
- [ ] Download buttons work

## Troubleshooting

### Error: "Failed to upload image to imgBB"
- Check internet connectivity from n8n instance
- Verify imgBB API key is valid: `d9766561db157236cc9151bb08020768`
- Check if base64 data is properly formatted

### Error: "Could not find product image URL"
- Verify web app is sending `product_image` field
- Check webhook data in n8n execution history
- Ensure field name is exactly `product_image`

### Error: "Webhook not found"
- Verify workflow is activated
- Check webhook ID matches: `ccbf1e03-2ef5-410a-8e81-03f8b1355393`
- Clear n8n cache and restart

### Banners not generating
- Check "Upload Image to imgBB" node output - should have `product_image_url`
- Check "KIE.ai - Submit Task" input - should use the uploaded URL
- Verify KIE.ai API key is valid

## Next Steps After Import
1. ✅ Import and activate workflow
2. ✅ Test with web app
3. ✅ Verify banner generation
4. 🔄 Monitor first few executions for errors
5. 🔄 Check Vercel logs for web app errors
6. 📊 Review n8n execution times (should be under 20 minutes)

## Files Changed
- ✅ `workflow_web_app_ready.json` - New fixed workflow
- ⚠️ Original workflow (`workflow_modified_for_import.json`) - Keep as backup
- ℹ️ `tools.json` - No changes needed (webhook URL already matches)

---

**Status:** Ready for import and testing
**Created:** 2026-01-28
**Author:** Claude Code (automated fix)
