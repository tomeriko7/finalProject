import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./services/AuthContext";
import { CustomThemeProvider } from "./services/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CustomThemeProvider>
          <Router>
            <div
              className="App"
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                direction: "rtl", // הוספת RTL support
              }}
            >
              {/* Hide navbar on admin pages */}
              <Routes>
                <Route path="/admin/*" element={null} />
                <Route path="*" element={<Navbar />} />
              </Routes>

              <main style={{ flex: 1 }}>
                <AppRoutes />
              </main>

              {/* Hide footer on admin pages */}
              <Routes>
                <Route path="/admin/*" element={null} />
                <Route path="*" element={<Footer />} />
              </Routes>
            </div>
          </Router>
        </CustomThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
