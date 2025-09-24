// import { Navigate, Route, Routes } from "react-router";
// import PageLoader from "./components/PageLoader.jsx";
// import { 
//   HomePage, 
//   SignInPage, 
//   SignUpPage, 
//   NotificationPage, 
//   OnboardPage, 
//   ChatPage, 
//   CallPage 
// } from './pages/Index.jsx';

// import useAuthUser from "./hooks/useAuthUser.js";


// // PREVENTS ACCESS IF ALREADY AUTHENTICATED
// const PublicRoute = ({ isAuthenticated, children }) => {
//   return isAuthenticated ? <Navigate to="/" /> : children;
// };

// // RESTRICTS ACCESS IF NOT AUTHENTICATED
// const ProtectedRoute = ({ isAuthenticated, children }) => {
//   return !isAuthenticated ? <Navigate to="/signin" /> : children;
// };

// const App = () => {
//   // Custom hook to fetch currently logged-in user
//   const { authUser, isLoading } = useAuthUser();

//   const isAuthenticated = Boolean(authUser);
//   const isOnboarded = authUser?.isOnBoarded;
  
//   if (isLoading) return <PageLoader />; // WAIT UNTIL USER INFO IS READY

//   return (
    
//     <Routes>
//       {/* Public Routes */}
//       <Route
//         path="/signin"
//         element={
//           <PublicRoute isAuthenticated={isAuthenticated}>
//             <SignInPage />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/signup"
//         element={
//           <PublicRoute isAuthenticated={isAuthenticated}>
//             <SignUpPage />
//           </PublicRoute>
//         }
//       />

//       {/* Protected Routes */}
//       <Route
//         path="/"
//         element={
//           isAuthenticated && isOnboarded ? (
//             <HomePage />
//           ) : (
//             <Navigate to={!isAuthenticated ? "/signin" : "/onboard"} />
//           )
//         }
//       />
//       <Route
//         path="/notifications"
//         element={
//           <ProtectedRoute isAuthenticated={isAuthenticated}>
//             <NotificationPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/call"
//         element={
//           <ProtectedRoute isAuthenticated={isAuthenticated}>
//             <CallPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/chat"
//         element={
//           <ProtectedRoute isAuthenticated={isAuthenticated}>
//             <ChatPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Onboarding Route */}
//       <Route
//         path="/onboard"
//         element={
//           isAuthenticated ? (
//             !isOnboarded ? <OnboardPage /> : <Navigate to="/" />
//           ) : (
//             <Navigate to="/signin" />
//           )
//         }
//       />
//     </Routes>
//   );
// };

// export default App;


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

/* -------------------------------------------
   Route Guards
-------------------------------------------- */

// Prevent access if already authenticated
const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// Restrict access if not authenticated
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return !isAuthenticated ? <Navigate to="/signin" replace /> : children;
};

// Force onboarding if authenticated but not onboarded
const OnboardRoute = ({ isAuthenticated, isOnboarded, children }) => {
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (!isOnboarded) return children; // show onboarding page
  return <Navigate to="/" replace />;
};

/* -------------------------------------------
   Main App
-------------------------------------------- */
const App = () => {
  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;

  if (isLoading) return <PageLoader />; // Wait until user info is ready

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

      {/* Protected Routes (must be logged in) */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            {isOnboarded ? <HomePage /> : <Navigate to="/onboard" replace />}
          </ProtectedRoute>
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

