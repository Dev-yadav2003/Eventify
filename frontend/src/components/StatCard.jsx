export const StatCard = ({ icon, label, value, tone = "primary", meta }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6">
    <div className="mb-4 flex items-start justify-between">
      <div className={`rounded-2xl p-3 ${tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-primary"}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{meta}</span>
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <h3 className="mt-1 text-3xl font-black text-slate-950">{value}</h3>
  </div>
);
