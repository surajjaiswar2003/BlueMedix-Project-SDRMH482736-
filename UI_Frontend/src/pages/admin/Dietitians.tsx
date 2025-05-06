import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";

interface Dietitian {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

const AdminDietitiansPage = () => {
  const [dietitians, setDietitians] = useState<Dietitian[]>([]);
  useEffect(() => {
    axios.get("/api/dietitians").then((res) => setDietitians(res.data || []));
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">All Dietitians</h1>
          <Card className="p-6 shadow-md">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Account Created</th>
                </tr>
              </thead>
              <tbody>
                {dietitians.map((d) => (
                  <tr key={d._id}>
                    <td className="p-2">
                      {d.firstName} {d.lastName}
                    </td>
                    <td className="p-2">{d.email}</td>
                    <td className="p-2">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDietitiansPage;
