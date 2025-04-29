import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar"; // <-- Import your Navbar

// Modal for recipe selection with search and cross button
const RecipeModal = ({
  open,
  recipes,
  selectedId,
  onSelect,
  onClose,
  onUpdate,
}: {
  open: boolean;
  recipes: any[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onClose: () => void;
  onUpdate: () => void;
}) => {
  const [search, setSearch] = useState("");

  // Filter recipes by name or ingredients
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cross/X button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Select a Recipe</h2>
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <div
          className="space-y-3"
          style={{ maxHeight: 400, overflowY: "auto" }}
        >
          {filteredRecipes.length === 0 && (
            <div className="text-gray-500 text-center py-6">
              No recipes found.
            </div>
          )}
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className={`border p-3 rounded flex items-center gap-4 ${
                selectedId === recipe._id ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <input
                type="radio"
                name="recipe"
                value={recipe._id}
                checked={selectedId === recipe._id}
                onChange={() => onSelect(recipe._id)}
              />
              <div>
                <div className="font-medium">{recipe.name}</div>
                <div className="text-xs text-gray-600">
                  Ingredients: {recipe.ingredients.join(", ")}
                </div>
                <div className="text-xs mt-1 flex gap-2 flex-wrap">
                  <span>Calories: {recipe.calories}</span>
                  <span>Protein: {recipe.protein}g</span>
                  <span>Carbs: {recipe.carbs}g</span>
                  <span>Fat: {recipe.fat}g</span>
                  <span>Fiber: {recipe.fiber}g</span>
                  <span>Sodium: {recipe.sodium}mg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onUpdate} disabled={!selectedId}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReviewDietPlanPage: React.FC = () => {
  const { dietPlanId } = useParams<{ dietPlanId: string }>();
  const navigate = useNavigate();

  const [dietPlan, setDietPlan] = useState<any>(null);
  const [healthParams, setHealthParams] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMeal, setModalMeal] = useState<{
    dayNumber: number;
    mealType: string;
    recipeId: string;
  } | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<
    string | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const planRes = await axios.get(
          `http://localhost:5000/api/diet-plans/${dietPlanId}`
        );
        setDietPlan(planRes.data);

        const userId = planRes.data.userId._id;
        const healthRes = await axios.get(
          `http://localhost:5000/api/health-parameters/${userId}`
        );
        setHealthParams(healthRes.data);

        const recipesRes = await axios.get(
          `http://localhost:5000/api/recipes?limit=1000`
        );
        setRecipes(recipesRes.data.recipes || recipesRes.data);
      } catch (err) {
        toast.error("Failed to load data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dietPlanId]);

  const handleUpdateMeal = async (
    dayNumber: number,
    mealType: string,
    recipeId: string
  ) => {
    try {
      await axios.put(
        `http://localhost:5000/api/diet-plans/${dietPlanId}/meal`,
        { dayNumber, mealType, recipeId }
      );
      toast.success("Meal updated!");
      setModalOpen(false);
      setModalMeal(null);
      const planRes = await axios.get(
        `http://localhost:5000/api/diet-plans/${dietPlanId}`
      );
      setDietPlan(planRes.data);
    } catch (err) {
      toast.error("Failed to update meal.");
      console.error(err);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/diet-plans/${dietPlanId}/approve`
      );
      toast.success("Diet plan approved!");
      navigate("/dietitian/dashboard");
    } catch (err) {
      toast.error("Failed to approve plan.");
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!dietPlan || !healthParams) return <div>Not found.</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <h1 className="text-2xl font-bold mb-2">
          Review Diet Plan for {dietPlan.userId.firstName}{" "}
          {dietPlan.userId.lastName}
        </h1>

        {/* Health Parameters */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Health Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Diabetes:</strong> {healthParams.diabetes}
            </div>
            <div>
              <strong>Hypertension:</strong> {healthParams.hypertension}
            </div>
            <div>
              <strong>Cardiovascular:</strong> {healthParams.cardiovascular}
            </div>
            <div>
              <strong>Height:</strong> {healthParams.height} cm
            </div>
            <div>
              <strong>Weight:</strong> {healthParams.weight} kg
            </div>
            <div>
              <strong>BMI Category:</strong> {healthParams.bmiCategory}
            </div>
            <div>
              <strong>Target Weight:</strong> {healthParams.targetWeight} kg
            </div>
            <div>
              <strong>Exercise Freq:</strong> {healthParams.exerciseFrequency}{" "}
              days/week
            </div>
            <div>
              <strong>Diet Type:</strong> {healthParams.dietType}
            </div>
          </div>
        </Card>

        {/* Diet Plan Days */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Diet Plan</h2>
          {dietPlan.days.map((day: any) => (
            <div key={day.day_number} className="mb-6">
              <h3 className="font-semibold mb-2">
                {day.day_label} (Day {day.day_number})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(day)
                  .filter(
                    ([mealType]) =>
                      !["day_number", "day_label"].includes(mealType)
                  )
                  .map(
                    ([mealType, meal]: [string, any]) =>
                      meal && (
                        <div
                          key={mealType}
                          className="border p-4 rounded-md bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <strong>{mealType}:</strong> {meal.name}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setModalMeal({
                                  dayNumber: day.day_number,
                                  mealType,
                                  recipeId: meal.recipe?._id,
                                });
                                setSelectedRecipeId(meal.recipe?._id);
                                setModalOpen(true);
                              }}
                            >
                              Update
                            </Button>
                          </div>
                          <div className="text-xs mt-2">
                            <div>Calories: {meal.calories} kcal</div>
                            <div>Protein: {meal.protein}g</div>
                            <div>Carbs: {meal.carbs}g</div>
                            <div>Fat: {meal.fat}g</div>
                            <div>
                              Ingredients: {meal.ingredients?.join(", ")}
                            </div>
                          </div>
                        </div>
                      )
                  )}
              </div>
            </div>
          ))}
        </Card>

        {/* Modal for updating meal */}
        {modalMeal && (
          <RecipeModal
            open={modalOpen}
            recipes={recipes}
            selectedId={selectedRecipeId}
            onSelect={setSelectedRecipeId}
            onClose={() => {
              setModalOpen(false);
              setModalMeal(null);
            }}
            onUpdate={() => {
              if (selectedRecipeId && selectedRecipeId !== modalMeal.recipeId) {
                handleUpdateMeal(
                  modalMeal.dayNumber,
                  modalMeal.mealType,
                  selectedRecipeId
                );
              } else {
                setModalOpen(false);
                setModalMeal(null);
              }
            }}
          />
        )}

        {/* Approve Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleApprove}>
            Approve Diet Plan
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReviewDietPlanPage;
