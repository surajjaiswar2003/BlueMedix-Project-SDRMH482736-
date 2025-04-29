import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TrackUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/users"); // You need a users endpoint!
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 mt-16 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Track Users</h1>
        <Card className="p-6 shadow-md">
          {isLoading ? (
            <div>Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-gray-500">No users found.</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/dietitian/patient/${user._id}/logs`)
                    }
                  >
                    Track
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

export default TrackUsersPage;
