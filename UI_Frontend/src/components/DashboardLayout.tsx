// components/DashboardLayout.tsx
import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole: "user" | "dietitian" | "admin";
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  adminLevel?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  requiredRole,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user data in localStorage
    const user = localStorage.getItem("user");
    const dietitian = localStorage.getItem("dietitian");
    const admin = localStorage.getItem("admin");

    if (user) {
      setUserData(JSON.parse(user));
      setUserType("user");
      setIsAuthorized(requiredRole === "user");
    } else if (dietitian) {
      setUserData(JSON.parse(dietitian));
      setUserType("dietitian");
      setIsAuthorized(requiredRole === "dietitian");
    } else if (admin) {
      setUserData(JSON.parse(admin));
      setUserType("admin");
      setIsAuthorized(requiredRole === "admin");
    } else {
      // No user logged in, redirect to login
      navigate("/login");
    }

    setIsLoading(false);
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dietGreen"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-6">
          {userData && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {userData.firstName}!
              </h1>
              <p className="text-gray-500">
                {userType === "user" && "Here's your health summary"}
                {userType === "dietitian" && "Here's your dietitian overview"}
                {userType === "admin" && "Here's your system overview"}
              </p>
            </div>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
