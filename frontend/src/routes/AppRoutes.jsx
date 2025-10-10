import { Navigate } from "react-router";
import Layout from "../components/Layout.jsx";
import {
  HomePage,
  SignInPage,
  SignUpPage,
  NotificationPage,
  OnboardPage,
  ChatPage,
  CallPage,
} from "../pages/Index.jsx";
import FriendsPage from "../pages/FriendsPage.jsx";

// PUBLIC ROUTE (block if already logged in)
export const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// PROTECTED ROUTE (must be logged in + onboarded)
export const ProtectedRoute = ({ isAuthenticated, isOnboarded, children }) => {
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!isOnboarded) return <Navigate to="/onboard" replace />;
  return children;
};

// ONBOARD ROUTE (must be logged in + not onboarded)
export const OnboardRoute = ({ isAuthenticated, isOnboarded, children }) => {
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!isOnboarded) return children;
  return <Navigate to="/" replace />;
};

// Define routes as objects for clarity and scalability
export const appRoutes = ({ isAuthenticated, isOnboarded }) => [
  {
    path: "/signin",
    element: (
      <PublicRoute isAuthenticated={isAuthenticated}>
        <SignInPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute isAuthenticated={isAuthenticated}>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
        <Layout showSidebar={true}>
          <HomePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
        <Layout showSidebar={true}>
          <NotificationPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path:'/friends',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
        <Layout showSidebar={true}>
          <FriendsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/call/:id",
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
        <CallPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:id",
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
        <Layout showSidebar={false}>
          <ChatPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboard",
    element: (
      <OnboardRoute isAuthenticated={isAuthenticated} isOnboarded={isOnboarded}>
        <OnboardPage />
      </OnboardRoute>
    ),
  },
];
