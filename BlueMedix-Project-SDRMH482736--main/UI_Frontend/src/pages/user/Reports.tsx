import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

const UserReports: React.FC = () => {
  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Progress Reports</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Progress reports content will go here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserReports; 