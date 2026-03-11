import { Outlet } from "react-router-dom";
import { Logo } from "../components/Logo";

export const AuthLayout = () => (
  <div className="relative flex min-h-screen flex-col lg:flex-row">
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-slate-200 bg-white p-12">
      <Logo />
      <div className="max-w-md">
        <h1 className="mb-6 font-display text-6xl font-bold leading-tight tracking-tight text-slate-950">
          Manage events <span className="text-primary">like a pro.</span>
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-slate-600">
          A polished control center for organizers and attendees, built for registrations, ticketing, and live event insights.
        </p>
        <div className="rounded-[24px] border border-primary/10 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-slate-700">Join 10k+ organizers worldwide</p>
        </div>
      </div>
      <p className="text-sm text-slate-400">Eventify dashboard suite</p>
    </div>
    <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-24">
      <div className="w-full max-w-[440px]">
        <div className="mb-10 lg:hidden">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  </div>
);
