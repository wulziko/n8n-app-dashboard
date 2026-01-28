#!/bin/bash

# Automated n8n Workflow Import Script
# This script imports the fixed "Product Research + Banners" workflow

set -e  # Exit on error

echo "🔧 n8n Workflow Fix - Automated Import"
echo "======================================"
echo ""

# Configuration
N8N_URL="https://n8n.srv1300789.hstgr.cloud"
WORKFLOW_FILE="workflow_web_app_ready.json"
WORKFLOW_NAME="✔️POC Stage: Product Research + Banners - KIE.AI - webapp (Web App Ready)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if workflow file exists
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${RED}❌ Error: $WORKFLOW_FILE not found!${NC}"
    echo "   Expected location: $(pwd)/$WORKFLOW_FILE"
    exit 1
fi

echo -e "${GREEN}✅ Workflow file found${NC}"
echo ""

# Step 1: Check if API key is set
echo "Step 1: Checking n8n API access..."
if [ -z "$N8N_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  N8N_API_KEY not set in environment${NC}"
    echo ""
    echo "Please set your n8n API key:"
    echo "  export N8N_API_KEY='your-api-key-here'"
    echo ""
    echo "To get your API key:"
    echo "  1. Open $N8N_URL"
    echo "  2. Go to Settings → API"
    echo "  3. Create or copy your API key"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ API key found${NC}"
echo ""

# Step 2: List existing workflows
echo "Step 2: Checking for existing workflows..."
EXISTING_WORKFLOWS=$(curl -s -X GET "$N8N_URL/api/v1/workflows" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "accept: application/json" 2>&1)

if echo "$EXISTING_WORKFLOWS" | grep -q "unauthorized"; then
    echo -e "${RED}❌ Authentication failed${NC}"
    echo "   Please check your N8N_API_KEY"
    exit 1
fi

echo -e "${GREEN}✅ Connected to n8n${NC}"

# Check if workflow with same name exists
EXISTING_ID=$(echo "$EXISTING_WORKFLOWS" | grep -o '"id":"[^"]*"' | grep -B1 "Product Research" | head -1 | cut -d'"' -f4 || echo "")

if [ -n "$EXISTING_ID" ]; then
    echo -e "${YELLOW}⚠️  Found existing workflow: $EXISTING_ID${NC}"
    echo ""
    read -p "Do you want to DELETE the old workflow and import the new one? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deleting old workflow $EXISTING_ID..."
        curl -s -X DELETE "$N8N_URL/api/v1/workflows/$EXISTING_ID" \
            -H "X-N8N-API-KEY: $N8N_API_KEY" > /dev/null
        echo -e "${GREEN}✅ Old workflow deleted${NC}"
    else
        echo -e "${YELLOW}⚠️  Keeping old workflow. The new one will be imported as a separate workflow.${NC}"
    fi
else
    echo -e "${GREEN}✅ No conflicting workflows found${NC}"
fi
echo ""

# Step 3: Import new workflow
echo "Step 3: Importing new workflow..."
IMPORT_RESPONSE=$(curl -s -X POST "$N8N_URL/api/v1/workflows" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    --data @"$WORKFLOW_FILE")

# Check if import was successful
if echo "$IMPORT_RESPONSE" | grep -q '"id"'; then
    NEW_WORKFLOW_ID=$(echo "$IMPORT_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✅ Workflow imported successfully${NC}"
    echo "   Workflow ID: $NEW_WORKFLOW_ID"
else
    echo -e "${RED}❌ Import failed${NC}"
    echo "   Response: $IMPORT_RESPONSE"
    exit 1
fi
echo ""

# Step 4: Activate workflow
echo "Step 4: Activating workflow..."
ACTIVATE_RESPONSE=$(curl -s -X PATCH "$N8N_URL/api/v1/workflows/$NEW_WORKFLOW_ID" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"active": true}')

if echo "$ACTIVATE_RESPONSE" | grep -q '"active":true'; then
    echo -e "${GREEN}✅ Workflow activated${NC}"
else
    echo -e "${YELLOW}⚠️  Activation may have failed, please check manually${NC}"
fi
echo ""

# Step 5: Verify webhook URL
echo "Step 5: Verifying webhook configuration..."
WEBHOOK_PATH=$(cat "$WORKFLOW_FILE" | grep '"path"' | head -1 | cut -d'"' -f4)
WEBHOOK_URL="$N8N_URL/webhook/$WEBHOOK_PATH"
echo "   Webhook URL: $WEBHOOK_URL"

# Check if it matches tools.json
TOOLS_WEBHOOK=$(cat src/config/tools.json | grep "webhookUrl" | cut -d'"' -f4)
if [ "$WEBHOOK_URL" = "$TOOLS_WEBHOOK" ]; then
    echo -e "${GREEN}✅ Webhook URL matches tools.json${NC}"
else
    echo -e "${YELLOW}⚠️  Webhook URL mismatch:${NC}"
    echo "   tools.json: $TOOLS_WEBHOOK"
    echo "   Workflow:   $WEBHOOK_URL"
    echo ""
    echo "   Update tools.json to use: $WEBHOOK_URL"
fi
echo ""

# Success summary
echo "======================================"
echo -e "${GREEN}🎉 Workflow import complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test the workflow:"
echo "   npm run dev"
echo "   Open http://localhost:3000"
echo "   Navigate to 'Product Research + Banners'"
echo ""
echo "2. Check execution history in n8n:"
echo "   $N8N_URL/workflow/$NEW_WORKFLOW_ID"
echo ""
echo "3. Monitor for any errors in the first few runs"
echo ""
echo "Workflow URL: $N8N_URL/workflow/$NEW_WORKFLOW_ID"
echo "Webhook URL:  $WEBHOOK_URL"
echo "======================================"
