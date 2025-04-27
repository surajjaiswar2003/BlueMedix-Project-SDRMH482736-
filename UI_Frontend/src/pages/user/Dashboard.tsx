// pages/user/Dashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import MultiStepProfileForm from "@/components/profile/MultiStepProfileForm";
import {
  Activity,
  Heart,
  Droplet,
  Moon,
  Utensils,
  Calendar,
} from "lucide-react";
import axios from "axios";

interface HealthMetric {
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  change: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface HealthParams {
  diabetes?: string;
  hypertension?: string;
  cardiovascular?: string;
  digestiveDisorders?: string;
  height?: number;
  weight?: number;
  bmiCategory?: string;
  dietType?: string;
  exerciseFrequency?: number;
  [key: string]: any;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [healthParams, setHealthParams] = useState<HealthParams | null>(null);
  const [loadingHealthParams, setLoadingHealthParams] = useState<boolean>(true);
  // Add state to control showing the multistep form
  const [showMultiStepForm, setShowMultiStepForm] = useState<boolean>(false);
  const [healthMetrics, setHealthMetrics] = useState<{
    weight: HealthMetric;
    calories: HealthMetric;
    water: HealthMetric;
    sleep: HealthMetric;
  }>({
    weight: { value: "68", unit: "kg", trend: "down", change: "-2" },
    calories: { value: "1850", unit: "kcal", trend: "up", change: "+150" },
    water: { value: "1.8", unit: "L", trend: "up", change: "+0.3" },
    sleep: { value: "7.5", unit: "hrs", trend: "up", change: "+0.5" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dietPlanStatus, setDietPlanStatus] = useState<"review" | "approved">(
    "review"
  );

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);

      // Fetch health parameters
      const fetchHealthParams = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/health-parameters/${parsedUser._id}`
          );
          setHealthParams(response.data);

          // Update weight metric if available
          if (response.data.weight) {
            setHealthMetrics((prev) => ({
              ...prev,
              weight: {
                ...prev.weight,
                value: response.data.weight.toString(),
              },
            }));
          }
        } catch (error) {
          // If 404 or other error, health parameters don't exist yet
          console.log("No health parameters found or error:", error);
          setHealthParams(null);
        } finally {
          setLoadingHealthParams(false);
        }
      };

      fetchHealthParams();
    }

    // Fetch health metrics (mock for now)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handler for updating health parameters - now toggles form visibility
  const handleUpdateHealthParams = () => {
    setShowMultiStepForm(true);
  };

  // Handler for when form submission is complete
  const handleFormComplete = () => {
    setShowMultiStepForm(false);

    // Refresh health parameters
    if (userData && userData._id) {
      fetchHealthParams(userData._id);
    }
  };

  // Extract fetchHealthParams for reuse
  const fetchHealthParams = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/health-parameters/${userId}`
      );
      setHealthParams(response.data);

      // Update weight metric if available
      if (response.data.weight) {
        setHealthMetrics((prev) => ({
          ...prev,
          weight: {
            ...prev.weight,
            value: response.data.weight.toString(),
          },
        }));
      }
    } catch (error) {
      console.log("No health parameters found or error:", error);
      setHealthParams(null);
    } finally {
      setLoadingHealthParams(false);
    }
  };

  // Handler for generating diet plan
  const handleGenerateDietPlan = () => {
    navigate("/user/generate-diet-plan");
  };

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        {/* Complete Profile or Health Parameters Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              {loadingHealthParams
                ? "Loading..."
                : showMultiStepForm
                ? "Update Health Profile"
                : healthParams
                ? "Your Health Profile"
                : "Complete Your Health Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHealthParams ? (
              <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
            ) : showMultiStepForm ? (
              // Render MultiStepProfileForm directly in the dashboard
              <MultiStepProfileForm onComplete={handleFormComplete} />
            ) : healthParams ? (
              <div className="space-y-4">
                {/* Display saved health parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Height
                    </p>
                    <p className="text-lg">{healthParams.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Weight
                    </p>
                    <p className="text-lg">{healthParams.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      BMI Category
                    </p>
                    <p className="text-lg">{healthParams.bmiCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Diet Type
                    </p>
                    <p className="text-lg">{healthParams.dietType}</p>
                  </div>
                  {healthParams.diabetes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Diabetes
                      </p>
                      <p className="text-lg">{healthParams.diabetes}</p>
                    </div>
                  )}
                  {healthParams.exerciseFrequency && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Exercise Frequency
                      </p>
                      <p className="text-lg">
                        {healthParams.exerciseFrequency} days/week
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleUpdateHealthParams}
                >
                  Update Health Parameters
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  You haven't completed your health profile yet. Complete it to
                  get personalized diet plans.
                </p>
                <Button
                  onClick={handleUpdateHealthParams}
                  className="w-full md:w-auto"
                >
                  Complete Health Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Current Weight
              </CardTitle>
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {healthMetrics.weight.value} {healthMetrics.weight.unit}
                  </div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        healthMetrics.weight.trend === "down"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {healthMetrics.weight.change} {healthMetrics.weight.unit}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      from last week
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Calories
              </CardTitle>
              <Utensils className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {healthMetrics.calories.value} {healthMetrics.calories.unit}
                  </div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        healthMetrics.calories.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {healthMetrics.calories.change}{" "}
                      {healthMetrics.calories.unit}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      from yesterday
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Water Intake
              </CardTitle>
              <Droplet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {healthMetrics.water.value} {healthMetrics.water.unit}
                  </div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        healthMetrics.water.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {healthMetrics.water.change} {healthMetrics.water.unit}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      from yesterday
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Sleep Duration
              </CardTitle>
              <Moon className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {healthMetrics.sleep.value} {healthMetrics.sleep.unit}
                  </div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        healthMetrics.sleep.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {healthMetrics.sleep.change} {healthMetrics.sleep.unit}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      from yesterday
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Diet Plan Status */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Your Diet Plan Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHealthParams ? (
              <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ) : !healthParams ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">
                    Complete Your Health Profile First
                  </h3>
                  <p className="text-sm text-gray-500">
                    You need to complete your health profile before generating a
                    diet plan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">
                    Personalized Diet Plan
                  </h3>
                  <p className="text-sm text-gray-500">
                    {dietPlanStatus === "review"
                      ? "Your diet plan is currently under review by a dietitian."
                      : "Your diet plan has been approved and is ready to follow."}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dietPlanStatus === "review"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {dietPlanStatus === "review" ? "Under Review" : "Approved"}
                </div>
              </div>
            )}

            <div className="mt-4">
              {healthParams && (
                <Button
                  variant={dietPlanStatus === "review" ? "outline" : "default"}
                  className="w-full md:w-auto"
                  onClick={handleGenerateDietPlan}
                >
                  {dietPlanStatus === "review"
                    ? "Generate Diet Plan"
                    : "View Diet Plan"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Breakfast</h3>
                    <p className="text-sm text-gray-500">
                      Oatmeal with berries and nuts
                    </p>
                    <p className="text-xs text-gray-400">450 calories</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">7:30 AM</span>
              </div>

              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Morning Exercise</h3>
                    <p className="text-sm text-gray-500">
                      30 min cardio workout
                    </p>
                    <p className="text-xs text-gray-400">Burns ~250 calories</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">9:00 AM</span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Lunch</h3>
                    <p className="text-sm text-gray-500">
                      Grilled chicken salad with avocado
                    </p>
                    <p className="text-xs text-gray-400">550 calories</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">12:30 PM</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              <Calendar className="h-4 w-4 mr-2" />
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
