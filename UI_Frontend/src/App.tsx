import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Recipes from "./pages/admin/Recipes";
import Plans from "./pages/admin/Plans";
import Dietitians from "./pages/admin/Dietitians";
import Approvals from "./pages/admin/Approvals";
import DietitianLogin from "./pages/dietitian/Login";
import DietitianLayout from "./components/dietitian/DietitianLayout";
import DietitianDashboard from "./pages/dietitian/Dashboard";
import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/user/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Routes */}
          <Route path="/user" element={<UserLayout><Outlet /></UserLayout>}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="records" element={<div>Medical Records Page</div>} />
            <Route path="reports" element={<div>Reports Page</div>} />
            <Route path="diet-plan" element={<div>Diet Plan Page</div>} />
            <Route path="medicines" element={<div>Medicines Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="plans" element={<Plans />} />
            <Route path="dietitians" element={<Dietitians />} />
            <Route path="approvals" element={<Approvals />} />
          </Route>

          {/* Dietitian Routes */}
          <Route path="/dietitian/login" element={<DietitianLogin />} />
          <Route path="/dietitian" element={<DietitianLayout><Outlet /></DietitianLayout>}>
            <Route path="dashboard" element={<DietitianDashboard />} />
            <Route path="patients" element={<div>Patients Page</div>} />
            <Route path="recipes" element={<div>Recipes Page</div>} />
            <Route path="plans" element={<div>Plans Page</div>} />
            <Route path="reports" element={<div>Reports Page</div>} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
