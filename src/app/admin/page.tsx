import { getAllClients } from '@/config/clientConfig';

export default function AdminPage() {
  const clients = getAllClients();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Chatbot Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your multi-tenant AI chatbot clients</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600">{clients.length}</div>
            <div className="text-gray-600 mt-1">Active Clients</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-green-600">Live</div>
            <div className="text-gray-600 mt-1">System Status</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-blue-600">GPT-4o mini</div>
            <div className="text-gray-600 mt-1">AI Model</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Configurations</h2>

        <div className="space-y-6">
          {clients.map((client) => (
            <div key={client.clientId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: client.primaryColor }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.businessName}</h3>
                    <p className="text-sm text-gray-500">{client.industry} Â· ID: {client.clientId}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`/demo/${client.clientId}`}
                    target="_blank"
                    className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Live Demo â
                  </a>
                </div>
              </div>

              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Services ({client.services.length})</h4>
                  <ul className="space-y-1">
                    {client.services.map((service, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        â¢ {service.name} {service.price && <span className="text-gray-400">({service.price})</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Buying Intent Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {client.buyingIntentKeywords.slice(0, 8).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">
                        {kw}
                      </span>
                    ))}
                    {client.buyingIntentKeywords.length > 8 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                        +{client.buyingIntentKeywords.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Embed Code</h4>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                  {`<script src="${appUrl}/widget/${client.clientId}" async></script>`}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add this script tag to any webpage to embed the chatbot widget.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">API Endpoints</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-blue-800">
              <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded text-xs mr-2">POST</span>
              {appUrl}/api/chat
            </div>
            <div className="text-blue-800">
              <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded text-xs mr-2">POST</span>
              {appUrl}/api/leads
            </div>
            <div className="text-blue-800">
              <span className="bg-green-200 text-green-900 px-2 py-0.5 rounded text-xs mr-2">GET</span>
              {appUrl}/api/leads?clientId=&#123;id&#125;
            </div>
            <div className="text-blue-800">
              <span className="bg-green-200 text-green-900 px-2 py-0.5 rounded text-xs mr-2">GET</span>
              {appUrl}/widget/&#123{clientId&#125;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
