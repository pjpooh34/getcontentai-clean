import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';

const Demo: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/demo');
        if (!res.ok) throw new Error('Failed to load demo');
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8">Loading demo…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">See What You Can Create</h1>
      <p className="text-gray-600 mt-2">This free demo shows sample outputs. To create your own content, sign up and subscribe.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.demos?.map((d: any) => (
          <div key={d.id} className="border rounded-lg p-4 bg-white">
            <h2 className="font-semibold text-gray-900">{d.title}</h2>
            <h3 className="mt-2 text-sm text-gray-700">{d.content?.title}</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">{d.content?.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded">Sign up to start creating</a>
      </div>
    </div>
  );
};

export default Demo;


