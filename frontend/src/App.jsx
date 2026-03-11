import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { BrowsePage } from "./pages/browse/BrowsePage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";

const App = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route element={<AppLayout />}>
      <Route path="/browse" element={<BrowsePage />} />

      <Route element={<ProtectedRoute role="organizer" />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Route>

    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
