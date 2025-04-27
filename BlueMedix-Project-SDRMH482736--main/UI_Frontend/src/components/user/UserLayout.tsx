import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Pill,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/user/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/user/records", icon: FileText, label: "Medical Records" },
    { path: "/user/reports", icon: ClipboardList, label: "Reports" },
    { path: "/user/diet-plan", icon: Calendar, label: "Diet Plan" },
    { path: "/user/medicines", icon: Pill, label: "Medicines" },
    { path: "/user/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-emerald-600">HealthHub</h2>
            <p className="text-sm text-gray-500">User Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default UserLayout; 