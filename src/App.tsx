// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuth, AuthProvider } from "./AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import SelectionDetailPage from "./pages/SelectionDetailPage/SelectionDetailPage";
import CreateSelectionPage from "./pages/CreateSelectionPage";
import EditSelectionPage from "./pages/EditSelectionPage";
import SelectionsTable from "./pages/AdminSelectionsPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import RealtorSettingsPage from "./pages/RealtorSettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SelectionsList from "./pages/SelectionsList";
import CreateSelection from "./pages/CreateSelectionPage";
import SelectionDetail from "./pages/SelectionDetail";
import AgencyPropertiesPage from "./pages/AgencyPropertiesPage";
import EstateDetailsPage from "./pages/EstateDetailsPage";
import RealtorDetailPage from "./pages/RealtorDetailPage/RealtorDetailPage";
import RealtorsPage from "./pages/RealtorsPage";

/* -------------------------------------------------------------------------- */
/*                                ProtectedRoute                              */
/* -------------------------------------------------------------------------- */
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles?.length) {
    const userRoleNames = user.roles?.map((r: any) => r.name) ?? [];
    const hasAccess = roles.some((r) => userRoleNames.includes(r));
    if (!hasAccess) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/* -------------------------------------------------------------------------- */
/*                                    Layout                                  */
/* -------------------------------------------------------------------------- */
const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="pt-16 bg-gray-50 min-h-screen w-full">
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </div>
  </main>
);

/* -------------------------------------------------------------------------- */
/*                                 Route Config                               */
/* -------------------------------------------------------------------------- */
const routes = [
  // === Public routes (no sidebar)
  { path: "/login", element: <LoginPage />, layout: "none" },
  { path: "/register", element: <RegisterPage />, layout: "none" },

  // === Public routes (with sidebar)
  { path: "/", element: <HomePage />, layout: "sidebar" },
  {
    path: "/selections/:id",
    element: <SelectionDetailPage />,
    layout: "sidebar",
  },
  { path: "/estate/:id", element: <EstateDetailsPage />, layout: "sidebar" },
  { path: "/realtors", element: <RealtorsPage />, layout: "sidebar" },
  { path: "/realtors/:id", element: <RealtorDetailPage />, layout: "sidebar" },
  {
    path: "/agency-properties",
    element: <AgencyPropertiesPage />,
    layout: "sidebar",
  },
  {
    path: "/premium",
    element: (
      <div className="py-8">
        <h1 className="text-2xl font-bold text-center">Премиум объекты</h1>
      </div>
    ),
    layout: "sidebar",
  },

  // === Protected routes
  {
    path: "/edit-selection/:id",
    element: <EditSelectionPage />,
    layout: "sidebar",
    protected: true,
  },
  {
    path: "/add-selection",
    element: <CreateSelectionPage />,
    layout: "sidebar",
    protected: true,
  },
  {
    path: "/selections",
    element: <SelectionsTable />,
    layout: "sidebar",
    protected: true,
  },
  {
    path: "/edit-property/:id",
    element: <EditPropertyPage />,
    layout: "sidebar",
    protected: true,
    roles: ["admin", "realtor"],
  },
  {
    path: "/add-property",
    element: <AddPropertyPage />,
    layout: "sidebar",
    protected: true,
    roles: ["admin", "realtor"],
  },
  {
    path: "/my-properties",
    element: <MyPropertiesPage />,
    layout: "sidebar",
    protected: true,
    roles: ["admin", "realtor"],
  },
  {
    path: "/my-settings",
    element: <RealtorSettingsPage />,
    layout: "sidebar",
    protected: true,
    roles: ["admin", "realtor"],
  },
  {
    path: "/statistics",
    element: <AnalyticsPage />,
    layout: "sidebar",
    protected: true,
    roles: ["admin", "realtor"],
  },
  {
    path: "/selections",
    element: <SelectionsList />,
    layout: "sidebar",
    protected: true,
  },
  {
    path: "/selections/create",
    element: <CreateSelection />,
    layout: "sidebar",
    protected: true,
  },
  {
    path: "/selections/:id",
    element: <SelectionDetail />,
    layout: "sidebar",
    protected: true,
  },

  // === Fallback
  { path: "*", element: <NotFoundPage />, layout: "sidebar" },
];

/* -------------------------------------------------------------------------- */
/*                               AppContent Router                            */
/* -------------------------------------------------------------------------- */
const AppContent: React.FC = () => (
  <>
    <Header />
    <Routes>
      {routes.map(({ path, element, protected: isProtected, roles }) => {
        const content = <BaseLayout>{element}</BaseLayout>;
        return (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute roles={roles}>{content}</ProtectedRoute>
              ) : (
                content
              )
            }
          />
        );
      })}
    </Routes>
    <Footer />
  </>
);

/* -------------------------------------------------------------------------- */
/*                                    App                                     */
/* -------------------------------------------------------------------------- */
const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Toaster position="top-right" />
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
