import React, { useState } from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';

type PlanKey = 'DIY' | 'CORE' | 'PRO';

const PLANS: Record<PlanKey, { name: string; price: number; features: string[]; popular?: boolean }>
  = {
    DIY: { name: 'DIY', price: 150, features: [
      '30 AI-generated posts / month',
      'Basic social scheduling',
      '50 review requests / month',
      'Email support',
      'Basic analytics',
    ]},
    CORE: { name: 'Core', price: 250, popular: true, features: [
      '100 AI-generated posts / month',
      'Advanced scheduling',
      '200 review requests / month',
      'SMS & email automation',
      'Multi-platform publishing',
      'Priority support',
      'Advanced analytics',
    ]},
    PRO: { name: 'Pro', price: 400, features: [
      'Unlimited AI-generated posts',
      'Advanced scheduling',
      'Unlimited review requests',
      'All platform publishing',
      'White-label options',
      'Priority support',
      'Advanced analytics & reporting',
      'API access',
    ]},
};

const Pricing: React.FC = () => {
  const [busy, setBusy] = useState<PlanKey | null>(null);

  const startCheckout = async (plan: PlanKey) => {
    try {
      setBusy(plan);
      const res = await fetch(`${(import.meta as any).env?.VITE_API_URL || ''}/api/subscription/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json?.url) {
        window.location.href = json.url;
      } else {
        setBusy(null);
      }
    } catch (e) {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-grid" />
      <div className="relative p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Power your brand with AI-driven content, automated reviews, and seamless scheduling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {Object.entries(PLANS).map(([key, plan]) => {
              const k = key as PlanKey;
              return (
                <div key={key} className={`relative bg-white rounded-2xl border ${plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200 shadow'} p-6 hover:shadow-xl transition-shadow`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                        <Star className="w-3 h-3 mr-1" /> Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <div className="mt-3 text-4xl font-bold text-gray-900">${plan.price}<span className="text-lg text-gray-600 font-normal">/mo</span></div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button onClick={() => startCheckout(k)} disabled={busy === k}
                      className={`w-full inline-flex items-center justify-center rounded-xl ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50'} px-6 py-3 font-medium transition-colors`}>
                      {busy === k ? 'Processing...' : (<><span>Get Started</span><ArrowRight className="w-4 h-4 ml-2" /></>)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-6">Features</th>
                    <th className="text-center py-4 px-6">DIY</th>
                    <th className="text-center py-4 px-6">Core</th>
                    <th className="text-center py-4 px-6">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-medium">Monthly Content Generation</td>
                    <td className="text-center py-4 px-6">30 posts</td>
                    <td className="text-center py-4 px-6">100 posts</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-medium">Review Requests</td>
                    <td className="text-center py-4 px-6">50/month</td>
                    <td className="text-center py-4 px-6">200/month</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-medium">Team Members</td>
                    <td className="text-center py-4 px-6">1 user</td>
                    <td className="text-center py-4 px-6">3 users</td>
                    <td className="text-center py-4 px-6">10 users</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-medium">Social Platforms</td>
                    <td className="text-center py-4 px-6">2 platforms</td>
                    <td className="text-center py-4 px-6">4 platforms</td>
                    <td className="text-center py-4 px-6">All platforms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;