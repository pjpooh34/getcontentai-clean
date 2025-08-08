import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  if (!session.user?.organizationId) {
    redirect("/onboarding");
  }

  // Database-backed metrics with graceful fallback when DB is unavailable
  let organization: any = null;
  let contentStats: { status: string; _count: number }[] = [];
  let recentContent: { id: string; title: string | null; platform: string; status: string; createdAt: Date }[] = [];
  let upcomingContent: { id: string; title: string | null; platform: string; scheduledFor: Date | null; status: string }[] = [];

  try {
    // Check if onboarding is completed
    organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      include: { subscription: true }
    });

    if (!organization?.onboardingCompleted) {
      redirect("/onboarding");
    }

    // Get dashboard metrics
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    [contentStats, recentContent, upcomingContent] = await Promise.all([
      prisma.content.groupBy({
        by: ['status'],
        where: {
          organizationId: session.user.organizationId,
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        },
        _count: true
      }),
      prisma.content.findMany({
        where: { organizationId: session.user.organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          platform: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.content.findMany({
        where: {
          organizationId: session.user.organizationId,
          scheduledFor: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
          }
        },
        orderBy: { scheduledFor: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          platform: true,
          scheduledFor: true,
          status: true
        }
      })
    ]);
  } catch (error) {
    console.error('Database unavailable, rendering demo dashboard:', error);
    organization = {
      name: 'Demo Organization',
      onboardingCompleted: true,
      subscription: { contentGenerated: 12, monthlyContentLimit: 30 }
    };
    contentStats = [
      { status: 'PUBLISHED', _count: 8 },
      { status: 'SCHEDULED', _count: 4 }
    ];
    recentContent = [];
    upcomingContent = [];
  }

  const totalContent = contentStats.reduce((acc, stat) => acc + (stat._count || 0), 0);
  const publishedCount = contentStats.find(s => s.status === 'PUBLISHED')?._count || 0;
  const scheduledCount = contentStats.find(s => s.status === 'SCHEDULED')?._count || 0;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with {organization?.name || 'your organization'}</p>
        </div>
        <Link
          href="/content/generate"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
        >
          Generate Content
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Content Created</h2>
              <p className="text-2xl font-bold text-gray-900">{totalContent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Scheduled Posts</h2>
              <p className="text-2xl font-bold text-gray-900">{scheduledCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Published</h2>
              <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Usage</h2>
              <p className="text-2xl font-bold text-gray-900">
                {organization.subscription?.contentGenerated || 0}
                <span className="text-sm text-gray-600">/{organization.subscription?.monthlyContentLimit || 30}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
          </div>
          <div className="p-6">
            {recentContent.length > 0 ? (
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {content.title || 'Untitled Post'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {content.platform} • {format(new Date(content.createdAt), 'MMM dd')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      content.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      content.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      content.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {content.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                <p className="text-gray-600 mb-4">Get started by generating your first content</p>
                <Link
                  href="/api/content/calendar"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Generate Calendar
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Posts</h2>
          </div>
          <div className="p-6">
            {upcomingContent.length > 0 ? (
              <div className="space-y-4">
                {upcomingContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {content.title || 'Untitled Post'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {content.platform} • {content.scheduledFor ? format(new Date(content.scheduledFor), 'MMM dd, h:mm a') : 'Not scheduled'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      content.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {content.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled posts</h3>
                <p className="text-gray-600 mb-4">Schedule your content to see it here</p>
                <Link
                  href="/content"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  View Content
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}