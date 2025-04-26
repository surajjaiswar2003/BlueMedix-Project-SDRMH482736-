
import React, { useEffect } from "react";
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

interface BMIFormData {
  height: string;
  weight: string;
  bmiCategory: string;
  targetWeight: string;
  weightChangeHistory: string;
  "BMI Category"?: string;
}

interface BMIFormProps {
  data: BMIFormData & Record<string, any>;
  updateData: (data: Partial<BMIFormData>) => void;
}

const BMIForm = ({ data, updateData }: BMIFormProps) => {
  // Calculate BMI when height or weight changes
  // In BMIForm.tsx, update the useEffect hook:

  useEffect(() => {
    const height = parseFloat(data.height);
    const weight = parseFloat(data.weight);

    if (height && weight && height > 0) {
      // BMI = weight(kg) / (height(m))^2
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      let category = "";
      let apiCategory = ""; // For the API

      if (bmi < 18.5) {
        category = "underweight";
        apiCategory = "Underweight";
      } else if (bmi >= 18.5 && bmi < 25) {
        category = "normal";
        apiCategory = "Normal";
      } else if (bmi >= 25 && bmi < 30) {
        category = "overweight";
        apiCategory = "Overweight";
      } else if (bmi >= 30) {
        category = "obese";
        apiCategory = "Obese";
      }

      if (category && category !== data.bmiCategory) {
        updateData({
          bmiCategory: category,
          // Add this hidden field for the API
          "BMI Category": apiCategory,
        });
      }
    }
  }, [data.height, data.weight]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Body Measurements & BMI</h3>
        <p className="text-sm text-muted-foreground mb-6">
          These measurements help us calculate your BMI and personalize your
          nutrition plan.
        </p>
      </div>

      {/* 6. Height */}
      <div className="space-y-3">
        <Label htmlFor="height">6. Height (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="e.g., 175"
          value={data.height}
          onChange={(e) => updateData({ height: e.target.value })}
        />
      </div>

      {/* 7. Weight */}
      <div className="space-y-3">
        <Label htmlFor="weight">7. Current Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="e.g., 70"
          value={data.weight}
          onChange={(e) => updateData({ weight: e.target.value })}
        />
      </div>

      {/* 8. BMI Category */}
      <div className="space-y-3">
        <Label htmlFor="bmiCategory">8. BMI Category</Label>
        <Select
          value={data.bmiCategory}
          onValueChange={(value) => updateData({ bmiCategory: value })}
          disabled
        >
          <SelectTrigger>
            <SelectValue placeholder="Calculated from height and weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="underweight">
              Underweight (BMI &lt; 18.5)
            </SelectItem>
            <SelectItem value="normal">Normal (BMI 18.5-24.9)</SelectItem>
            <SelectItem value="overweight">Overweight (BMI 25-29.9)</SelectItem>
            <SelectItem value="obese">Obese (BMI ≥ 30)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This is automatically calculated from your height and weight.
        </p>
      </div>

      {/* 9. Target Weight */}
      <div className="space-y-3">
        <Label htmlFor="targetWeight">9. Target Weight (kg)</Label>
        <Input
          id="targetWeight"
          type="number"
          placeholder="e.g., 65"
          value={data.targetWeight}
          onChange={(e) => updateData({ targetWeight: e.target.value })}
        />
      </div>

      {/* 10. Weight Change History */}
      <div className="space-y-3">
        <Label>10. Weight Change History</Label>
        <RadioGroup
          value={data.weightChangeHistory}
          onValueChange={(value) => updateData({ weightChangeHistory: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stable" id="weight-stable" />
            <Label htmlFor="weight-stable">
              Stable (within ±2 kg in the past year)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradual-loss" id="weight-gradual-loss" />
            <Label htmlFor="weight-gradual-loss">Gradual weight loss</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradual-gain" id="weight-gradual-gain" />
            <Label htmlFor="weight-gradual-gain">Gradual weight gain</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fluctuating" id="weight-fluctuating" />
            <Label htmlFor="weight-fluctuating">
              Fluctuating (significant ups and downs)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default BMIForm;
