"use client"
// pages/index.tsx

import { useEffect, useState } from 'react';
import { NavbarComponent } from '../components/navbar';

interface Event {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to fetch events.');
        } else {
          setEvents(data.events);
        }
      } catch {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarComponent />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Karate Classes</h1>
        {loading && <p>Loading events...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="mb-4 p-4 bg-gray-800 rounded">
                <h2 className="text-xl font-semibold">{event.summary}</h2>
                <p className="text-sm text-gray-400">
                  {event.start.dateTime
                    ? new Date(event.start.dateTime).toLocaleString()
                    : event.start.date}
                  {' - '}
                  {event.end.dateTime
                    ? new Date(event.end.dateTime).toLocaleString()
                    : event.end.date}
                </p>
                {event.description && (
                  <p className="mt-2">{event.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
