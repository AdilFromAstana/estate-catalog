import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
// import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EstateDetailsPage from "./pages/EstateDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import ComparePage from "./pages/ComparePage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
