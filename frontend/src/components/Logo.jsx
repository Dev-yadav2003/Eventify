export const Logo = ({ compact = false }) => (
  <div className="flex items-center gap-3 text-primary">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
      <span className="material-symbols-outlined text-xl">event_upcoming</span>
    </div>
    {!compact && <span className="font-display text-2xl font-bold tracking-tight text-slate-950">Eventify</span>}
  </div>
);
