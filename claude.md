# Unified n8n App Dashboard

## What This Is
A simple web portal for **manually triggering** your n8n workflows. Instead of waiting for ClickUp triggers or using the n8n interface, you log into this app and run workflows on-demand through custom forms.

**Important:** This app is for MANUAL triggers only. Your automatic ClickUp-triggered workflows continue to work as they do today. This gives you a nice UI for running workflows whenever you need them.

## How It Works
1. You have n8n workflows with Webhook Triggers
2. This app displays a form for each tool
3. User fills form → data sent to n8n webhook → result displayed
4. That's it!

## Project Structure
```
/n8n-app/
├── src/
│   ├── app/              # Pages
│   │   ├── page.tsx      # Dashboard (tool cards)
│   │   ├── tools/[id]/   # Individual tool page
│   │   └── api/          # API routes
│   ├── components/       # UI components
│   ├── lib/             # Utilities
│   └── config/          # Tool configuration
│       └── tools.json   # ⭐ Main config file
├── .env.local           # Secrets (password, etc.)
└── package.json
```

## Tech Stack
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **Vercel** - Hosting

## Deciding Which Workflows to Add

**Add to web app if:**
- You want to trigger it manually/on-demand
- You need a nice form interface instead of webhook testing tools
- You want non-technical users to access it
- Example: Banner generator, landing page creator, report generator

**Keep ClickUp-only if:**
- It should run automatically based on task status
- You never need to trigger it manually
- Example: Daily sync jobs, automated reports, scheduled tasks

## Adding a New Tool

1. **Ensure n8n workflow is App-Ready:**
   - Has Webhook Trigger node (Production URL)
   - Has Respond to Webhook node (returns JSON)

2. **Add to `src/config/tools.json`:**
   ```json
   {
     "id": "banner-generator",
     "name": "Banner Generator",
     "description": "Create marketing banners",
     "icon": "Image",
     "webhookUrl": "https://n8n.srv1300789.hstgr.cloud/webhook/banner-gen",
     "inputs": [
       {
         "name": "headline",
         "label": "Headline Text",
         "type": "text",
         "required": true
       },
       {
         "name": "color",
         "label": "Primary Color",
         "type": "select",
         "options": ["blue", "red", "green"]
       }
     ]
   }
   ```

3. **Refresh the app** - new tool appears automatically!

## Development

```bash
# Install
npm install

# Run locally
npm run dev

# Deploy
git push origin main  # Auto-deploys to Vercel
```

## Environment Variables

```bash
# .env.local
APP_PASSWORD=your-password-here
```

## Available Icons

You can use any icon from [Lucide React](https://lucide.dev/icons/). Common ones:
- `Image` - Banner/image generation
- `FileText` - Document generation
- `Video` - Video creation
- `BarChart` - Analytics/reports
- `Mail` - Email tools
- `Wrench` - General tools
- `Zap` - Automation
- `Globe` - Web/internet tools

## Input Field Types

- `text` - Single line text input
- `textarea` - Multi-line text input
- `select` - Dropdown selection
- `number` - Numeric input
- `email` - Email input

## Common Tasks

**Add a tool:** Edit `src/config/tools.json`
**Update UI:** Modify components in `src/components/`
**Deploy:** Push to GitHub, Vercel auto-deploys

## Troubleshooting

### Webhook not working
1. Check webhook URL is correct in `tools.json`
2. Ensure n8n workflow has "Respond to Webhook" node
3. Check n8n workflow is active
4. Test webhook directly in n8n first

### Tool not appearing
1. Check `tools.json` syntax is valid JSON
2. Ensure all required fields are present (id, name, description, icon, webhookUrl, inputs)
3. Refresh the page

### Form validation errors
1. Ensure `required` fields are filled
2. Check input types match (number vs text, etc.)

---
Last Updated: 2026-01-28
