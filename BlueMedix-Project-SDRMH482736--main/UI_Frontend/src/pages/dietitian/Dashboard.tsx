// pages/dietitian/Dashboard.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Clipboard, MessageSquare, Activity } from "lucide-react";
import axios from "axios";

interface StatItem {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  trend: "up" | "down";
}

interface Patient {
  name: string;
  lastVisit: string;
  status: "Active" | "Inactive";
}

interface PendingReview {
  id: number;
  patientName: string;
  planType: string;
  submittedDate: string;
}

const DietitianDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "Assigned Patients",
      value: "24",
      icon: Users,
      change: "+2",
      trend: "up",
    },
    {
      title: "Pending Reviews",
      value: "7",
      icon: Clipboard,
      change: "+3",
      trend: "up",
    },
    {
      title: "New Messages",
      value: "12",
      icon: MessageSquare,
      change: "+5",
      trend: "up",
    },
    {
      title: "Plans Approved",
      value: "18",
      icon: Activity,
      change: "+4",
      trend: "up",
    },
  ]);

  const [recentPatients, setRecentPatients] = useState<Patient[]>([
    { name: "John Doe", lastVisit: "2 days ago", status: "Active" },
    { name: "Jane Smith", lastVisit: "3 days ago", status: "Active" },
    { name: "Bob Wilson", lastVisit: "1 week ago", status: "Inactive" },
  ]);

  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([
    {
      id: 1,
      patientName: "John Doe",
      planType: "Weight Loss",
      submittedDate: "Yesterday",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      planType: "Muscle Gain",
      submittedDate: "2 days ago",
    },
    {
      id: 3,
      patientName: "Bob Wilson",
      planType: "Maintenance",
      submittedDate: "3 days ago",
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // In a real app, you would fetch from your API:
    // const fetchDashboardData = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/api/dietitian/dashboard');
    //     setStats(response.data.stats);
    //     setRecentPatients(response.data.recentPatients);
    //     setPendingReviews(response.data.pendingReviews);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchDashboardData();
  }, []);

  return (
    <DashboardLayout requiredRole="dietitian">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {isLoading ? (
                        <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last week
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Patients */}
        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Patients
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last visit: {patient.lastVisit}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Reviews */}
        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Diet Plan Reviews
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {review.patientName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.planType} Plan • Submitted {review.submittedDate}
                    </p>
                  </div>
                  <Button size="sm">Review Plan</Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View All Pending Reviews
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DietitianDashboard;
