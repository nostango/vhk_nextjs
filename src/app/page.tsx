"use client"
// pages/index.tsx

import { useEffect, useState } from 'react';
import { NavbarComponent } from '../components/navbar';
import AnnouncementCarousel from '@/components/announcement-carousel';

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

  const announcements = [
    {
      id: '1',
      title: 'Company All-Hands Meeting',
      date: new Date('2024-01-15'),
      content: 'Join us for our monthly all-hands meeting where we will discuss Q4 results and upcoming initiatives for the new year.'
    },
    {
      id: '2',
      title: 'New Product Launch',
      date: new Date('2024-01-20'),
      content: 'We are excited to announce the launch of our new product line. Join the product team for a live demo and Q&A session.'
    },
    {
      id: '3',
      title: 'Office Closure Notice',
      date: new Date('2024-01-25'),
      content: 'The office will be closed for maintenance on January 25th. All employees are encouraged to work from home on this day.'
    }
  ]

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
      <AnnouncementCarousel announcements={announcements} />
    </div>
  );
}
