import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import HealthTrackingForm from "@/components/health-tracking/HealthTrackingForm";
import { parseISO } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

const HealthTrackingFormPage = () => {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const navigate = useNavigate();

  const initialData = dateParam ? { date: parseISO(dateParam) } : {};

  const handleSubmit = async (data: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      await axios.post(
        `http://localhost:5000/api/health-logs/${user._id}`,
        data
      );
      toast.success("Health log saved successfully!");
      navigate("/user/track");
    } catch (err) {
      toast.error("Failed to save health log.");
    }
  };

  return (
    <DashboardLayout requiredRole="user">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Add Health Log</h1>
        <HealthTrackingForm onSubmit={handleSubmit} initialData={initialData} />
      </div>
    </DashboardLayout>
  );
};

export default HealthTrackingFormPage;
