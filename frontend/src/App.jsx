import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import OnboardPage from "./pages/OnboardPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";

// Public route wrapper: Prevents access if already authenticated
const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Protected route wrapper: Restricts access if not authenticated
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? <Navigate to="/signin" /> : children;
};

const App = () => {
  // Custom hook to fetch currently logged-in user
  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;
  console.log(isOnboarded);
  
  if (isLoading) return <PageLoader />; // wait until user info is ready

  return (
    
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signin"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <SignInPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          isAuthenticated && isOnboarded ? (
            <HomePage />
          ) : (
            <Navigate to={!isAuthenticated ? "/signin" : "/onboard"} />
          )
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/call"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CallPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* Onboarding Route */}
      <Route
        path="/onboard"
        element={
          isAuthenticated ? (
            !isOnboarded ? <OnboardPage /> : <Navigate to="/" />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
    </Routes>
  );
};

export default App;
