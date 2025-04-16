
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

interface HealthFormData {
  diabetes: string;
  hypertension: string;
  cardiovascular: string;
  digestiveDisorders: string;
  foodAllergies: string[];
}

interface HealthConditionsFormProps {
  data: HealthFormData & Record<string, any>;
  updateData: (data: Partial<HealthFormData>) => void;
}

const HealthConditionsForm: React.FC<HealthConditionsFormProps> = ({ data, updateData }) => {
  const allergyOptions = [
    { id: "nuts", label: "Nuts" },
    { id: "dairy", label: "Dairy" },
    { id: "shellfish", label: "Shellfish" },
    { id: "eggs", label: "Eggs" },
    { id: "soy", label: "Soy" },
    { id: "wheat", label: "Wheat" },
    { id: "fish", label: "Fish" },
  ];

  const handleAllergyChange = (id: string, checked: boolean) => {
    if (checked) {
      updateData({
        foodAllergies: [...data.foodAllergies, id],
      });
    } else {
      updateData({
        foodAllergies: data.foodAllergies.filter(item => item !== id),
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Health Conditions</h3>
        <p className="text-sm text-muted-foreground mb-6">
          We'll use this information to customize your dietary recommendations.
        </p>
      </div>

      {/* 1. Diabetes */}
      <div className="space-y-3">
        <Label htmlFor="diabetes">1. Diabetes Status</Label>
        <Select 
          value={data.diabetes} 
          onValueChange={(value) => updateData({ diabetes: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select diabetes status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="type1">Type 1</SelectItem>
            <SelectItem value="type2">Type 2</SelectItem>
            <SelectItem value="prediabetes">Pre-diabetes</SelectItem>
            <SelectItem value="gestational">Gestational</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 2. Hypertension */}
      <div className="space-y-3">
        <Label>2. Hypertension (High Blood Pressure)</Label>
        <RadioGroup
          value={data.hypertension}
          onValueChange={(value) => updateData({ hypertension: value })}
          className="flex space-x-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hypertension-yes" />
            <Label htmlFor="hypertension-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hypertension-no" />
            <Label htmlFor="hypertension-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 3. Cardiovascular */}
      <div className="space-y-3">
        <Label>3. Cardiovascular Conditions</Label>
        <RadioGroup
          value={data.cardiovascular}
          onValueChange={(value) => updateData({ cardiovascular: value })}
          className="flex space-x-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="present" id="cardio-present" />
            <Label htmlFor="cardio-present">Present</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="absent" id="cardio-absent" />
            <Label htmlFor="cardio-absent">Absent</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 4. Digestive Disorders */}
      <div className="space-y-3">
        <Label htmlFor="digestiveDisorders">4. Digestive Disorders</Label>
        <Select 
          value={data.digestiveDisorders} 
          onValueChange={(value) => updateData({ digestiveDisorders: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select digestive disorder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="ibs">IBS (Irritable Bowel Syndrome)</SelectItem>
            <SelectItem value="celiac">Celiac Disease</SelectItem>
            <SelectItem value="crohns">Crohn's Disease</SelectItem>
            <SelectItem value="ulcerative-colitis">Ulcerative Colitis</SelectItem>
            <SelectItem value="gerd">GERD (Gastroesophageal Reflux Disease)</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 5. Food Allergies */}
      <div className="space-y-3">
        <Label>5. Food Allergies</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {allergyOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`allergy-${option.id}`} 
                checked={data.foodAllergies.includes(option.id)}
                onCheckedChange={(checked) => 
                  handleAllergyChange(option.id, checked === true)
                }
              />
              <Label htmlFor={`allergy-${option.id}`}>{option.label}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allergy-none" 
              checked={data.foodAllergies.includes("none")}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateData({ foodAllergies: ["none"] });
                } else {
                  updateData({ foodAllergies: [] });
                }
              }}
            />
            <Label htmlFor="allergy-none">None</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthConditionsForm;
