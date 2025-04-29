import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const ViewHealthLog = () => {
  const { state } = useLocation();
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  // If user navigated directly, state might be undefined.
  const log = state?.log;

  if (!log) {
    return (
      <DashboardLayout requiredRole="user">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Health Log</h1>
          <div>No log found for this date.</div>
          <button
            className="mt-4 underline text-blue-600"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Health Log for {date}</h1>
        <Card className="p-4">
          <div>
            <strong>Breakfast:</strong> {log.breakfast?.name || "-"} (
            {log.breakfast?.calories || 0} cal)
          </div>
          <div>
            <strong>Lunch:</strong> {log.lunch?.name || "-"} (
            {log.lunch?.calories || 0} cal)
          </div>
          <div>
            <strong>Dinner:</strong> {log.dinner?.name || "-"} (
            {log.dinner?.calories || 0} cal)
          </div>
          <div>
            <strong>Afternoon Snack:</strong> {log.afternoonSnack?.name || "-"}{" "}
            ({log.afternoonSnack?.calories || 0} cal)
          </div>
          <div>
            <strong>Evening Snack:</strong> {log.eveningSnack?.name || "-"} (
            {log.eveningSnack?.calories || 0} cal)
          </div>
          <div>
            <strong>Sleep:</strong> {log.sleep?.hours || "-"} hours
          </div>
          <div>
            <strong>Exercise:</strong> {log.exercise?.minutes || "-"} min (
            {log.exercise?.type || "-"})
          </div>
          <div>
            <strong>Water:</strong> {log.water?.glasses || "-"} glasses
          </div>
          <div>
            <strong>Mood:</strong> {log.mood?.rating || "-"}
          </div>
          <div>
            <strong>Stress:</strong> {log.stress?.level || "-"}
          </div>
        </Card>
        <button
          className="mt-4 underline text-blue-600"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ViewHealthLog;
