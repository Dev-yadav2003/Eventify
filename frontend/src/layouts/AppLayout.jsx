import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-background-light/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link to={user?.role === "organizer" ? "/dashboard" : "/browse"}>
              <Logo />
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <NavLink className="text-sm font-semibold text-slate-600 hover:text-primary" to="/browse">
                Browse
              </NavLink>
              {user?.role === "organizer" && (
                <NavLink className="text-sm font-semibold text-slate-600 hover:text-primary" to="/dashboard">
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              {user?.role || "Guest"}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
};
