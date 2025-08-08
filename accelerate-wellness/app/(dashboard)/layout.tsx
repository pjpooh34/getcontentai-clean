import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-lg font-semibold">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">🌿</span>
                Accelerate
              </Link>
              <div className="hidden md:flex items-center gap-6">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/content", label: "Content" },
                  { href: "/settings/integrations", label: "Integrations" },
                  { href: "/settings/billing", label: "Billing" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-600">{session.user?.email}</span>
              <a href="/api/auth/signout" className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                Sign out
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}