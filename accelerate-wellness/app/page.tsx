import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI-powered for wellness brands
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 text-balance">
            Accelerate your wellness brand with effortless content automation
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Plan, generate, and schedule high-performing content across platforms. Integrations for Stripe, Buffer, and Twilio built-in.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-white font-medium shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
            >
              Get started
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.25 8.25h-8.5v-1.5h10v10h-1.5v-8.5ZM6 18h8v1.5H4.5V9H6v9Z"/></svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-3 text-gray-800 font-medium hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              icon: "🤖",
              title: "AI Content Generation",
              desc: "High-quality, on-brand posts tailored to your audience"
            }, {
              icon: "📅",
              title: "Smart Content Calendar",
              desc: "Plan 30 days in minutes and publish automatically"
            }, {
              icon: "⭐",
              title: "Review Automation",
              desc: "Boost ratings with SMS and email review flows"
            }].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 text-left shadow border border-white/40">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}