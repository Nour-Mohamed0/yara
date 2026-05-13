import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, BookOpen, Image, Users } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Admin',
  description: 'Admin dashboard overview',
};

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

const stats: StatCard[] = [
  {
    title: 'Blog Posts',
    value: '12',
    description: 'Published articles',
    icon: <FileText className="h-4 w-4" />,
    trend: '+2 this month',
  },
  {
    title: 'Courses',
    value: '5',
    description: 'Active courses',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: 'Gallery Images',
    value: '48',
    description: 'In collection',
    icon: <Image className="h-4 w-4" />,
  },
  {
    title: 'Total Views',
    value: '2.4K',
    description: 'This month',
    icon: <BarChart3 className="h-4 w-4" />,
    trend: '+12%',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              {stat.trend && (
                <p className="text-xs text-green-600 mt-2">{stat.trend}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Activity item {i + 1}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
