// pages/user/Track.tsx
import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import HealthTrackingForm from "@/components/health-tracking/HealthTrackingForm";
import WeeklyHealthLogTable from "@/components/health-tracking/WeeklyHealthLogTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { startOfWeek, endOfWeek, format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

const UserTrack: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("table");

  // Add a ref to track if the request is in progress
  const isFetchingRef = useRef(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch logs on component mount only
  useEffect(() => {
    // Only fetch if we have a user ID and we're not already fetching
    if (user && user._id && !isFetchingRef.current) {
      fetchLogs();
    }

    // Cleanup function
    return () => {
      isFetchingRef.current = false;
    };
  }, [user._id]); // Only depend on user._id, not the entire user object

  // Fetch logs for the current week
  const fetchLogs = async () => {
    // If already fetching, don't start another request
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });

      const response = await axios.get(
        `http://localhost:5000/api/health-logs/${user._id}`,
        {
          params: {
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
          },
        }
      );

      setLogs(response.data.logs || []);
    } catch (err) {
      console.error("Error fetching health logs:", err);
      setError("Failed to load health logs. Please try again.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Handle form submission
  const handleSubmitLog = async (logData: any) => {
    try {
      await axios.post(
        `http://localhost:5000/api/health-logs/${user._id}`,
        logData
      );

      toast.success("Health log saved successfully!");
      fetchLogs();
      setEditingLog(null);
      setActiveTab("table");
    } catch (err) {
      console.error("Error saving health log:", err);
      toast.error("Failed to save health log. Please try again.");
    }
  };

  // Handle editing a log
  const handleEditLog = (log: any) => {
    setEditingLog(log);
    setActiveTab("form");
  };

  // Handle deleting a log
  const handleDeleteLog = async (logId: string, date: Date) => {
    if (!confirm("Are you sure you want to delete this log entry?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/health-logs/${user._id}/${format(
          date,
          "yyyy-MM-dd"
        )}`
      );

      toast.success("Health log deleted successfully!");
      fetchLogs();
    } catch (err) {
      console.error("Error deleting health log:", err);
      toast.error("Failed to delete health log. Please try again.");
    }
  };

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Track My Health</h1>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Weekly View</TabsTrigger>
            <TabsTrigger value="form">Add/Edit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                Loading health logs...
              </div>
            ) : (
              <WeeklyHealthLogTable
                logs={logs}
                onEdit={handleEditLog}
                onDelete={handleDeleteLog}
              />
            )}
          </TabsContent>

          <TabsContent value="form">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {editingLog ? "Edit Health Log" : "Add New Health Log"}
              </h2>
              <HealthTrackingForm
                onSubmit={handleSubmitLog}
                initialData={editingLog}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserTrack;
