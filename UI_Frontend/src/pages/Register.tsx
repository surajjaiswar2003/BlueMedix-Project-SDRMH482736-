import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "user", // Default to user
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleUserTypeChange = (value: string) => {
    setFormData({ ...formData, userType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage based on user type
        if (formData.userType === "dietitian") {
          localStorage.setItem("dietitian", JSON.stringify(data));
          toast.success("Registration successful!");
          navigate("/dietitian/dashboard");
        } else {
          localStorage.setItem("user", JSON.stringify(data));
          toast.success("Registration successful!");
          navigate("/user/dashboard");
        }
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="user"
                className="w-full mb-6"
                onValueChange={handleUserTypeChange}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">Register as User</TabsTrigger>
                  <TabsTrigger value="dietitian">
                    Register as Dietitian
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Create an account to get personalized nutrition advice and
                    diet plans.
                  </p>
                </TabsContent>
                <TabsContent value="dietitian">
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Join as a dietitian to help users with professional
                    nutrition guidance.
                  </p>
                </TabsContent>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-dietBlue hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
