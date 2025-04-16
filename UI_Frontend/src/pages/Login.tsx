
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
import { toast } from "sonner";
import AnimatedGradient from "@/components/ui/animated-gradient";
import { motion } from "framer-motion";

// Temporary credentials
const TEMP_CREDENTIALS = {
  user: { email: "user@example.com", password: "password123" },
  dietitian: { email: "dietitian@example.com", password: "password123" },
  admin: { email: "admin@example.com", password: "password123" }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      if (
        (email === TEMP_CREDENTIALS.user.email && password === TEMP_CREDENTIALS.user.password) ||
        (email === TEMP_CREDENTIALS.dietitian.email && password === TEMP_CREDENTIALS.dietitian.password) ||
        (email === TEMP_CREDENTIALS.admin.email && password === TEMP_CREDENTIALS.admin.password)
      ) {
        toast.success("Login successful!");
        navigate("/profile");
      } else {
        toast.error("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const fillTestCredentials = (role: 'user' | 'dietitian' | 'admin') => {
    setEmail(TEMP_CREDENTIALS[role].email);
    setPassword(TEMP_CREDENTIALS[role].password);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedGradient className="opacity-10" />
      <Navbar />
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Log in</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="yourname@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-dietBlue hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </form>
                
                <div className="mt-6">
                  <p className="text-sm text-center mb-2">Temporary test accounts:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fillTestCredentials('user')}
                      className="text-xs"
                    >
                      User
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fillTestCredentials('dietitian')}
                      className="text-xs"
                    >
                      Dietitian
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fillTestCredentials('admin')}
                      className="text-xs"
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-dietBlue hover:underline">
                    Create an account
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
