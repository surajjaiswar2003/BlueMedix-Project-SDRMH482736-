// components/profile/DietPlanActions.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DietPlanActionsProps {
  dietPlan: any;
  nutritionalAnalysis: any;
  userCluster: number;
  healthParams?: any; // Add this to receive health parameters
  onUpdateParameters?: () => void;
}

const DietPlanActions: React.FC<DietPlanActionsProps> = ({
  dietPlan,
  nutritionalAnalysis,
  userCluster,
  healthParams,
  onUpdateParameters,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // In your DietPlanActions.tsx
  const handleSendForReview = async () => {
    setIsSubmitting(true);

    try {
      // 1. First save the health parameters
      if (healthParams) {
        await axios.post(
          `http://localhost:5000/api/health-parameters/${user._id}`,
          healthParams
        );
      }

      // 2. Then save the diet plan
      const saveResponse = await axios.post(
        `http://localhost:5000/api/diet-plans/save/${user._id}`,
        {
          dietPlan,
          nutritionalAnalysis,
          userCluster,
        }
      );

      if (saveResponse.data.success) {
        // 3. Submit it for review - include userId in the request body
        const dietPlanId = saveResponse.data.dietPlanId;
        await axios.post(
          `http://localhost:5000/api/diet-plans/confirm/${dietPlanId}`,
          { userId: user._id } // Include userId here
        );

        toast.success("Diet plan submitted for review!");
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Error submitting diet plan:", error);
      toast.error("Failed to submit diet plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateParameters = () => {
    if (onUpdateParameters) {
      // Use the callback if provided
      onUpdateParameters();
    } else {
      // Fallback to navigation if no callback is provided
      navigate("/user/dashboard");
      // Set a flag in localStorage to show the form
      localStorage.setItem("showMultiStepForm", "true");
    }
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4">
      <Button
        onClick={handleSendForReview}
        disabled={isSubmitting}
        className="flex-1"
      >
        {isSubmitting ? "Submitting..." : "Send for Review"}
      </Button>

      <Button
        variant="outline"
        onClick={handleUpdateParameters}
        disabled={isSubmitting}
        className="flex-1"
      >
        Update Parameters
      </Button>
    </div>
  );
};

export default DietPlanActions;
