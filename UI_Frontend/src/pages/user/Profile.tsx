import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  profileImage?: string;
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile; 