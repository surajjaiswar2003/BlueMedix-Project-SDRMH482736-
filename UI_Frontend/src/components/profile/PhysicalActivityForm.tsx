
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface PhysicalActivityFormData {
  exerciseFrequency: string;
  exerciseDuration: string;
  exerciseType: string;
  dailyStepsCount: string;
  physicalJobActivityLevel: string;
}

interface PhysicalActivityFormProps {
  data: PhysicalActivityFormData & Record<string, any>;
  updateData: (data: Partial<PhysicalActivityFormData>) => void;
}

const PhysicalActivityForm: React.FC<PhysicalActivityFormProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Physical Activity</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your activity level helps us determine your caloric needs and tailor your meal plan.
        </p>
      </div>

      {/* 11. Exercise Frequency */}
      <div className="space-y-3">
        <Label htmlFor="exerciseFrequency">11. Exercise Frequency (days per week)</Label>
        <Select 
          value={data.exerciseFrequency} 
          onValueChange={(value) => updateData({ exerciseFrequency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 days</SelectItem>
            <SelectItem value="1">1 day</SelectItem>
            <SelectItem value="2">2 days</SelectItem>
            <SelectItem value="3">3 days</SelectItem>
            <SelectItem value="4">4 days</SelectItem>
            <SelectItem value="5">5 days</SelectItem>
            <SelectItem value="6">6 days</SelectItem>
            <SelectItem value="7">7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 12. Exercise Duration */}
      <div className="space-y-3">
        <Label htmlFor="exerciseDuration">12. Exercise Duration (minutes per session)</Label>
        <Input
          id="exerciseDuration"
          type="number"
          placeholder="e.g., 30"
          value={data.exerciseDuration}
          onChange={(e) => updateData({ exerciseDuration: e.target.value })}
        />
      </div>

      {/* 13. Exercise Type */}
      <div className="space-y-3">
        <Label htmlFor="exerciseType">13. Exercise Type</Label>
        <Select 
          value={data.exerciseType} 
          onValueChange={(value) => updateData({ exerciseType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exercise type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="cardio">Cardio (running, cycling, swimming)</SelectItem>
            <SelectItem value="strength">Strength Training</SelectItem>
            <SelectItem value="mixed">Mixed (cardio and strength)</SelectItem>
            <SelectItem value="yoga">Yoga/Pilates</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="walking">Walking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 14. Daily Steps Count */}
      <div className="space-y-3">
        <Label>14. Daily Steps Count (approximation)</Label>
        <div className="pt-4">
          <Slider
            defaultValue={[5000]}
            max={20000}
            step={1000}
            value={[data.dailyStepsCount ? parseInt(data.dailyStepsCount) : 5000]}
            onValueChange={(value) => updateData({ dailyStepsCount: value[0].toString() })}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Sedentary (&lt;5K)</span>
            <span className="text-xs text-muted-foreground">Moderate (5K-10K)</span>
            <span className="text-xs text-muted-foreground">Active (&gt;10K)</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm font-medium">{data.dailyStepsCount || "5000"} steps</span>
          </div>
        </div>
      </div>

      {/* 15. Physical Job Activity Level */}
      <div className="space-y-3">
        <Label>15. Physical Job Activity Level</Label>
        <RadioGroup
          value={data.physicalJobActivityLevel}
          onValueChange={(value) => updateData({ physicalJobActivityLevel: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sedentary" id="job-sedentary" />
            <Label htmlFor="job-sedentary">Sedentary (desk job, little movement)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="job-moderate" />
            <Label htmlFor="job-moderate">Moderate (some walking, standing)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="job-active" />
            <Label htmlFor="job-active">Active (physical labor, constant movement)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PhysicalActivityForm;
