// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import EstateDetailsPage from "./pages/EstateDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import NotFoundPage from "./pages/NotFoundPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import RealtorsPage from "./pages/RealtorsPage";
import LoginPage from "./pages/LoginPage";
import CollectionsList from "./pages/CollectionsList";
import CreateCollection from "./pages/CreateCollection";
import CollectionDetail from "./pages/CollectionDetail";
import RealtorEstates from "./pages/RealtorEstates";
import AnalyticsPage from "./pages/AnalyticsPage";
import { useApp } from "./AppContext";
import CollageGenerator from "./components/CollageGenerator/CollageGenerator";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import RealtorSettingsPage from "./pages/RealtorSettingsPage";

// Компонент для защищенных маршрутов
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { user } = useApp();

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Компонент для маршрутов без сайдбара
const NoSidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex-1">
      <main className="pt-16 p-4 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

// Компонент для маршрутов с сайдбаром
const WithSidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0 pt-16 sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1">
        <main className="pt-16 p-4 bg-gray-50 min-h-screen">
          <div className="max-w-screen-xl mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      {/* <Header /> */}

      <div className="flex flex-1">
        <Routes>
          {/* Маршруты без сайдбара */}
          <Route
            path="/login"
            element={
              <NoSidebarLayout>
                <LoginPage />
              </NoSidebarLayout>
            }
          />
          <Route
            path="/register"
            element={
              <NoSidebarLayout>
                <RegisterPage />
              </NoSidebarLayout>
            }
          />

          {/* Маршруты с сайдбаром */}
          <Route
            path="/"
            element={
              <WithSidebarLayout>
                <HomePage />
              </WithSidebarLayout>
            }
          />
          <Route
            path="/estate/:id"
            element={
              <WithSidebarLayout>
                <EstateDetailsPage />
              </WithSidebarLayout>
            }
          />
          <Route
            path="/collage"
            element={
              <WithSidebarLayout>
                <ProtectedRoute>
                  <CollageGenerator />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/favorites"
            element={
              <WithSidebarLayout>
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/compare"
            element={
              <WithSidebarLayout>
                <ProtectedRoute>
                  <ComparePage />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/add-property"
            element={
              <WithSidebarLayout>
                <ProtectedRoute roles={["admin", "realtor"]}>
                  <AddPropertyPage />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/my-properties"
            element={
              <WithSidebarLayout>
                <ProtectedRoute roles={["admin", "realtor"]}>
                  <MyPropertiesPage />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/my-settings"
            element={
              <WithSidebarLayout>
                <ProtectedRoute roles={["admin", "realtor"]}>
                  <RealtorSettingsPage />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/realtors"
            element={
              <WithSidebarLayout>
                <RealtorsPage />
              </WithSidebarLayout>
            }
          />
          <Route
            path="/realtors/:id"
            element={
              <WithSidebarLayout>
                <RealtorEstates />
              </WithSidebarLayout>
            }
          />
          <Route
            path="/statistics"
            element={
              <WithSidebarLayout>
                <ProtectedRoute roles={["admin", "realtor"]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/collections"
            element={
              <WithSidebarLayout>
                <ProtectedRoute>
                  <CollectionsList />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/collections/create"
            element={
              <WithSidebarLayout>
                <ProtectedRoute>
                  <CreateCollection />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/collections/:id"
            element={
              <WithSidebarLayout>
                <ProtectedRoute>
                  <CollectionDetail />
                </ProtectedRoute>
              </WithSidebarLayout>
            }
          />
          <Route
            path="/premium"
            element={
              <WithSidebarLayout>
                <div className="py-8">
                  <h1 className="text-2xl font-bold text-center">
                    Премиум объекты
                  </h1>
                </div>
              </WithSidebarLayout>
            }
          />
          <Route
            path="*"
            element={
              <WithSidebarLayout>
                <NotFoundPage />
              </WithSidebarLayout>
            }
          />
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="flex flex-col min-h-screen">
          <AppContent />
        </div>
      </Router>
    </>
  );
};

export default App;
