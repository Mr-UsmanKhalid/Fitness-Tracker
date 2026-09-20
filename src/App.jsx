import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLoggedInUser } from "./redux/slices/authSlice";

// Landing & Auth Pages
import LandingPage from "./pages/landing/main";
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

// Dashboard & Protected Pages
import Dashboard from './pages/Dashboard.jsx';

// Workouts
import Workouts from './pages/workouts/Workouts'
import CreateWorkout from './pages/workouts/CreateWorkout';
import EditWorkout from './pages/workouts/EditWorkout';
import WorkoutDetails from './pages/workouts/WorkoutDetails';

// Nutrition
import Nutrition from './pages/nutrition/Nutrition';
import AddMeal from './pages/nutrition/AddMeal';
import EditMeal from './pages/nutrition/EditMeal';
import NutritionDetails from './pages/nutrition/NutritionDetails';

// Progress
import Progress from './pages/progress/Progress';
import AddProgress from './pages/progress/AddProgress';
import ProgressDetails from './pages/progress/ProgressDetails'

// Analytics
import Analytics from "./pages/Analytics.jsx";

// Search, Reports, Notifications
import Search from './pages/Search.jsx';
import Reports from './pages/Reports.jsx';
import Notifications from './pages/Notifications.jsx';


// Settings, Support, Profile
import Settings from './pages/Settings.jsx';
import Support from './pages/Support.jsx';
import Profile from './pages/Profile.jsx';



import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import AuthDialogHost from './components/common/AuthDialogHost';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getLoggedInUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ========== PROTECTED ROUTES ========== */}
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/*================ Workouts ================ */}
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Layout>
                <Workouts />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateWorkout />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EditWorkout />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <WorkoutDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ========================== Nutrition ========================== */}
        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <Layout>
              <Nutrition />  
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/add"
          element={
            <ProtectedRoute>
              <Layout>
                < AddMeal />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EditMeal  />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <NutritionDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/*=============================== Progress ============================*/}
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Layout>
                 <Progress />  
              </Layout>
            </ProtectedRoute>
          }
        />


         <Route
          path="/progress/add"
          element={
            <ProtectedRoute>
              <Layout>
                < AddProgress  />
              </Layout>
            </ProtectedRoute>
          }
        />

         <Route
          path="/progress/:id"
          element={
            <ProtectedRoute>
              <Layout>
                < ProgressDetails  />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ============================ Analytics ==================================== */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
               <Analytics />  
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ============================ Search ==================================== */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Layout>
                <Search />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ============================ Reports ==================================== */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ============================ Notifications ==================================== */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />  
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                  <Settings />  
              </Layout>
            </ProtectedRoute>
          }
        /> 

         {/* Support  */}
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Layout>
                  <Support />  
              </Layout>
            </ProtectedRoute>
          }
        /> 
      </Routes>


       <AuthDialogHost />
    </BrowserRouter>
  );
}

export default App;