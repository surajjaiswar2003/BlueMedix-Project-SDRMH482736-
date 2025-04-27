import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Utensils,
  ClipboardList,
  Activity,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const DietitianLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dietitianToken');
    localStorage.removeItem('dietitianEmail');
    navigate('/dietitian/login');
  };

  const navItems = [
    { path: '/dietitian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dietitian/patients', icon: Users, label: 'My Patients' },
    { path: '/dietitian/recipes', icon: Utensils, label: 'Recipes' },
    { path: '/dietitian/plans', icon: ClipboardList, label: 'Diet Plans' },
    { path: '/dietitian/reports', icon: Activity, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-bold text-dietGreen">Diet Planner</h1>
            <p className="text-sm text-gray-500">Dietitian Panel</p>
          </div>
          
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 group ${
                      isActive ? 'bg-dietGreen-light text-dietGreen' : 'text-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-dietGreen' : 'text-gray-500'}`} />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="absolute bottom-4 left-0 right-0 px-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DietitianLayout; 