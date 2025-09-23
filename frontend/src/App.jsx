import { Navigate, Route, Routes } from "react-router";
import PageLoader from "./components/PageLoader.jsx";
import { 
  HomePage, 
  SignInPage, 
  SignUpPage, 
  NotificationPage, 
  OnboardPage, 
  ChatPage, 
  CallPage 
} from './pages/Index.jsx';

import useAuthUser from "./hooks/useAuthUser.js";


// PREVENTS ACCESS IF ALREADY AUTHENTICATED
const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// RESTRICTS ACCESS IF NOT AUTHENTICATED
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? <Navigate to="/signin" /> : children;
};

const App = () => {
  // Custom hook to fetch currently logged-in user
  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;
  
  if (isLoading) return <PageLoader />; // WAIT UNTIL USER INFO IS READY

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
