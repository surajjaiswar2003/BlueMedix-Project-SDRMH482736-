
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface DietaryPreferencesFormData {
  dietType: string;
  mealSizePreference: string;
  spiceTolerance: string;
  cuisinePreferences: string[];
  foodTexturePreferences: string;
  portionControlAbility: string;
  previousDietSuccessHistory: string;
  foodIntolerances: string[];
  preferredMealComplexity: string;
  seasonalFoodPreferences: string;
}

interface DietaryPreferencesFormProps {
  data: DietaryPreferencesFormData & Record<string, any>;
  updateData: (data: Partial<DietaryPreferencesFormData>) => void;
}

const DietaryPreferencesForm: React.FC<DietaryPreferencesFormProps> = ({ data, updateData }) => {
  const cuisineOptions = [
    { id: "asian", label: "Asian" },
    { id: "western", label: "Western" },
    { id: "mediterranean", label: "Mediterranean" },
    { id: "middle-eastern", label: "Middle Eastern" },
    { id: "latin", label: "Latin American" },
    { id: "african", label: "African" },
    { id: "indian", label: "Indian" },
    { id: "european", label: "European" },
  ];
  
  const intoleranceOptions = [
    { id: "lactose", label: "Lactose" },
    { id: "gluten", label: "Gluten" },
    { id: "fructose", label: "Fructose" },
    { id: "fodmap", label: "FODMAP" },
    { id: "histamine", label: "Histamine" },
    { id: "nightshades", label: "Nightshades" },
  ];

  const handleCuisineChange = (id: string, checked: boolean) => {
    if (checked) {
      updateData({
        cuisinePreferences: [...data.cuisinePreferences, id],
      });
    } else {
      updateData({
        cuisinePreferences: data.cuisinePreferences.filter(item => item !== id),
      });
    }
  };

  const handleIntoleranceChange = (id: string, checked: boolean) => {
    if (checked) {
      updateData({
        foodIntolerances: [...data.foodIntolerances, id],
      });
    } else {
      updateData({
        foodIntolerances: data.foodIntolerances.filter(item => item !== id),
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Dietary Preferences & Restrictions</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Help us understand your food preferences and restrictions to create enjoyable meal plans.
        </p>
      </div>

      {/* 31. Diet Type */}
      <div className="space-y-3">
        <Label htmlFor="dietType">31. Diet Type</Label>
        <Select 
          value={data.dietType} 
          onValueChange={(value) => updateData({ dietType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select diet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="omnivore">Omnivore (meat and plants)</SelectItem>
            <SelectItem value="pescatarian">Pescatarian (fish and plants)</SelectItem>
            <SelectItem value="vegetarian">Vegetarian (no meat)</SelectItem>
            <SelectItem value="vegan">Vegan (no animal products)</SelectItem>
            <SelectItem value="keto">Keto (low carb, high fat)</SelectItem>
            <SelectItem value="paleo">Paleo (unprocessed foods)</SelectItem>
            <SelectItem value="mediterranean">Mediterranean Diet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 32. Meal Size Preference */}
      <div className="space-y-3">
        <Label>32. Meal Size Preference</Label>
        <RadioGroup
          value={data.mealSizePreference}
          onValueChange={(value) => updateData({ mealSizePreference: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small-frequent" id="meal-small" />
            <Label htmlFor="meal-small">Small, frequent meals (5-6 per day)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular" id="meal-regular" />
            <Label htmlFor="meal-regular">Regular (3 meals per day)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large-infrequent" id="meal-large" />
            <Label htmlFor="meal-large">Large, infrequent meals (1-2 per day)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 33. Spice Tolerance */}
      <div className="space-y-3">
        <Label>33. Spice Tolerance</Label>
        <RadioGroup
          value={data.spiceTolerance}
          onValueChange={(value) => updateData({ spiceTolerance: value })}
          className="flex space-x-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="spice-low" />
            <Label htmlFor="spice-low">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="spice-medium" />
            <Label htmlFor="spice-medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="spice-high" />
            <Label htmlFor="spice-high">High</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 34. Cuisine Preferences */}
      <div className="space-y-3">
        <Label>34. Cuisine Preferences (select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {cuisineOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`cuisine-${option.id}`} 
                checked={data.cuisinePreferences?.includes(option.id)}
                onCheckedChange={(checked) => 
                  handleCuisineChange(option.id, checked === true)
                }
              />
              <Label htmlFor={`cuisine-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* 35. Food Texture Preferences */}
      <div className="space-y-3">
        <Label>35. Food Texture Preferences</Label>
        <RadioGroup
          value={data.foodTexturePreferences}
          onValueChange={(value) => updateData({ foodTexturePreferences: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="soft" id="texture-soft" />
            <Label htmlFor="texture-soft">Soft (stews, soups, mashed foods)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="crunchy" id="texture-crunchy" />
            <Label htmlFor="texture-crunchy">Crunchy (nuts, raw vegetables, crispy foods)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="texture-mixed" />
            <Label htmlFor="texture-mixed">Mixed (enjoy variety of textures)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 36. Portion Control Ability */}
      <div className="space-y-3">
        <Label>36. Portion Control Ability</Label>
        <RadioGroup
          value={data.portionControlAbility}
          onValueChange={(value) => updateData({ portionControlAbility: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="portion-poor" />
            <Label htmlFor="portion-poor">Poor (frequently overeat)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="portion-fair" />
            <Label htmlFor="portion-fair">Fair (sometimes struggle)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="portion-good" />
            <Label htmlFor="portion-good">Good (rarely overeat)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 37. Previous Diet Success History */}
      <div className="space-y-3">
        <Label>37. Previous Diet Success History</Label>
        <RadioGroup
          value={data.previousDietSuccessHistory}
          onValueChange={(value) => updateData({ previousDietSuccessHistory: value })}
          className="flex space-x-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="diet-success-yes" />
            <Label htmlFor="diet-success-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="diet-success-no" />
            <Label htmlFor="diet-success-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 38. Food Intolerances */}
      <div className="space-y-3">
        <Label>38. Food Intolerances (select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {intoleranceOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`intolerance-${option.id}`} 
                checked={data.foodIntolerances?.includes(option.id)}
                onCheckedChange={(checked) => 
                  handleIntoleranceChange(option.id, checked === true)
                }
              />
              <Label htmlFor={`intolerance-${option.id}`}>{option.label}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="intolerance-none" 
              checked={data.foodIntolerances?.includes("none")}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateData({ foodIntolerances: ["none"] });
                } else {
                  updateData({ foodIntolerances: [] });
                }
              }}
            />
            <Label htmlFor="intolerance-none">None</Label>
          </div>
        </div>
      </div>

      {/* 39. Preferred Meal Complexity */}
      <div className="space-y-3">
        <Label>39. Preferred Meal Complexity</Label>
        <RadioGroup
          value={data.preferredMealComplexity}
          onValueChange={(value) => updateData({ preferredMealComplexity: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simple" id="complexity-simple" />
            <Label htmlFor="complexity-simple">Simple (few ingredients, quick recipes)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="complexity-moderate" />
            <Label htmlFor="complexity-moderate">Moderate (balanced recipes)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="complex" id="complexity-complex" />
            <Label htmlFor="complexity-complex">Complex (gourmet, many ingredients)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 40. Seasonal Food Preferences */}
      <div className="space-y-3">
        <Label>40. Seasonal Food Preferences</Label>
        <RadioGroup
          value={data.seasonalFoodPreferences}
          onValueChange={(value) => updateData({ seasonalFoodPreferences: value })}
          className="flex space-x-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="seasonal-yes" />
            <Label htmlFor="seasonal-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="seasonal-no" />
            <Label htmlFor="seasonal-no">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default DietaryPreferencesForm;
