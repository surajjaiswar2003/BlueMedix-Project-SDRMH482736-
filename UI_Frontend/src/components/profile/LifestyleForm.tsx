import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface LifestyleFormData {
  workSchedule: string;
  sleepDuration: string;
  sleepQuality: string;
  stressLevel: string;
  mealTimingRegularity: string;
  cookingSkills: string;
  availableCookingTime: string;
  foodBudget: string;
  alcoholConsumption: string;
  smokingStatus: string;
  waterIntake: string;
  eatingOutFrequency: string;
  snackingBehavior: string;
  foodPrepTimeAvailability: string;
  travelFrequency: string;
}

interface LifestyleFormProps {
  data: LifestyleFormData & Record<string, any>;
  updateData: (data: Partial<LifestyleFormData>) => void;
}

const LifestyleForm: React.FC<LifestyleFormProps> = ({ data, updateData }) => {
  // Given the large number of parameters, we'll group them
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Lifestyle Factors</h3>
        <p className="text-sm text-muted-foreground mb-6">
          These details help us understand your daily routine and create realistic meal plans.
        </p>
      </div>

      {/* Work and Sleep Section */}
      <Collapsible defaultOpen className="border rounded-md p-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <span className="font-medium">Work and Sleep</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          {/* 16. Work Schedule */}
          <div className="space-y-3">
            <Label htmlFor="workSchedule">16. Work Schedule</Label>
            <Select 
              value={data.workSchedule} 
              onValueChange={(value) => updateData({ workSchedule: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular (9-5 or standard hours)</SelectItem>
                <SelectItem value="shift">Shift Work (rotating or night shifts)</SelectItem>
                <SelectItem value="flexible">Flexible (variable hours)</SelectItem>
                <SelectItem value="remote">Remote/Work from home</SelectItem>
                <SelectItem value="parttime">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 17. Sleep Duration */}
          <div className="space-y-3">
            <Label htmlFor="sleepDuration">17. Sleep Duration (hours per night)</Label>
            <Select 
              value={data.sleepDuration} 
              onValueChange={(value) => updateData({ sleepDuration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sleep duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                <SelectItem value="5-6">5-6 hours</SelectItem>
                <SelectItem value="6-7">6-7 hours</SelectItem>
                <SelectItem value="7-8">7-8 hours</SelectItem>
                <SelectItem value="8-9">8-9 hours</SelectItem>
                <SelectItem value="more-than-9">More than 9 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 18. Sleep Quality */}
          <div className="space-y-3">
            <Label>18. Sleep Quality</Label>
            <RadioGroup
              value={data.sleepQuality}
              onValueChange={(value) => updateData({ sleepQuality: value })}
              className="flex space-x-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="sleep-fair" />
                <Label htmlFor="sleep-fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good</Label>
              </div>
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Stress and Eating Habits */}
      <Collapsible defaultOpen className="border rounded-md p-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <span className="font-medium">Stress and Eating Habits</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          {/* 19. Stress Level */}
          <div className="space-y-3">
            <Label>19. Stress Level</Label>
            <RadioGroup
              value={data.stressLevel}
              onValueChange={(value) => updateData({ stressLevel: value })}
              className="flex space-x-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="stress-low" />
                <Label htmlFor="stress-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="stress-medium" />
                <Label htmlFor="stress-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="stress-high" />
                <Label htmlFor="stress-high">High</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 20. Meal Timing Regularity */}
          <div className="space-y-3">
            <Label>20. Meal Timing Regularity</Label>
            <RadioGroup
              value={data.mealTimingRegularity}
              onValueChange={(value) => updateData({ mealTimingRegularity: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="meal-regular" />
                <Label htmlFor="meal-regular">Regular (consistent meal times)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="irregular" id="meal-irregular" />
                <Label htmlFor="meal-irregular">Irregular (variable meal times)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 28. Snacking Behavior */}
          <div className="space-y-3">
            <Label>28. Snacking Behavior</Label>
            <RadioGroup
              value={data.snackingBehavior}
              onValueChange={(value) => updateData({ snackingBehavior: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="snack-regular" />
                <Label htmlFor="snack-regular">Regular (planned, healthy snacks)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="snack-average" />
                <Label htmlFor="snack-average">Average (mix of planned and unplanned)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="irregular" id="snack-irregular" />
                <Label htmlFor="snack-irregular">Irregular (impulsive, often unhealthy)</Label>
              </div>
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cooking and Food Preparation */}
      <Collapsible defaultOpen className="border rounded-md p-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <span className="font-medium">Cooking and Food Preparation</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          {/* 21. Cooking Skills */}
          <div className="space-y-3">
            <Label>21. Cooking Skills</Label>
            <RadioGroup
              value={data.cookingSkills}
              onValueChange={(value) => updateData({ cookingSkills: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="cooking-basic" />
                <Label htmlFor="cooking-basic">Basic (simple meals, limited techniques)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="cooking-intermediate" />
                <Label htmlFor="cooking-intermediate">Intermediate (comfortable cooking most meals)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="cooking-advanced" />
                <Label htmlFor="cooking-advanced">Advanced (complex recipes, various techniques)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 22. Available Cooking Time */}
          <div className="space-y-3">
            <Label htmlFor="availableCookingTime">22. Available Cooking Time (minutes per day)</Label>
            <Select 
              value={data.availableCookingTime} 
              onValueChange={(value) => updateData({ availableCookingTime: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select available time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-15">Less than 15 minutes</SelectItem>
                <SelectItem value="15-30">15-30 minutes</SelectItem>
                <SelectItem value="30-60">30-60 minutes</SelectItem>
                <SelectItem value="more-than-60">More than 60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 29. Food Preparation Time Availability */}
          <div className="space-y-3">
            <Label>29. Food Preparation Time Availability</Label>
            <RadioGroup
              value={data.foodPrepTimeAvailability}
              onValueChange={(value) => updateData({ foodPrepTimeAvailability: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekends-only" id="prep-weekends" />
                <Label htmlFor="prep-weekends">Weekends only (meal prep once a week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="few-days" id="prep-few-days" />
                <Label htmlFor="prep-few-days">Few days a week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="prep-daily" />
                <Label htmlFor="prep-daily">Daily (can prepare meals each day)</Label>
              </div>
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Lifestyle Habits */}
      <Collapsible defaultOpen className="border rounded-md p-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <span className="font-medium">Lifestyle Habits</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          {/* 23. Food Budget */}
          <div className="space-y-3">
            <Label>23. Food Budget</Label>
            <RadioGroup
              value={data.foodBudget}
              onValueChange={(value) => updateData({ foodBudget: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="budget-low" />
                <Label htmlFor="budget-low">Low (budget-conscious)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="budget-medium" />
                <Label htmlFor="budget-medium">Medium (moderate spending)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="budget-high" />
                <Label htmlFor="budget-high">High (premium ingredients)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 24. Alcohol Consumption */}
          <div className="space-y-3">
            <Label>24. Alcohol Consumption</Label>
            <RadioGroup
              value={data.alcoholConsumption}
              onValueChange={(value) => updateData({ alcoholConsumption: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="alcohol-none" />
                <Label htmlFor="alcohol-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occasional" id="alcohol-occasional" />
                <Label htmlFor="alcohol-occasional">Occasional (few drinks per month)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="alcohol-regular" />
                <Label htmlFor="alcohol-regular">Regular (few drinks per week)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 25. Smoking Status */}
          <div className="space-y-3">
            <Label>25. Smoking Status</Label>
            <RadioGroup
              value={data.smokingStatus}
              onValueChange={(value) => updateData({ smokingStatus: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-smoker" id="smoking-none" />
                <Label htmlFor="smoking-none">Non-smoker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="former" id="smoking-former" />
                <Label htmlFor="smoking-former">Former smoker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="smoker" id="smoking-current" />
                <Label htmlFor="smoking-current">Current smoker</Label>
              </div>
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Other Lifestyle Factors */}
      <Collapsible defaultOpen className="border rounded-md p-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <span className="font-medium">Other Factors</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          {/* 26. Water Intake */}
          <div className="space-y-3">
            <Label>26. Water Intake (glasses per day)</Label>
            <div className="pt-4">
              <Slider
                defaultValue={[8]}
                max={16}
                step={1}
                value={[data.waterIntake ? parseInt(data.waterIntake) : 8]}
                onValueChange={(value) => updateData({ waterIntake: value[0].toString() })}
              />
              <div className="text-center mt-2">
                <span className="text-sm font-medium">{data.waterIntake || "8"} glasses</span>
              </div>
            </div>
          </div>

          {/* 27. Eating Out Frequency */}
          <div className="space-y-3">
            <Label htmlFor="eatingOutFrequency">27. Eating Out Frequency (times per week)</Label>
            <Select 
              value={data.eatingOutFrequency} 
              onValueChange={(value) => updateData({ eatingOutFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Almost never (0 times)</SelectItem>
                <SelectItem value="1-2">Rarely (1-2 times)</SelectItem>
                <SelectItem value="3-5">Sometimes (3-5 times)</SelectItem>
                <SelectItem value="5-7">Often (5-7 times)</SelectItem>
                <SelectItem value="7+">Very often (7+ times)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 30. Travel Frequency */}
          <div className="space-y-3">
            <Label>30. Travel Frequency</Label>
            <RadioGroup
              value={data.travelFrequency}
              onValueChange={(value) => updateData({ travelFrequency: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="travel-rarely" />
                <Label htmlFor="travel-rarely">Rarely (few times a year)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="travel-monthly" />
                <Label htmlFor="travel-monthly">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="travel-weekly" />
                <Label htmlFor="travel-weekly">Weekly</Label>
              </div>
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default LifestyleForm;
