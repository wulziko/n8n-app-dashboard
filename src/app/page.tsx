import toolsConfig from '@/config/tools.json';
import { ToolCard } from '@/components/ToolCard';
import { Tool } from '@/types/tool';

export default function Dashboard() {
  const tools = toolsConfig.tools as Tool[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            n8n App Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Run your automation workflows with ease
          </p>
        </div>

        {/* Tools Grid */}
        {tools.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">
              No tools configured yet. Add your first tool to{' '}
              <code className="bg-slate-200 px-2 py-1 rounded">
                src/config/tools.json
              </code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-slate-500">
          <p>
            Powered by{' '}
            <a
              href="https://n8n.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              n8n
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
