// components/health-tracking/HealthTrackingForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { FoodSuggestionDropdown } from "@/components/FoodSuggestionDropdown";

interface MealInputProps {
  label: string;
  meal: any;
  onChange: (field: string, value: any) => void;
}

const MealInput: React.FC<MealInputProps> = ({ label, meal, onChange }) => {
  const { toast } = useToast();

  const handleFoodSuggestion = (name: string, nutritionData?: any) => {
    onChange('name', name);
    if (nutritionData) {
      onChange('calories', nutritionData.calories);
      onChange('protein', nutritionData.protein);
      onChange('carbs', nutritionData.carbs);
      onChange('fat', nutritionData.fat);
      toast({
        title: "Nutrition data loaded",
        description: "Nutrition values have been automatically filled from the database.",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h4 className="font-medium">{label}</h4>
      <div className="space-y-2">
        <Label htmlFor={`${label.toLowerCase()}-name`}>Meal/Recipe Name</Label>
        <FoodSuggestionDropdown
          value={meal?.name || ""}
          onChange={handleFoodSuggestion}
          placeholder="Search for food..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${label.toLowerCase()}-calories`}>Calories</Label>
          <Input
            type="number"
            step="0.1"
            id={`${label.toLowerCase()}-calories`}
            placeholder="Enter calories"
            value={meal?.calories || ""}
            onChange={(e) => onChange("calories", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${label.toLowerCase()}-protein`}>Protein (g)</Label>
          <Input
            type="number"
            step="0.1"
            id={`${label.toLowerCase()}-protein`}
            placeholder="Enter protein"
            value={meal?.protein || ""}
            onChange={(e) => onChange("protein", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${label.toLowerCase()}-carbs`}>Carbs (g)</Label>
          <Input
            type="number"
            step="0.1"
            id={`${label.toLowerCase()}-carbs`}
            placeholder="Enter carbs"
            value={meal?.carbs || ""}
            onChange={(e) => onChange("carbs", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${label.toLowerCase()}-fat`}>Fat (g)</Label>
          <Input
            type="number"
            step="0.1"
            id={`${label.toLowerCase()}-fat`}
            placeholder="Enter fat"
            value={meal?.fat || ""}
            onChange={(e) => onChange("fat", parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
};

interface HealthTrackingFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const HealthTrackingForm: React.FC<HealthTrackingFormProps> = ({
  onSubmit,
  initialData = {}
}) => {
  const [date, setDate] = useState<Date>(
    initialData.date ? new Date(initialData.date) : new Date()
  );
  
  const [formData, setFormData] = useState({
    breakfast: initialData.breakfast || {},
    lunch: initialData.lunch || {},
    dinner: initialData.dinner || {},
    afternoonSnack: initialData.afternoonSnack || {},
    eveningSnack: initialData.eveningSnack || {},
    sleep: {
      hours: initialData.sleep?.hours || 7
    },
    exercise: {
      minutes: initialData.exercise?.minutes || 0,
      type: initialData.exercise?.type || "none"
    },
    water: {
      glasses: initialData.water?.glasses || 0
    },
    stress: {
      level: initialData.stress?.level || 3
    },
    mood: {
      rating: initialData.mood?.rating || 3
    }
  });

  const handleMealChange = (mealType: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [field]: value
      }
    }));
  };

  const handleChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Helper to get IST midnight
  function toISTMidnight(date: Date) {
    // Create a new date at midnight IST for the given date
    const istOffset = 5.5 * 60; // IST is UTC+5:30 in minutes
    const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return new Date(utc + istOffset * 60 * 1000);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate daily nutrition totals
    const dailyNutritionTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    // Add up nutrition from all meals
    ['breakfast', 'lunch', 'dinner', 'afternoonSnack', 'eveningSnack'].forEach(meal => {
      if (formData[meal]) {
        dailyNutritionTotals.calories += formData[meal].calories || 0;
        dailyNutritionTotals.protein += formData[meal].protein || 0;
        dailyNutritionTotals.carbs += formData[meal].carbs || 0;
        dailyNutritionTotals.fat += formData[meal].fat || 0;
      }
    });
    // Always send date as IST midnight
    const istMidnight = toISTMidnight(date);
    onSubmit({
      date: istMidnight,
      ...formData,
      dailyNutritionTotals
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Label htmlFor="date" className="w-24">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Meals Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Meals</h3>
          <div className="space-y-4">
            <MealInput 
              label="Breakfast" 
              meal={formData.breakfast} 
              onChange={(field, value) => handleMealChange("breakfast", field, value)} 
            />
            <MealInput 
              label="Lunch" 
              meal={formData.lunch} 
              onChange={(field, value) => handleMealChange("lunch", field, value)} 
            />
            <MealInput 
              label="Dinner" 
              meal={formData.dinner} 
              onChange={(field, value) => handleMealChange("dinner", field, value)} 
            />
            <MealInput 
              label="Afternoon Snack" 
              meal={formData.afternoonSnack} 
              onChange={(field, value) => handleMealChange("afternoonSnack", field, value)} 
            />
            <MealInput 
              label="Evening Snack" 
              meal={formData.eveningSnack} 
              onChange={(field, value) => handleMealChange("eveningSnack", field, value)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Sleep Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Sleep</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sleepHours">Hours of Sleep</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="sleepHours"
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={formData.sleep.hours || ""}
                  onChange={(e) => handleChange("sleep", "hours", parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
                <span>hours</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Exercise</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exerciseMinutes">Exercise Duration</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="exerciseMinutes"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formData.exercise.minutes || ""}
                  onChange={(e) => handleChange("exercise", "minutes", parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
                <span>minutes</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Exercise Type</Label>
              <RadioGroup
                value={formData.exercise.type}
                onValueChange={(value) => handleChange("exercise", "type", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cardio" id="cardio" />
                  <Label htmlFor="cardio">Cardio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strength" id="strength" />
                  <Label htmlFor="strength">Strength</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Mixed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none-exercise" />
                  <Label htmlFor="none-exercise">None</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Water Intake</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="waterGlasses">Glasses of Water (250ml each)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="waterGlasses"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formData.water.glasses || ""}
                  onChange={(e) => handleChange("water", "glasses", parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
                <span>glasses</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress & Mood Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Stress & Mood</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level (1-5)</Label>
              <div className="flex items-center space-x-4">
                <span>Low</span>
                <Slider
                  id="stressLevel"
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.stress.level]}
                  onValueChange={(value) => handleChange("stress", "level", value[0])}
                  className="flex-1"
                />
                <span>High</span>
                <span className="w-8 text-center">{formData.stress.level}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moodRating">Mood (1-5)</Label>
              <div className="flex items-center space-x-4">
                <span>Bad</span>
                <Slider
                  id="moodRating"
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.mood.rating]}
                  onValueChange={(value) => handleChange("mood", "rating", value[0])}
                  className="flex-1"
                />
                <span>Great</span>
                <span className="w-8 text-center">{formData.mood.rating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">Save Health Log</Button>
    </form>
  );
};

export default HealthTrackingForm;
