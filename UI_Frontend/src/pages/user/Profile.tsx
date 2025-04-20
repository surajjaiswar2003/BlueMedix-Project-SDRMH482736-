import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

const UserProfile: React.FC = () => {
  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Profile content will go here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile; 