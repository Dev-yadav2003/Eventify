import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import { fallbackBrowseEvents } from "../../data/mock";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

const emptyForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  price: 0,
  capacity: 100,
  image: "",
  imageFile: null,
  status: "published"
};

const buildFallbackDashboard = () => ({
  stats: {
    totalEvents: fallbackBrowseEvents.length,
    totalRegistrations: fallbackBrowseEvents.reduce((sum, event) => sum + event.registrationsCount, 0),
    upcomingEvents: fallbackBrowseEvents.filter((event) => new Date(event.date) > new Date()).length,
    totalRevenue: fallbackBrowseEvents.reduce((sum, event) => sum + event.price * event.registrationsCount, 0)
  },
  events: fallbackBrowseEvents
});

export const DashboardPage = () => {
  const { apiUrl, user } = useAuth();
  const [dashboard, setDashboard] = useState(buildFallbackDashboard());
  const [form, setForm] = useState(emptyForm);
  const [editingEventId, setEditingEventId] = useState(null);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/events/dashboard/organizer`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDashboard(data);
    } catch (error) {
      setDashboard(buildFallbackDashboard());
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingEventId(null);
  };

  const handleEdit = (event) => {
    setEditingEventId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: toDateInputValue(event.date),
      time: event.time || "",
      location: event.location,
      price: event.price,
      capacity: event.capacity,
      image: event.image || "",
      imageFile: null,
      status: event.status
    });
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("date", form.date);
    formData.append("time", form.time);
    formData.append("location", form.location);
    formData.append("price", String(form.price));
    formData.append("capacity", String(form.capacity));
    formData.append("status", form.status);
    formData.append("image", form.image);

    if (form.imageFile) {
      formData.append("imageFile", form.imageFile);
    }

    try {
      if (editingEventId) {
        await axios.put(`${apiUrl}/events/${editingEventId}`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setMessage("Event updated successfully.");
      } else {
        await axios.post(`${apiUrl}/events`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setMessage("Event created successfully.");
      }

      resetForm();
      loadDashboard();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save event.");
    }
  };

  const registrationTrend = useMemo(() => {
    const values = dashboard.events.slice(0, 10).map((event) => event.registrationsCount);
    const maxValue = Math.max(...values, 1);
    return values.map((value) => Math.max(18, Math.round((value / maxValue) * 100)));
  }, [dashboard.events]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(dashboard.events.map((event) => event.category).filter(Boolean))).sort(),
    [dashboard.events]
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-primary">Organizer workspace</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">Namaste, {user?.name?.split(" ")[0] || "Organizer"}</h1>
        <p className="mt-2 text-slate-500">Manage live events, upload event banners, edit published details, and track revenue in real time.</p>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="calendar_month" label="Total Events" value={dashboard.stats.totalEvents} meta="DB synced" />
        <StatCard icon="person_add" label="Total Registrations" value={dashboard.stats.totalRegistrations} meta="Live count" tone="success" />
        <StatCard icon="event_upcoming" label="Upcoming Events" value={dashboard.stats.upcomingEvents} meta="Scheduled" />
        <StatCard icon="monetization_on" label="Total Revenue" value={formatCurrency(dashboard.stats.totalRevenue)} meta="INR" />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Registration Trends</h2>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">From DB events</span>
          </div>
          <div className="flex h-64 items-end gap-2 px-2">
            {registrationTrend.map((value, index) => (
              <div key={index} className="flex-1 rounded-t-2xl bg-primary/20" style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">{editingEventId ? "Edit Event" : "Create Event"}</h2>
            {editingEventId && (
              <button className="text-sm font-semibold text-slate-500 hover:text-slate-900" onClick={resetForm} type="button">
                Cancel
              </button>
            )}
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="title" value={form.title} onChange={handleChange} placeholder="Event title" required />
            <textarea className="h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="category" list="event-categories" value={form.category} onChange={handleChange} placeholder="Category" required />
            <datalist id="event-categories">
              {categoryOptions.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>

            <div className="grid grid-cols-2 gap-3">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="date" type="date" value={form.date} onChange={handleChange} required />
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="time" type="time" value={form.time} onChange={handleChange} required />
            </div>

            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="imageFile" type="file" accept="image/*" onChange={handleChange} />
            {form.image && <p className="text-xs text-slate-500">Current image: {form.image}</p>}

            <div className="grid grid-cols-2 gap-3">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="Ticket price (INR)" required />
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="capacity" type="number" min="0" value={form.capacity} onChange={handleChange} placeholder="Capacity" required />
            </div>

            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" name="status" value={form.status} onChange={handleChange}>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>

            <button className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-soft" type="submit">
              {editingEventId ? "Update Event" : "Create Event"}
            </button>
          </form>

          {message && <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{message}</p>}
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-950">Created Events</h2>
          <span className="text-sm font-semibold text-primary">Live data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attendees</th>
                <th className="px-6 py-4 text-right">Revenue</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboard.events.map((event) => (
                <tr key={event._id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{event.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{event.time || "--:--"}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{event.location}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {event.registrationsCount}/{event.capacity}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-950">
                    {formatCurrency(event.price * event.registrationsCount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary" onClick={() => handleEdit(event)} type="button">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
