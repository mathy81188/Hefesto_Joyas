import { Routes, Route, Navigate } from "react-router-dom";
import { Ruta } from "./components/Ruta";
import { Navbar } from "./components/Navbar";

import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { ClientePanel } from "./components/pages/ClientePanel";
import { AdminPanel } from "./components/pages/AdminPanel";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/cliente"
            element={
              <Ruta rolRequerido="cliente">
                <ClientePanel />
              </Ruta>
            }
          />

          <Route
            path="/admin"
            element={
              <Ruta rolRequerido="admin">
                <AdminPanel />
              </Ruta>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
