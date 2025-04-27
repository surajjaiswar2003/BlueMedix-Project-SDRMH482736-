import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

const UserTrack: React.FC = () => {
  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Track My Health</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Health tracking content will go here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserTrack; 