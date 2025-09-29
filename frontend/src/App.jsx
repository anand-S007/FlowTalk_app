import { Navigate, Route, Routes } from "react-router";
import PageLoader from "./components/PageLoader.jsx";
import {
  HomePage,
  SignInPage,
  SignUpPage,
  NotificationPage,
  OnboardPage,
  ChatPage,
  CallPage,
} from "./pages/Index.jsx";

import useAuthUser from "./hooks/useAuthUser.js";

// PUBLIC ROUTE (block if already logged in)
const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// PROTECTED ROUTE (must be logged in + onboarded)
const ProtectedRoute = ({ isAuthenticated, isOnboarded, children }) => {
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!isOnboarded) return <Navigate to="/onboard" replace />;
  return children;
};

// ONBOARD ROUTE (must be logged in + not onboarded)
const OnboardRoute = ({ isAuthenticated, isOnboarded, children }) => {
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!isOnboarded) return children;
  return <Navigate to="/" replace />;
};

const App = () => {
  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;

  if (isLoading) return <PageLoader />; // Wait until user info is ready

  return (
    <Routes>
      {/* SIGNIN ROUTE */}
      <Route
        path="/signin"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <SignInPage />
          </PublicRoute>
        }
      />

      {/* SIGNUP ROUTE */}
      <Route
        path="/signup"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* HOME ROUTE */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isOnboarded={isOnboarded}
          >
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* NOTIFICATION ROUTE */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isOnboarded={isOnboarded}
          >
            <NotificationPage />
          </ProtectedRoute>
        }
      />

      {/* CALL ROUTE */}
      <Route
        path="/call"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isOnboarded={isOnboarded}
          >
            <CallPage />
          </ProtectedRoute>
        }
      />

      {/* CHAT ROUTE */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isOnboarded={isOnboarded}
          >
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* ONBOARD ROUTE */}
      <Route
        path="/onboard"
        element={
          <OnboardRoute
            isAuthenticated={isAuthenticated}
            isOnboarded={isOnboarded}
          >
            <OnboardPage />
          </OnboardRoute>
        }
      />
    </Routes>
  );
};

export default App;
