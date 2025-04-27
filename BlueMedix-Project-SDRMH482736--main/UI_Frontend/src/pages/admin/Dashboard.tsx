import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Database, TrendingUp, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Define interfaces for your data types
interface StatItem {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  trend: "up" | "down";
}

interface AdminData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  adminLevel: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Recipes",
      value: "432",
      icon: Database,
      change: "+15%",
      trend: "up",
    },
    {
      title: "Model Accuracy",
      value: "87%",
      icon: TrendingUp,
      change: "+3%",
      trend: "up",
    },
    {
      title: "Pending Approvals",
      value: "18",
      icon: FileText,
      change: "+5",
      trend: "up",
    },
  ]);

  // Check for admin authentication
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminDataStr = localStorage.getItem("admin");

      if (!adminDataStr) {
        // No admin data found, redirect to login
        navigate("/admin/login");
        return;
      }

      try {
        const admin = JSON.parse(adminDataStr);
        if (!admin || admin.role !== "admin") {
          // Invalid admin data, redirect to login
          localStorage.removeItem("admin");
          navigate("/admin/login");
          return;
        }

        // Valid admin, set the data
        setAdminData(admin);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing admin data:", error);
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    };

    checkAdminAuth();
  }, [navigate]);

  // Rest of your dashboard component code...
  // (Keep your existing dashboard UI code)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          {adminData && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {adminData.firstName}!
              </h1>
              <p className="text-gray-500">Here's your system overview</p>
            </div>
          )}

          {/* Your existing dashboard UI code */}
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
                          {stat.value}
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
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        from last month
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Rest of your dashboard content */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
