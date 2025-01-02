// pages/api/events.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface Event {
  id: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
}

interface CalendarResponse {
  items: {
    id: string;
    summary: string;
    description?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
  }[];
}

const DEFAULT_CALENDARS = ['calendar1-id', 'calendar2-id', 'calendar3-id'];
const SPECIAL_CALENDAR = 'special-calendar-id';

async function fetchEvents(calendarId: string): Promise<Event[]> {
  const { GOOGLE_CALENDAR_API_KEY } = process.env;
  if (!GOOGLE_CALENDAR_API_KEY) {
    throw new Error('Google Calendar API key not set.');
  }

  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message || 'Failed to fetch events.');
  }

  const data: CalendarResponse = await response.json();

  // Map the API response to your desired format
  return data.items.map(event => ({
    id: event.id,
    title: event.summary,
    description: event.description,
    startTime: event.start?.dateTime || event.start?.date,
    endTime: event.end?.dateTime || event.end?.date,
    days: event.start?.date
      ? [event.start.date]
      : event.start?.dateTime
      ? [new Date(event.start.dateTime).toISOString().split('T')[0]]
      : [],
  }));
}

async function fetchSpecialCalendarEvents(calendarId: string): Promise<Event[]> {
  const events = await fetchEvents(calendarId);
  // Only keep the "days" and "description" fields
  return events.map(event => ({
    id: event.id,
    description: event.description,
    days: event.days,
  }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const calendarId = req.query.calendarId as string;

    if (!calendarId) {
      return res.status(400).json({ error: 'Missing calendarId in query.' });
    }

    if (!process.env.GOOGLE_CALENDAR_API_KEY) {
      return res.status(500).json({ error: 'API key is not configured.' });
    }

    // Fetch events based on the calendar type
    let events: Event[];
    if (DEFAULT_CALENDARS.includes(calendarId)) {
      events = await fetchEvents(calendarId);
    } else if (calendarId === SPECIAL_CALENDAR) {
      events = await fetchSpecialCalendarEvents(calendarId);
    } else {
      return res.status(404).json({ error: 'Unknown calendar ID.' });
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ error: errorMessage });
  }
}