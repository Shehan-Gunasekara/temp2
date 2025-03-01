import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/layout/Navigation/Navigation";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import MaintenancePage from "./pages/StaticPages/MaintenancePage";
import { AuthProvider } from "./features/auth/context/AuthProvider";
import { LanguageDrawer } from "./components/layout/Navigation/LanguageDrawer";
import { LanguageProvider } from "./features/auth/context/LanguageContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Layout: React.FC<{
  children: React.ReactNode;
  showNav?: boolean;
}> = ({ children, showNav = true }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-black/5 flex flex-col">
          {showNav && <Navigation />}
          {children}
          {import.meta.env.VITE_SITE_NAMAE != "Synthetic UGC" && (
            <LanguageDrawer />
          )}

          <Footer />
        </div>{" "}
      </LanguageProvider>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  // Read maintenance mode from the environment.
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE;

  if (isMaintenanceMode == "true") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout showNav={false}>
                <LandingPage />
              </Layout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
};

export default App;
