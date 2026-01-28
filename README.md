# n8n App Dashboard

A simple, beautiful web interface for manually triggering your n8n workflows.

## Features

- ✅ Clean, modern UI for running n8n workflows
- ✅ Auto-generated forms from JSON configuration
- ✅ Real-time webhook execution
- ✅ JSON response display
- ✅ Zero database required
- ✅ Easy to deploy

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```bash
APP_PASSWORD=your-secure-password
```

### 3. Add Your Workflows

Edit `src/config/tools.json` and add your n8n workflows:

```json
{
  "tools": [
    {
      "id": "my-tool",
      "name": "My Tool",
      "description": "Description here",
      "icon": "Wrench",
      "webhookUrl": "https://your-n8n-instance.com/webhook/your-workflow",
      "inputs": [
        {
          "name": "message",
          "label": "Message",
          "type": "text",
          "required": true
        }
      ]
    }
  ]
}
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

Click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

Or manually:

1. Push to GitHub
2. Import project in Vercel
3. Add `APP_PASSWORD` environment variable
4. Deploy

## Documentation

See [CLAUDE.md](./CLAUDE.md) for full documentation.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

## License

MIT
