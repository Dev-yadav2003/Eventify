import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EventCard } from "../../components/EventCard";
import { fallbackBrowseEvents } from "../../data/mock";
import { useAuth } from "../../context/AuthContext";
import { useRealtimeRegistrations } from "../../hooks/useRealtimeRegistrations";

export const BrowsePage = () => {
  const { apiUrl, user } = useAuth();
  const imageBaseUrl = apiUrl.replace(/\/api$/, "");
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [message, setMessage] = useState("");

  useRealtimeRegistrations(setEvents);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedCategory !== "All") params.category = selectedCategory;
        const { data } = await axios.get(`${apiUrl}/events`, { params });
        setEvents(data);
      } catch (error) {
        setEvents(fallbackBrowseEvents);
      }
    };

    loadEvents();
  }, [apiUrl, search, selectedCategory]);

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!user?.token || user.role !== "attendee") {
        setRegisteredEventIds(new Set());
        return;
      }

      try {
        const { data } = await axios.get(`${apiUrl}/registrations/me`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        setRegisteredEventIds(new Set(data.map((registration) => String(registration.event?._id)).filter(Boolean)));
      } catch (error) {
        setRegisteredEventIds(new Set());
      }
    };

    loadRegistrations();
  }, [apiUrl, user]);

  const featuredCount = useMemo(
    () => events.filter((event) => new Date(event.date) > new Date()).length,
    [events]
  );

  const categories = useMemo(() => {
    const availableCategories = Array.from(new Set(events.map((event) => event.category).filter(Boolean))).sort();
    return ["All", ...availableCategories];
  }, [events]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  const handleRegister = async (event) => {
    if (!user?.token) {
      setMessage("Sign in as an attendee to register.");
      return;
    }

    if (registeredEventIds.has(String(event._id))) {
      setMessage("You are already registered for this event.");
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/registrations/${event._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      setRegisteredEventIds((current) => {
        const next = new Set(current);
        next.add(String(event._id));
        return next;
      });
      setEvents((current) =>
        current.map((currentEvent) =>
          String(currentEvent._id) === String(event._id)
            ? { ...currentEvent, registrationsCount: currentEvent.registrationsCount + 1 }
            : currentEvent
        )
      );
      setMessage(`Registered for ${event.title}.`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Discover</p>
          <h1 className="mb-3 font-display text-5xl font-bold tracking-tight text-slate-950">Discover Events Across India</h1>
          <p className="text-lg text-slate-600">
            Browse practical workshops, music nights, founder mixers, and cultural experiences with live registration updates.
          </p>
        </div>
        <div className="rounded-[28px] border border-primary/10 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Upcoming events</p>
          <p className="mt-1 text-4xl font-black text-primary">{featuredCount}</p>
        </div>
      </div>

      <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-background-light px-5 py-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Search by city, category, or keyword..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition ${
                selectedCategory === category
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {message && <div className="mb-6 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm">{message}</div>}

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {events.map((event) => {
          const alreadyRegistered = registeredEventIds.has(String(event._id));
          const soldOut = event.registrationsCount >= event.capacity;
          const disabled = user?.role === "organizer" || alreadyRegistered || soldOut;

          let buttonLabel = "Register";
          if (alreadyRegistered) {
            buttonLabel = "Registered";
          } else if (soldOut) {
            buttonLabel = "Sold Out";
          }

          return (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegister}
              disabled={disabled}
              buttonLabel={buttonLabel}
              imageBaseUrl={imageBaseUrl}
            />
          );
        })}
      </section>
    </main>
  );
};
