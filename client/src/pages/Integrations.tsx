import React, { useEffect, useState } from 'react';

const Integrations: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const base = (import.meta as any).env?.VITE_API_URL || '';
        const res = await fetch(`${base}/api/integrations/providers`);
        const json = await res.json();
        setProviders(json.providers || []);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Social Integrations</h1>
      <p className="text-gray-600 mt-2">Connect your social accounts to post content directly from GetContentAI.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 bg-white">
            <h2 className="font-semibold text-gray-900">{p.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Status: {p.connected ? 'Connected' : 'Not connected'}</p>
            <div className="mt-3">
              <a
                href={`$${(import.meta as any).env?.VITE_API_URL || ''}/api/integrations/connect/${p.id}`}
                className="px-3 py-2 text-sm rounded bg-blue-600 text-white"
              >
                {p.connected ? 'Manage' : 'Connect'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;



