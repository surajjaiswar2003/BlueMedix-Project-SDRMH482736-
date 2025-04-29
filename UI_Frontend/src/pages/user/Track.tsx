import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import WeeklyHealthLogTable from "@/components/health-tracking/WeeklyHealthLogTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { startOfWeek, endOfWeek, format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UserTrack: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user && user._id && !isFetchingRef.current) {
      fetchLogs();
    }
    return () => {
      isFetchingRef.current = false;
    };
    // eslint-disable-next-line
  }, [user._id]);

  const fetchLogs = async () => {
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

      // If your API returns { logs: [...] }
      setLogs(Array.isArray(response.data.logs) ? response.data.logs : []);
    } catch (err) {
      console.error("Error fetching health logs:", err);
      setError("Failed to load health logs. Please try again.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Handle viewing a log
  const handleViewLog = (log: any) => {
    navigate(`/user/track/${format(new Date(log.date), "yyyy-MM-dd")}`, {
      state: { log },
    });
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
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            Loading health logs...
          </div>
        ) : (
          <WeeklyHealthLogTable logs={logs} onView={handleViewLog} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserTrack;
