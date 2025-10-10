import { Routes, Route } from "react-router";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { appRoutes } from "./routes/AppRoutes.jsx";

const App = () => {
  const { authUser, isLoading } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-full" data-theme={theme}>
      <Routes>
        {appRoutes({ isAuthenticated, isOnboarded }).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
