import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Clipboard, Activity } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DietitianDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingReviews: 0,
    plansApproved: 0,
  });
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Get dashboard stats
        const statsRes = await axios.get(
          "http://localhost:5000/api/dietitian-dashboard/stats"
        );
        setStats(statsRes.data);

        // Get recent patients
        const patientsRes = await axios.get(
          "http://localhost:5000/api/health-logs/recent-patients"
        );
        setRecentPatients(patientsRes.data);

        // Get pending reviews
        const reviewsRes = await axios.get(
          "http://localhost:5000/api/diet-plans/review"
        );
        setPendingReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout requiredRole="dietitian">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-md flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Assigned Patients</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalPatients}
              </p>
            </div>
          </Card>
          <Card className="p-6 shadow-md flex items-center gap-4">
            <Clipboard className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingReviews}
              </p>
            </div>
          </Card>
          <Card className="p-6 shadow-md flex items-center gap-4">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Plans Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.plansApproved}
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Patients (by last activity)
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
              {recentPatients.length === 0 ? (
                <div className="text-gray-500">No recent patient activity.</div>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last log:{" "}
                        {patient.lastLogDate
                          ? new Date(patient.lastLogDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dietitian/patient/${patient._id}/logs`)
                      }
                    >
                      Track
                    </Button>
                  </div>
                ))
              )}
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
          ) : pendingReviews.length === 0 ? (
            <div className="text-gray-500">No plans pending review.</div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((plan) => (
                <div
                  key={plan._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {plan.userId ? `${plan.userId.firstName} ${plan.userId.lastName}` : 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/dietitian/review/${plan._id}`)}
                  >
                    Review Diet Plan
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DietitianDashboard;
