// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile"

// User pages
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserTrack from "./pages/user/Track";
import UserReports from "./pages/user/Reports";
import UserDietPlan from "./pages/user/DietPlan";
import UserSuggestions from "./pages/user/Suggestions";
import UserChat from "./pages/user/Chat";

// Dietitian pages
import DietitianDashboard from "./pages/dietitian/Dashboard";
import ReviewDietPlanPage from "./pages/dietitian/ReviewDietPlanPage";
import PatientLogsPage from "@/pages/dietitian/patient/PatientLogsPage";
import UserDietPlansPage from "@/pages/dietitian/UserDietPlansPage";
import ApprovedDietPlanPage from "@/pages/dietitian/ApprovedDietPlanPage";
import TrackUsersPage from "@/pages/dietitian/TrackUsersPage";
// import DietitianUsers from "./pages/dietitian/Users";
// import DietitianPlans from "./pages/dietitian/Plans";
// import DietitianLogs from "./pages/dietitian/Logs";
// import DietitianInsights from "./pages/dietitian/Insights";
// import DietitianApprove from "./pages/dietitian/Approve";
// import DietitianFeedback from "./pages/dietitian/Feedback";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import AdminUsers from "./pages/admin/Users";
import AdminRecipes from "./pages/admin/Recipes";
// import AdminUpload from "./pages/admin/Upload";
// import AdminModel from "./pages/admin/Model";
// import AdminLogs from "./pages/admin/Logs";
// import AdminFeedback from "./pages/admin/Feedback";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* User routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/track" element={<UserTrack />} />
        <Route path="/user/reports" element={<UserReports />} />
        <Route path="/user/diet-plan" element={<UserDietPlan />} />
        <Route path="/user/suggestions" element={<UserSuggestions />} />
        <Route path="/user/chat" element={<UserChat />} />

        {/* Dietitian routes */}
        <Route path="/dietitian/dashboard" element={<DietitianDashboard />} />
        <Route
          path="/dietitian/review/:dietPlanId"
          element={<ReviewDietPlanPage />}
        />
        <Route
          path="/dietitian/patient/:id/logs"
          element={<PatientLogsPage />}
        />
        <Route
          path="/dietitian/user-diet-plans"
          element={<UserDietPlansPage />}
        />
        <Route
          path="/dietitian/approved-plan/:id"
          element={<ApprovedDietPlanPage />}
        />
        <Route path="/dietitian/track-users" element={<TrackUsersPage />} />
        {/* <Route path="/dietitian/users" element={<DietitianUsers />} />
        <Route path="/dietitian/plans" element={<DietitianPlans />} />
        <Route path="/dietitian/logs" element={<DietitianLogs />} />
        <Route path="/dietitian/insights" element={<DietitianInsights />} />
        <Route path="/dietitian/approve" element={<DietitianApprove />} />
        <Route path="/dietitian/feedback" element={<DietitianFeedback />} /> */}

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/Login" element={<AdminLogin />} />
        <Route path="/admin/recipes" element={<AdminRecipes />} />
        {/* <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/model" element={<AdminModel />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} /> */}

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
