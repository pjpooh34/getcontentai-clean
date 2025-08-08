import React, { useEffect, useState } from 'react';

type ScheduledItem = {
  id: string;
  title?: string;
  body: string;
  platform: string;
  scheduledAt: string;
  status: 'scheduled' | 'posted' | 'canceled';
};

const CalendarPage: React.FC = () => {
  const [items, setItems] = useState<ScheduledItem[]>([]);
  const [form, setForm] = useState({ body: '', title: '', platform: 'instagram', scheduledAt: '' });
  const [error, setError] = useState<string | null>(null);

  const apiBase = (import.meta as any).env?.VITE_API_URL || '';

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/schedule`);
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) { setError(e.message); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to schedule');
      await load();
      setForm({ body: '', title: '', platform: 'instagram', scheduledAt: '' });
    } catch (e: any) { setError(e.message); }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${apiBase}/api/schedule/${id}`, { method: 'DELETE' });
      await load();
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Content Calendar</h1>
      <p className="text-gray-600 mt-1">Schedule posts for your platforms. This is a basic in-app scheduler scaffold.</p>

      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="border rounded p-2" placeholder="Title (optional)" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
        <input className="border rounded p-2" placeholder="Body" required value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))} />
        <select className="border rounded p-2" value={form.platform} onChange={e => setForm(f => ({...f, platform: e.target.value}))}>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">X (Twitter)</option>
          <option value="facebook">Facebook</option>
        </select>
        <input className="border rounded p-2" type="datetime-local" required value={form.scheduledAt} onChange={e => setForm(f => ({...f, scheduledAt: e.target.value}))} />
        <button className="md:col-span-4 bg-blue-600 text-white rounded p-2">Add to Calendar</button>
      </form>

      {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}

      <div className="mt-6 bg-white border rounded">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">When</th>
              <th className="p-3">Platform</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-b">
                <td className="p-3">{new Date(it.scheduledAt).toLocaleString()}</td>
                <td className="p-3">{it.platform}</td>
                <td className="p-3">{it.title || it.body.slice(0,40)}</td>
                <td className="p-3">{it.status}</td>
                <td className="p-3 text-right"><button onClick={() => remove(it.id)} className="text-red-600">Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarPage;


