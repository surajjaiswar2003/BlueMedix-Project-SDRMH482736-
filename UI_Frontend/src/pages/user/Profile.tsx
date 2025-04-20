import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Mail, Phone, MapPin, Calendar, Shield, Heart, Activity, Droplet, Scale, Ruler, Pill, Apple, Dumbbell, Sun, Moon, Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  profileImage?: string;
  gender?: string;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  allergies?: string[];
  medications?: string[];
  dietaryPreferences?: string[];
  activityLevel?: string;
  sleepSchedule?: {
    bedtime: string;
    wakeupTime: string;
  };
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      setEditedData(parsedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user data
    setUserData(prev => prev ? { ...prev, ...editedData } : null);
    setIsEditing(false);
    // Update localStorage
    localStorage.setItem("user", JSON.stringify({ ...userData, ...editedData }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditedData(prev => ({ ...prev, profileImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image and Basic Info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={editedData.profileImage || userData.profileImage} />
                  <AvatarFallback>
                    {userData.firstName[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        name="firstName"
                        value={editedData.firstName}
                        onChange={handleInputChange}
                        className="text-center"
                      />
                      <Input
                        name="lastName"
                        value={editedData.lastName}
                        onChange={handleInputChange}
                        className="text-center"
                      />
                    </div>
                  ) : (
                    `${userData.firstName} ${userData.lastName}`
                  )}
                </h2>
                <p className="text-sm text-gray-500 flex items-center justify-center mt-2">
                  <Shield className="h-4 w-4 mr-1" />
                  ID: {userData._id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{userData.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{userData.phone || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={editedData.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{userData.address || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date of Birth
                </Label>
                {isEditing ? (
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={editedData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{userData.dateOfBirth || "Not provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Scale className="h-4 w-4 mr-2" />
                  Weight (kg)
                </Label>
                {isEditing ? (
                  <Input
                    name="weight"
                    type="number"
                    value={editedData.weight}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{userData.weight || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2" />
                  Height (cm)
                </Label>
                {isEditing ? (
                  <Input
                    name="height"
                    type="number"
                    value={editedData.height}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-700">{userData.height || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Droplet className="h-4 w-4 mr-2" />
                  Blood Group
                </Label>
                {isEditing ? (
                  <Select
                    value={editedData.bloodGroup}
                    onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-700">{userData.bloodGroup || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label className="flex items-center">
                  <Pill className="h-4 w-4 mr-2" />
                  Medications
                </Label>
                {isEditing ? (
                  <Input
                    name="medications"
                    value={editedData.medications?.join(", ")}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      medications: e.target.value.split(",").map(m => m.trim())
                    }))}
                    placeholder="Enter medications separated by commas"
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.medications?.join(", ") || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Allergies
                </Label>
                {isEditing ? (
                  <Input
                    name="allergies"
                    value={editedData.allergies?.join(", ")}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      allergies: e.target.value.split(",").map(a => a.trim())
                    }))}
                    placeholder="Enter allergies separated by commas"
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.allergies?.join(", ") || "Not provided"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Preferences */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Lifestyle Preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Apple className="h-4 w-4 mr-2" />
                  Dietary Preferences
                </Label>
                {isEditing ? (
                  <Select
                    value={editedData.dietaryPreferences?.[0]}
                    onValueChange={(value) => setEditedData(prev => ({
                      ...prev,
                      dietaryPreferences: [value]
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dietary preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="omnivore">Omnivore</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-700">
                    {userData.dietaryPreferences?.[0] || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Activity Level
                </Label>
                {isEditing ? (
                  <Select
                    value={editedData.activityLevel}
                    onValueChange={(value) => handleSelectChange("activityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Lightly Active</SelectItem>
                      <SelectItem value="moderate">Moderately Active</SelectItem>
                      <SelectItem value="very">Very Active</SelectItem>
                      <SelectItem value="extra">Extra Active</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-700">{userData.activityLevel || "Not provided"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Sun className="h-4 w-4 mr-2" />
                  Bedtime
                </Label>
                {isEditing ? (
                  <Input
                    type="time"
                    value={editedData.sleepSchedule?.bedtime}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      sleepSchedule: {
                        ...prev.sleepSchedule,
                        bedtime: e.target.value
                      }
                    }))}
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.sleepSchedule?.bedtime || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Wake-up Time
                </Label>
                {isEditing ? (
                  <Input
                    type="time"
                    value={editedData.sleepSchedule?.wakeupTime}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      sleepSchedule: {
                        ...prev.sleepSchedule,
                        wakeupTime: e.target.value
                      }
                    }))}
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.sleepSchedule?.wakeupTime || "Not provided"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Notifications
                </Label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedData.notificationPreferences?.email}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        email: e.target.checked
                      }
                    }))}
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.notificationPreferences?.email ? "Enabled" : "Disabled"}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Label className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  SMS Notifications
                </Label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedData.notificationPreferences?.sms}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        sms: e.target.checked
                      }
                    }))}
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.notificationPreferences?.sms ? "Enabled" : "Disabled"}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Label className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Push Notifications
                </Label>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedData.notificationPreferences?.push}
                    onChange={(e) => setEditedData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        push: e.target.checked
                      }
                    }))}
                  />
                ) : (
                  <p className="text-gray-700">
                    {userData.notificationPreferences?.push ? "Enabled" : "Disabled"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile; 