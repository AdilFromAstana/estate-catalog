import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
// import Footer from "./components/Footer";
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

const App: React.FC = () => {
  // const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // if (!isMobile) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen text-center p-6">
  //       <h1 className="text-xl font-semibold">
  //         Доступ разрешён только через телефон
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/estate/:id" element={<EstateDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/login" element={<div>Страница риэлторов</div>} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/add-property" element={<AddPropertyPage />} />
            <Route path="/my-properties" element={<MyPropertiesPage />} />
            <Route path="/realtors" element={<RealtorsPage />} />
            <Route path="/realtors/:id" element={<RealtorEstates />} />
            {/* <Route
              path="/collections"
              element={
                <div className="min-h-screen py-8">
                  <h1 className="text-2xl font-bold text-center">Подборки</h1>
                </div>
              }
            /> */}
            <Route path="/collections" element={<CollectionsList />} />
            <Route path="/collections/create" element={<CreateCollection />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route
              path="/premium"
              element={
                <div className="min-h-screen py-8">
                  <h1 className="text-2xl font-bold text-center">
                    Премиум объекты
                  </h1>
                </div>
              }
            />
            <Route
              path="/new-buildings"
              element={
                <div className="min-h-screen py-8">
                  <h1 className="text-2xl font-bold text-center">
                    Новостройки
                  </h1>
                </div>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
