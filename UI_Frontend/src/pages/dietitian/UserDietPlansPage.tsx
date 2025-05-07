import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const UserDietPlansPage = () => {
  const [pendingPlans, setPendingPlans] = useState<any[]>([]);
  const [approvedPlans, setApprovedPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        // Fetch pending and approved plans
        const pendingRes = await axios.get(
          "http://localhost:5000/api/diet-plans/review"
        );
        setPendingPlans(Array.isArray(pendingRes.data) ? pendingRes.data : []);

        const approvedRes = await axios.get(
          "http://localhost:5000/api/diet-plans?status=approved"
        );
        setApprovedPlans(Array.isArray(approvedRes.data) ? approvedRes.data : []);
      } catch (err) {
        console.error("Error fetching diet plans:", err);
        toast.error("Failed to load diet plans");
        setPendingPlans([]);
        setApprovedPlans([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 mt-16 space-y-8">
        <h1 className="text-2xl font-bold mb-4">User Diet Plans</h1>

        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Pending Plans for Review
          </h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : pendingPlans.length === 0 ? (
            <div className="text-gray-500">No pending plans.</div>
          ) : (
            <div className="space-y-4">
              {pendingPlans.map((plan) => (
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
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Approved Diet Plans</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : approvedPlans.length === 0 ? (
            <div className="text-gray-500">No approved plans.</div>
          ) : (
            <div className="space-y-4">
              {approvedPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {plan.userId ? `${plan.userId.firstName} ${plan.userId.lastName}` : 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Approved: {new Date(plan.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/dietitian/approved-plan/${plan._id}`)
                    }
                  >
                    View Plan
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default UserDietPlansPage;
