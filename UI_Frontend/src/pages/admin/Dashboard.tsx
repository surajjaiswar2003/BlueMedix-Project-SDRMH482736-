import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Utensils, ClipboardList, TrendingUp } from 'lucide-react';

// Mock data
const stats = [
  { title: 'Total Users', value: '1,234', icon: Users, change: '+12%', trend: 'up' },
  { title: 'Active Plans', value: '856', icon: ClipboardList, change: '+8%', trend: 'up' },
  { title: 'Total Recipes', value: '432', icon: Utensils, change: '+15%', trend: 'up' },
  { title: 'Adherence Rate', value: '78%', icon: TrendingUp, change: '+5%', trend: 'up' },
];

const popularRecipes = [
  { name: 'Keto Breakfast Bowl', views: 1234, category: 'Keto' },
  { name: 'Vegan Buddha Bowl', views: 987, category: 'Vegan' },
  { name: 'Protein Power Smoothie', views: 876, category: 'High-Protein' },
  { name: 'Mediterranean Salad', views: 765, category: 'Mediterranean' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to the Diet Planner Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Popular Recipes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Recipes</h2>
        <div className="space-y-4">
          {popularRecipes.map((recipe) => (
            <div key={recipe.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-500">{recipe.category}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{recipe.views.toLocaleString()} views</p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent User Signups</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-medium text-gray-900">User {i}</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">New Recipe Submission</p>
                  <p className="text-sm text-gray-500">By Dietitian {i}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 