import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const recipes = [
  {
    id: 1,
    name: 'Keto Breakfast Bowl',
    category: 'Keto',
    calories: 450,
    status: 'approved',
    createdBy: 'Sarah Smith',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Vegan Buddha Bowl',
    category: 'Vegan',
    calories: 380,
    status: 'pending',
    createdBy: 'Mike Johnson',
    createdAt: '2023-02-20',
  },
  {
    id: 3,
    name: 'Protein Power Smoothie',
    category: 'High-Protein',
    calories: 320,
    status: 'approved',
    createdBy: 'Emily Brown',
    createdAt: '2023-03-10',
  },
];

const categories = [
  'Keto',
  'Vegan',
  'Vegetarian',
  'High-Protein',
  'Low-Carb',
  'Mediterranean',
  'Paleo',
];

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: '',
    calories: '',
    description: '',
    ingredients: '',
    instructions: '',
  });

  const handleAddRecipe = () => {
    toast.success('Recipe added successfully');
    setIsAddDialogOpen(false);
    // In a real app, this would call an API
  };

  const handleDeleteRecipe = (recipeId: number) => {
    toast.success('Recipe deleted successfully');
    // In a real app, this would call an API
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipe Management</h1>
          <p className="text-gray-500">Manage and monitor recipes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dietGreen hover:bg-dietGreen-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipe Name</label>
                  <Input
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newRecipe.category}
                    onValueChange={(value) => setNewRecipe({ ...newRecipe, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Calories</label>
                <Input
                  type="number"
                  value={newRecipe.calories}
                  onChange={(e) => setNewRecipe({ ...newRecipe, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newRecipe.description}
                  onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ingredients</label>
                <Textarea
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Instructions</label>
                <Textarea
                  value={newRecipe.instructions}
                  onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipe Image</label>
                <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRecipe}>Add Recipe</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search recipes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipe</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Calories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell className="font-medium">{recipe.name}</TableCell>
                <TableCell>{recipe.category}</TableCell>
                <TableCell>{recipe.calories}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    recipe.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {recipe.status}
                  </span>
                </TableCell>
                <TableCell>{recipe.createdBy}</TableCell>
                <TableCell>{new Date(recipe.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Recipes; 