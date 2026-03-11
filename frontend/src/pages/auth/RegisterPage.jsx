import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, setPendingLogin } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee"
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      setPendingLogin({
        email: form.email,
        password: form.password,
        role: form.role
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <>
      <div className="mb-10">
        <h2 className="mb-2 text-4xl font-bold tracking-tight text-slate-950">Create Account</h2>
        <p className="text-slate-600">Set up your organizer or attendee profile.</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
        <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="email" value={form.email} onChange={handleChange} placeholder="Email address" />
        <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
        <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="role" value={form.role} onChange={handleChange}>
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-primary/90" type="submit">
          Create account
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-bold text-primary hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </>
  );
};
