import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, consumePendingLogin } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "attendee"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const pendingLogin = consumePendingLogin();

    if (pendingLogin) {
      setForm({
        email: pendingLogin.email || "",
        password: pendingLogin.password || "",
        role: pendingLogin.role || "attendee"
      });
    }
  }, [consumePendingLogin]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login({ email: form.email, password: form.password });
      navigate(user.role === "organizer" ? "/dashboard" : "/browse");
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <>
      <div className="mb-10">
        <h2 className="mb-2 text-4xl font-bold tracking-tight text-slate-950">Welcome Back</h2>
        <p className="text-slate-600">Please enter your details to sign in.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex gap-1 rounded-xl bg-slate-200 p-1">
          {["organizer", "attendee"].map((role) => (
            <label
              key={role}
              className={`flex-1 cursor-pointer rounded-lg px-4 py-3 text-center text-sm font-semibold capitalize transition ${
                form.role === role ? "bg-white text-primary shadow-sm" : "text-slate-500"
              }`}
            >
              <input className="sr-only" name="role" type="radio" value={role} checked={form.role === role} onChange={handleChange} />
              {role}
            </label>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

        <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-primary/90" type="submit">
          Sign In
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link className="font-bold text-primary hover:underline" to="/register">
          Sign up for free
        </Link>
      </p>
    </>
  );
};
