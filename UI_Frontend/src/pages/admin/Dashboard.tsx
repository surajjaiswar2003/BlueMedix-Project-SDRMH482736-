import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  UserCheck,
  UserPlus,
  FileText,
  Database,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Metrics {
  accuracy?: number;
}

interface AdminData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  adminLevel: string;
  role: string;
}

interface RecentPatient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLogDate: string;
}

interface UserGrowth {
  date: string;
  count: number;
}

interface DietPlanStats {
  status: string;
  count: number;
}

interface UserActivityStats {
  category: string;
  count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [numUsers, setNumUsers] = useState<number>(0);
  const [numDietitians, setNumDietitians] = useState<number>(0);
  const [numNewUsers, setNumNewUsers] = useState<number>(0);
  const [numApprovedPlans, setNumApprovedPlans] = useState<number>(0);
  const [numActiveUsers, setNumActiveUsers] = useState<number>(0);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [dietPlanStats, setDietPlanStats] = useState<DietPlanStats[]>([]);
  const [userActivityStats, setUserActivityStats] = useState<UserActivityStats[]>([]);

  // Admin authentication
  useEffect(() => {
    const adminDataStr = localStorage.getItem("admin");
    if (!adminDataStr) {
      navigate("/admin/login");
      return;
    }
    try {
      const admin: AdminData = JSON.parse(adminDataStr);
      if (!admin || admin.role !== "admin") {
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }
      setAdminData(admin);
      setIsLoading(false);
    } catch (error) {
      localStorage.removeItem("admin");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch all stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          usersRes,
          dietRes,
          metricsRes,
          newUsersRes,
          plansRes,
          activeRes,
          recentPatientsRes,
          userGrowthRes,
          dietPlanStatsRes,
          userActivityRes,
        ] = await Promise.all([
          axios.get("/api/users/count"),
          axios.get("/api/dietitians/count"),
          axios.get("/api/ml/metrics"),
          axios.get("/api/users/new-this-month"),
          axios.get("/api/diet-plans/count", {
            params: { status: "approved" },
          }),
          axios.get("/api/users/active-this-week"),
          axios.get("/api/health-logs/recent-patients"),
          axios.get("/api/users/growth"),
          axios.get("/api/diet-plans/stats"),
          axios.get("/api/users/activity-stats"),
        ]);
        setNumUsers(usersRes.data.count || 0);
        setNumDietitians(dietRes.data.count || 0);
        setMetrics(
          metricsRes.data.accuracy !== undefined
            ? { accuracy: metricsRes.data.accuracy }
            : null
        );
        setNumNewUsers(newUsersRes.data.count || 0);
        setNumApprovedPlans(plansRes.data.count || 0);
        setNumActiveUsers(activeRes.data.count || 0);
        setRecentPatients(recentPatientsRes.data || []);
        setUserGrowth(userGrowthRes.data || []);
        setDietPlanStats(dietPlanStatsRes.data || []);
        setUserActivityStats(userActivityRes.data || []);
      } catch (err) {
        // fallback: show 0s/defaults
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          {adminData && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome, {adminData.firstName}!
              </h1>
              <p className="text-gray-500 text-lg">
                Here's your healthcare system at a glance.
              </p>
            </div>
          )}

          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card className="p-6 shadow-md flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {numUsers}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md flex items-center gap-4">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Dietitians</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {numDietitians}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-amber-600" />
              <div>
                <p className="text-sm text-gray-500">Model Accuracy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.accuracy !== undefined
                    ? (metrics.accuracy * 100).toFixed(2) + "%"
                    : "83%"}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md flex items-center gap-4">
              <UserPlus className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">New Users This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {numNewUsers}
                </p>
              </div>
            </Card>
          </div>

          {/* User Activity and Diet Plans Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* User Activity Chart */}
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">User Activity Overview</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Users">
                      {userActivityStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.category.includes("Active") ? "#4CAF50" : "#FFA726"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Diet Plans Status Chart */}
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Diet Plans Overview</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dietPlanStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Plans">
                      {dietPlanStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.status === "Approved"
                              ? "#4CAF50"
                              : entry.status === "Review"
                              ? "#FFA726"
                              : entry.status === "Pending"
                              ? "#2196F3"
                              : "#F44336"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* User Growth Chart */}
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">User Growth Trend</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Diet Plan Status Distribution */}
            <Card className="p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Diet Plan Status</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dietPlanStats}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {dietPlanStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6 shadow-md flex items-center gap-4">
              <FileText className="w-8 h-8 text-pink-600" />
              <div>
                <p className="text-sm text-gray-500">Approved Diet Plans</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {numApprovedPlans}
                </p>
              </div>
            </Card>
            <Card className="p-6 shadow-md flex items-center gap-4">
              <Database className="w-8 h-8 text-teal-600" />
              <div>
                <p className="text-sm text-gray-500">Active Users This Week</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {numActiveUsers}
                </p>
              </div>
            </Card>
          </div>

          {/* Recent Patients */}
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-bold">Recent Patients (by activity)</h2>
            </div>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Last Log Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">
                      No recent activity.
                    </td>
                  </tr>
                ) : (
                  recentPatients.map((p) => (
                    <tr key={p._id}>
                      <td className="p-2">
                        {p.firstName} {p.lastName}
                      </td>
                      <td className="p-2">{p.email}</td>
                      <td className="p-2">
                        {p.lastLogDate
                          ? new Date(p.lastLogDate).toLocaleString()
                          : "--"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
