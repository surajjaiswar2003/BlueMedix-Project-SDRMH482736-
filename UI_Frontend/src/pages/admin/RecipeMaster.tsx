import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Recipe {
  recipe_id: number;
  name: string;
  meal_type: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  sodium: number;
  fiber: number;
  ingredients: string[];
  instructions: string;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  diabetes_friendly: boolean;
  heart_healthy: boolean;
  low_sodium: boolean;
  diet_type: string;
  cooking_difficulty: string;
  prep_time: number;
}

const emptyRecipe: Recipe = {
  recipe_id: 0,
  name: "",
  meal_type: "",
  protein: 0,
  carbs: 0,
  fat: 0,
  calories: 0,
  sodium: 0,
  fiber: 0,
  ingredients: [],
  instructions: "",
  vegetarian: false,
  vegan: false,
  gluten_free: false,
  diabetes_friendly: false,
  heart_healthy: false,
  low_sodium: false,
  diet_type: "",
  cooking_difficulty: "",
  prep_time: 0,
};

const RecipeMaster = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [form, setForm] = useState<Recipe>(emptyRecipe);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async (page = 1, q = "") => {
    setLoading(true);
    try {
      let url = `/api/recipes?page=${page}&limit=100`;
      if (q) url = `/api/recipes/search?query=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      if (q) {
        setRecipes(res.data);
        setTotal(res.data.length);
      } else {
        setRecipes(res.data.recipes);
        setTotal(res.data.totalPages * 100);
      }
    } catch (err) {
      setRecipes([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes(1, "");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(1, search);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      ingredients: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleEdit = (recipe: Recipe) => {
    setEditing(recipe);
    setForm(recipe);
    setShowForm(true);
    setMsg("");
  };

  const handleDelete = async (recipe_id: number) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await axios.delete(`/api/recipes/${recipe_id}`);
      setMsg("Recipe deleted.");
      fetchRecipes(page, search);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error deleting recipe.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      if (editing) {
        await axios.put(`/api/recipes/${form.recipe_id}`, form);
        setMsg("Recipe updated!");
      } else {
        await axios.post("/api/recipes", form);
        setMsg("Recipe created!");
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyRecipe);
      fetchRecipes(page, search);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error saving recipe.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Recipe Master</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <Button type="submit">Search</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(true);
                  setForm(emptyRecipe);
                  setEditing(null);
                  setMsg("");
                }}
              >
                + New Recipe
              </Button>
            </form>
          </div>

          {msg && <div className="mb-4 text-green-600">{msg}</div>}

          {showForm && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">
                {editing ? "Edit Recipe" : "Create Recipe"}
              </h2>
              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block mb-1 font-medium">Recipe ID</label>
                  <input
                    type="number"
                    name="recipe_id"
                    value={form.recipe_id}
                    onChange={handleFormChange}
                    required
                    disabled={!!editing}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Meal Type</label>
                  <input
                    type="text"
                    name="meal_type"
                    value={form.meal_type}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Diet Type</label>
                  <input
                    type="text"
                    name="diet_type"
                    value={form.diet_type}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Cooking Difficulty
                  </label>
                  <input
                    type="text"
                    name="cooking_difficulty"
                    value={form.cooking_difficulty}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    name="prep_time"
                    value={form.prep_time}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Protein (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={form.protein}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={form.carbs}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Fat (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={form.fat}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={form.calories}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Sodium (mg)</label>
                  <input
                    type="number"
                    name="sodium"
                    value={form.sodium}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Fiber (g)</label>
                  <input
                    type="number"
                    name="fiber"
                    value={form.fiber}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    name="ingredients"
                    value={form.ingredients.join(", ")}
                    onChange={handleIngredientsChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Instructions</label>
                  <textarea
                    name="instructions"
                    value={form.instructions}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                {/* Boolean checkboxes */}
                <div>
                  <label className="block mb-1 font-medium">Vegetarian</label>
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={form.vegetarian}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Vegan</label>
                  <input
                    type="checkbox"
                    name="vegan"
                    checked={form.vegan}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Gluten Free</label>
                  <input
                    type="checkbox"
                    name="gluten_free"
                    checked={form.gluten_free}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Diabetes Friendly
                  </label>
                  <input
                    type="checkbox"
                    name="diabetes_friendly"
                    checked={form.diabetes_friendly}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Heart Healthy
                  </label>
                  <input
                    type="checkbox"
                    name="heart_healthy"
                    checked={form.heart_healthy}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Low Sodium</label>
                  <input
                    type="checkbox"
                    name="low_sodium"
                    checked={form.low_sodium}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="md:col-span-2 flex gap-2 mt-4">
                  <Button type="submit">{editing ? "Update" : "Create"}</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                      setForm(emptyRecipe);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-bold mb-4">All Recipes ({total})</h2>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Meal Type</th>
                      <th className="p-2">Calories</th>
                      <th className="p-2">Protein</th>
                      <th className="p-2">Carbs</th>
                      <th className="p-2">Fat</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map((r) => (
                      <tr key={r.recipe_id}>
                        <td className="p-2">{r.recipe_id}</td>
                        <td className="p-2">{r.name}</td>
                        <td className="p-2">{r.meal_type}</td>
                        <td className="p-2">{r.calories}</td>
                        <td className="p-2">{r.protein}</td>
                        <td className="p-2">{r.carbs}</td>
                        <td className="p-2">{r.fat}</td>
                        <td className="p-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(r)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(r.recipe_id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeMaster;
