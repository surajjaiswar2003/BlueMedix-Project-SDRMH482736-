import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Utensils, ClipboardList, Activity } from 'lucide-react';

// Mock data
const stats = [
  { title: 'Total Patients', value: '24', icon: Users, change: '+2', trend: 'up' },
  { title: 'Active Plans', value: '18', icon: ClipboardList, change: '+3', trend: 'up' },
  { title: 'Total Recipes', value: '45', icon: Utensils, change: '+5', trend: 'up' },
  { title: 'Pending Approvals', value: '3', icon: Activity, change: '-1', trend: 'down' },
];

const recentPatients = [
  { name: 'John Doe', lastVisit: '2 days ago', status: 'Active' },
  { name: 'Jane Smith', lastVisit: '3 days ago', status: 'Active' },
  { name: 'Bob Wilson', lastVisit: '1 week ago', status: 'Inactive' },
];

const DietitianDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to your Dietitian Dashboard</p>
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
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Patients */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h2>
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div key={patient.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {patient.status}
                </span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Approvals */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">New Diet Plan Submission</p>
                <p className="text-sm text-gray-500">By Patient {i}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Review</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DietitianDashboard; 