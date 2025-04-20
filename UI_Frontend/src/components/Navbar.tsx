// components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  FileText,
  Activity,
  BarChart2,
  Clipboard,
  MessageSquare,
  Coffee,
  Users,
  Database,
  Upload,
  Settings,
  AlertTriangle,
  List,
} from "lucide-react";

// Define types for user data
interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  adminLevel?: string;
}

// Define types for navigation links
interface NavLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for user data in localStorage
    const user = localStorage.getItem("user");
    const dietitian = localStorage.getItem("dietitian");
    const admin = localStorage.getItem("admin");

    if (user) {
      setUserData(JSON.parse(user));
      setUserType("user");
    } else if (dietitian) {
      setUserData(JSON.parse(dietitian));
      setUserType("dietitian");
    } else if (admin) {
      setUserData(JSON.parse(admin));
      setUserType("admin");
    }
  }, []);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = (): void => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("dietitian");
    localStorage.removeItem("admin");

    // Reset state
    setUserData(null);
    setUserType("");

    // Redirect to login page
    navigate("/login");

    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  // Define navigation links based on user role
  const getNavLinks = (): NavLink[] => {
    if (userType === "user") {
      return [
        {
          name: "Home",
          path: "/user/dashboard",
          icon: <Home className="h-4 w-4 mr-2" />,
        },
        {
          name: "My Profile",
          path: "/user/profile",
          icon: <User className="h-4 w-4 mr-2" />,
        },
        {
          name: "Track My Health",
          path: "/user/track",
          icon: <Activity className="h-4 w-4 mr-2" />,
        },
        {
          name: "Progress Reports",
          path: "/user/reports",
          icon: <BarChart2 className="h-4 w-4 mr-2" />,
        },
        {
          name: "My Diet Plan",
          path: "/user/diet-plan",
          icon: <Clipboard className="h-4 w-4 mr-2" />,
        },
        {
          name: "Suggestions",
          path: "/user/suggestions",
          icon: <Coffee className="h-4 w-4 mr-2" />,
        },
        {
          name: "Chat with Dietitian",
          path: "/user/chat",
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
        },
      ];
    } else if (userType === "dietitian") {
      return [
        {
          name: "Home",
          path: "/dietitian/dashboard",
          icon: <Home className="h-4 w-4 mr-2" />,
        },
        {
          name: "User Management",
          path: "/dietitian/users",
          icon: <Users className="h-4 w-4 mr-2" />,
        },
        {
          name: "Review Diet Plans",
          path: "/dietitian/plans",
          icon: <Clipboard className="h-4 w-4 mr-2" />,
        },
        {
          name: "View Logs",
          path: "/dietitian/logs",
          icon: <FileText className="h-4 w-4 mr-2" />,
        },
        {
          name: "Insights Panel",
          path: "/dietitian/insights",
          icon: <BarChart2 className="h-4 w-4 mr-2" />,
        },
        {
          name: "Approve Plans",
          path: "/dietitian/approve",
          icon: <Activity className="h-4 w-4 mr-2" />,
        },
        {
          name: "Feedback History",
          path: "/dietitian/feedback",
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
        },
      ];
    } else if (userType === "admin") {
      return [
        {
          name: "Home",
          path: "/admin/dashboard",
          icon: <Home className="h-4 w-4 mr-2" />,
        },
        {
          name: "User Access",
          path: "/admin/users",
          icon: <Users className="h-4 w-4 mr-2" />,
        },
        {
          name: "Recipe Database",
          path: "/admin/recipes",
          icon: <Database className="h-4 w-4 mr-2" />,
        },
        {
          name: "Upload Dataset",
          path: "/admin/upload",
          icon: <Upload className="h-4 w-4 mr-2" />,
        },
        {
          name: "Model Management",
          path: "/admin/model",
          icon: <Settings className="h-4 w-4 mr-2" />,
        },
        {
          name: "Logs & Reports",
          path: "/admin/logs",
          icon: <List className="h-4 w-4 mr-2" />,
        },
        {
          name: "Feedback",
          path: "/admin/feedback",
          icon: <AlertTriangle className="h-4 w-4 mr-2" />,
        },
      ];
    }
    return [
      { name: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
      {
        name: "About",
        path: "/about",
        icon: <FileText className="h-4 w-4 mr-2" />,
      },
      {
        name: "Features",
        path: "/features",
        icon: <List className="h-4 w-4 mr-2" />,
      },
    ];
  };

  const navLinks = getNavLinks();

  // Check if the current path matches a nav link
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-dietGreen">MyDietDiary</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-dietGreen/10 text-dietGreen"
                  : "text-foreground hover:text-dietGreen hover:bg-dietGreen/5"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {/* Authentication Buttons or User Profile */}
          {userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-4 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>
                    {userData.firstName} {userData.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {userData.firstName} {userData.lastName}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {userData.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/${userType}/profile`)}
                >
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {/* User Info (if logged in) */}
            {userData && (
              <div className="border-b pb-4 mb-2">
                <p className="font-medium">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            )}

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-dietGreen/10 text-dietGreen"
                    : "text-foreground hover:text-dietGreen hover:bg-dietGreen/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {/* Authentication Buttons */}
            {userData ? (
              <Button
                variant="outline"
                className="mt-4 w-full justify-start text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
