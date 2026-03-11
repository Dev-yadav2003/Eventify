const formatPrice = (price) =>
  price > 0
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price)
    : "Free";

export const EventCard = ({ event, onRegister, disabled, buttonLabel = "Register", imageBaseUrl = "" }) => {
  const imageSrc = event.image?.startsWith("http") ? event.image : `${imageBaseUrl}${event.image || ""}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <div className="relative aspect-[16/10] overflow-hidden">
      <button className="absolute right-3 top-3 z-10 rounded-xl bg-white/90 p-2 text-slate-900 shadow">
        <span className="material-symbols-outlined text-xl">favorite</span>
      </button>
      <div
        className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url('${imageSrc}')` }}
      />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
        <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        <span>|</span>
        <span>{event.time || "--:--"}</span>
        <span>|</span>
        <span>{event.category}</span>
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-950 transition group-hover:text-primary">{event.title}</h3>
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        <span className="material-symbols-outlined text-lg">location_on</span>
        <span>{event.location}</span>
      </div>
      <div className="mb-6 text-sm text-slate-400">
        {event.registrationsCount}/{event.capacity} registered
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xl font-black text-slate-950">{formatPrice(event.price)}</span>
        <button
          onClick={() => onRegister?.(event)}
          disabled={disabled}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
    </div>
  );
};
