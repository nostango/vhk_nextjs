// pages/api/events.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface Event {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  additionalProperties?: Record<string, unknown>; // Updated type
}

interface CalendarResponse {
  items: Event[];
  additionalProperties?: Record<string, unknown>; // Updated type
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { GOOGLE_CALENDAR_API_KEY, GOOGLE_CALENDAR_ID } = process.env;

  if (!GOOGLE_CALENDAR_API_KEY || !GOOGLE_CALENDAR_ID) {
    return res
      .status(500)
      .json({ error: 'Google Calendar API key or Calendar ID not set.' });
  }

  const maxResults = 10; // Adjust as needed
  const timeMin = new Date().toISOString(); // Fetch events from now onwards

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    GOOGLE_CALENDAR_ID
  )}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error });
    }

    const data: CalendarResponse = await response.json();
    const events: Event[] = data.items;

    // Optionally, you can process or filter events here

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}