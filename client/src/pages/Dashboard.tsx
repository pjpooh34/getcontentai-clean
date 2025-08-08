import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  PenTool
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Content Generated',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Total Reach',
      value: '2.4M',
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Avg. Engagement',
      value: '4.2%',
      change: '-2%',
      changeType: 'negative',
      icon: BarChart3,
    },
    {
      name: 'Time Saved',
      value: '24h',
      change: '+15%',
      changeType: 'positive',
      icon: Clock,
    },
  ];

  const recentContent = [
    {
      id: '1',
      title: 'Product Launch Post',
      platform: 'Instagram',
      status: 'published',
      engagement: '2.4k',
      date: '2 hours ago',
    },
    {
      id: '2',
      title: 'Thought Leadership Article',
      platform: 'LinkedIn',
      status: 'draft',
      engagement: '0',
      date: '1 day ago',
    },
    {
      id: '3',
      title: 'Weekly Newsletter',
      platform: 'Email',
      status: 'published',
      engagement: '1.2k',
      date: '3 days ago',
    },
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Create Q4 content calendar',
      dueDate: 'Tomorrow',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Review analytics report',
      dueDate: 'Friday',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Update brand guidelines',
      dueDate: 'Next week',
      priority: 'low',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your content today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{content.title}</h3>
                    <p className="text-xs text-gray-500">{content.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        content.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {content.status}
                    </span>
                    <span className="text-sm text-gray-600">{content.engagement}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{content.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Add task
            </button>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-500">{task.dueDate}</p>
                  </div>
                </div>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <PenTool className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Generate Content</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">View Analytics</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Browse Templates</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Target className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Set Goals</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 