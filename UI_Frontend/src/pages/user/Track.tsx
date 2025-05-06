import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import WeeklyHealthLogTable from "@/components/health-tracking/WeeklyHealthLogTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { startOfWeek, endOfWeek, format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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

      console.log("Fetching logs for date range:", {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      });

      const response = await axios.get(
        `http://localhost:5000/api/health-logs/${user._id}`,
        {
          params: {
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
            _t: new Date().getTime(), // Add timestamp to prevent caching
          },
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );

      console.log("Received response:", response.data);

      // If your API returns { logs: [...] }
      const fetchedLogs = Array.isArray(response.data.logs) ? response.data.logs : [];
      console.log("Setting logs:", fetchedLogs);
      setLogs(fetchedLogs);
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Track My Health</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
