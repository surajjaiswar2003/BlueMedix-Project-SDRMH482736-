import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { Badge } from "@/components/ui/badge"; // optional, for nice status display

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface UserWithPlanStatus extends User {
  dietPlanStatus: "approved" | "review" | "none";
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserWithPlanStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndPlans = async () => {
      setLoading(true);
      try {
        const usersRes = await axios.get("/api/users");
        const usersData: User[] = usersRes.data || [];

        // Fetch diet plan status for each user in parallel
        const usersWithPlanStatus: UserWithPlanStatus[] = await Promise.all(
          usersData.map(async (u) => {
            try {
              const planRes = await axios.get(
                `/api/diet-plans/current/${u._id}`
              );
              const status = planRes.data?.dietPlan?.status || "none";
              return { ...u, dietPlanStatus: status };
            } catch {
              // If no plan or error, set as "none"
              return { ...u, dietPlanStatus: "none" };
            }
          })
        );
        setUsers(usersWithPlanStatus);
      } catch (err) {
        setUsers([]);
      }
      setLoading(false);
    };

    fetchUsersAndPlans();
  }, []);

  const renderStatus = (status: string) => {
    if (status === "approved") {
      return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
    }
    if (status === "review") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      );
    }
    return <Badge className="bg-gray-200 text-gray-600">No Plan</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">All Users</h1>
          <Card className="p-6 shadow-md">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Account Created</th>
                  <th className="text-left p-2">Diet Plan Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td className="p-2">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">{renderStatus(u.dietPlanStatus)}</td>
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

export default AdminUsersPage;
