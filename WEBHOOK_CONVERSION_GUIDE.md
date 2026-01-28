# Converting n8n Workflows to Webhook-Based Versions

## Overview

Your "webapp" workflows currently use **ClickUp Triggers** (automatic). To use them in the web app, we need to create **webhook-based versions** that accept manual input.

---

## Workflow 1: Product Research + Banners - KIE.AI

### Current Setup (ClickUp-triggered)
- **Trigger:** ClickUp status change to "ai research"
- **Process:** Runs AI research, generates banners, posts to ClickUp
- **Output:** Updates task in ClickUp

### New Webhook Version (Manual)

#### Step 1: Create New Workflow in n8n
1. Open n8n: https://n8n.srv1300789.hstgr.cloud
2. Click **"New Workflow"**
3. Name it: **"Product Research + Banners - Manual (Web App)"**

#### Step 2: Add Form Trigger Node
1. Click **"+"** to add node
2. Search for **"Webhook"** or **"Form Trigger"**
3. Select **"Form Trigger"** (recommended for easier forms)
4. Configure the form fields:

**Suggested Fields:**
```
Field 1: Product/Topic
- Label: "Product or Topic to Research"
- Type: Text
- Placeholder: "e.g., AI writing tools"
- Required: Yes

Field 2: Research Focus
- Label: "Research Focus Areas"
- Type: Textarea
- Placeholder: "What aspects should we research? (competitors, pricing, features, etc.)"
- Required: No

Field 3: Banner Type
- Label: "Banner Type Needed"
- Type: Dropdown
- Options:
  - "Social Media (1080x1080)"
  - "Facebook Ad (1200x628)"
  - "LinkedIn Post (1200x627)"
  - "Twitter/X Header (1500x500)"
  - "Instagram Story (1080x1920)"
- Required: Yes

Field 4: Target Audience
- Label: "Target Audience"
- Type: Text
- Placeholder: "e.g., Marketing professionals, SaaS founders"
- Required: No
```

5. **Important:** Copy the **Production URL** that appears
   - Example: `https://n8n.srv1300789.hstgr.cloud/webhook/abc123`
   - You'll need this for tools.json!

#### Step 3: Add Your Existing Logic
1. Copy the core logic nodes from your existing workflow:
   - AI Research nodes
   - Banner generation nodes
   - Any processing/formatting nodes

2. Connect them after the Form Trigger
3. Adjust any ClickUp-specific data references to use form data:
   - Change: `{{ $('ClickUp Trigger').item.json.task.name }}`
   - To: `{{ $('Form Trigger').item.json.product_topic }}`

#### Step 4: Add "Respond to Webhook" Node
1. Add **"Respond to Webhook"** node at the end
2. Set **Response Mode** to "Using Respond to Webhook node"
3. Configure response:
   - **Status Code:** 200
   - **Response Body:**
   ```json
   {
     "success": true,
     "message": "Research and banners completed!",
     "research_summary": "{{ $('AI Research Node').item.json.summary }}",
     "banner_url": "{{ $('Banner Generation').item.json.url }}",
     "timestamp": "{{ new Date().toISOString() }}"
   }
   ```

#### Step 5: Test & Activate
1. Click **"Test workflow"** button
2. Fill in the form that appears
3. Verify the response looks correct
4. Click **"Activate"** to enable the workflow
5. **Copy the webhook URL** from the Form Trigger node

---

## Workflow 2: Winning Ads Generation & Analysis

### Current Setup (ClickUp-triggered)
- **Trigger:** ClickUp status change to "to analyze"
- **Process:** Analyzes ads, generates creative summaries
- **Output:** Updates task with analysis

### New Webhook Version (Manual)

#### Step 1: Create New Workflow
1. New workflow in n8n
2. Name: **"Winning Ads Analysis - Manual (Web App)"**

#### Step 2: Add Form Trigger
Configure these fields:

**Suggested Fields:**
```
Field 1: Ad URL or Description
- Label: "Ad URL or Description"
- Type: Textarea
- Placeholder: "Paste the ad URL or describe the ad creative"
- Required: Yes

Field 2: Platform
- Label: "Ad Platform"
- Type: Dropdown
- Options:
  - "Facebook/Instagram"
  - "Google Ads"
  - "TikTok"
  - "LinkedIn"
  - "Twitter/X"
- Required: Yes

Field 3: Analysis Type
- Label: "What to Analyze"
- Type: Dropdown
- Options:
  - "Creative (visual, copy, hooks)"
  - "Performance (engagement, conversion potential)"
  - "Audience targeting"
  - "Full analysis (all of the above)"
- Required: Yes

Field 4: Ad Image (Optional)
- Label: "Ad Screenshot URL"
- Type: Text
- Placeholder: "URL to ad screenshot (if available)"
- Required: No
```

**Copy the Production URL!**

#### Step 3: Add Analysis Logic
1. Copy AI analysis nodes from existing workflow
2. Connect after Form Trigger
3. Adjust data references from ClickUp to form fields

#### Step 4: Add "Respond to Webhook" Node
Configure response:
```json
{
  "success": true,
  "message": "Ad analysis completed!",
  "analysis": {
    "creative_score": "{{ $('Analysis').item.json.creative_score }}",
    "key_insights": "{{ $('Analysis').item.json.insights }}",
    "recommendations": "{{ $('Analysis').item.json.recommendations }}",
    "winning_elements": "{{ $('Analysis').item.json.winning_elements }}"
  },
  "timestamp": "{{ new Date().toISOString() }}"
}
```

#### Step 5: Test & Activate
1. Test with sample ad
2. Verify response format
3. Activate workflow
4. **Copy webhook URL**

---

## Simplified "Test" Version (Recommended First Step)

If the above seems complex, start with a **simple test workflow**:

### Create: "Test Workflow - Web App"

#### Nodes:
1. **Form Trigger:**
   - Field 1: Name (text, required)
   - Field 2: Message (textarea, required)

2. **Code Node:** (optional - just to show processing)
   ```javascript
   return [{
     json: {
       greeting: `Hello ${items[0].json.name}!`,
       echo: items[0].json.message,
       processed_at: new Date().toISOString()
     }
   }];
   ```

3. **Respond to Webhook:**
   ```json
   {
     "success": true,
     "greeting": "{{ $json.greeting }}",
     "your_message": "{{ $json.echo }}",
     "processed_at": "{{ $json.processed_at }}"
   }
   ```

**Test this first** to ensure the web app integration works before converting the complex workflows!

---

## After Creating Webhook Workflows

Once you've created the webhook versions:

1. **Activate** each workflow in n8n
2. **Copy** the webhook URLs
3. **Test** them directly in n8n first
4. **Share** the webhook URLs with me
5. I'll add them to `tools.json` in the web app
6. We'll test them in the deployed web app

---

## Troubleshooting

### Webhook not responding
- Ensure workflow is **Active** (toggle in top right)
- Check **Respond to Webhook** node is connected
- Verify **Production URL** is used (not test URL)

### Form not appearing
- Form Trigger must be the **first node**
- Workflow must be **saved** and **activated**

### Data not flowing
- Check node connections (arrows between nodes)
- Use **"Execute Workflow"** button to test
- Check error messages in node execution logs

---

## Next Steps

Which approach do you want to take?

**Option A:** Create simple test workflow first (5 minutes)
**Option B:** Convert "Product Research + Banners" workflow (15-20 minutes)
**Option C:** Convert "Winning Ads Analysis" workflow (15-20 minutes)
**Option D:** I can create JSON workflow templates you can import into n8n

Let me know which workflow you want to start with, and I'll provide more detailed guidance!
