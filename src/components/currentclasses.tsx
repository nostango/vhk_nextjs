'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ClassItem {
calendarID: string;
calendar_name: string;
description_en: string;
event_color: string;
event_name: string;
recurrence: string;
times: string;
event_ages: string;
}

export default function TodayClasses() {
const [todayClasses, setTodayClasses] = useState<ClassItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
    async function fetchClasses() {
    try {
        const res = await fetch(
        'https://moik8i7sua.execute-api.us-east-1.amazonaws.com/default/pullSchedule'
        );
        const data = await res.json();
        // Assuming the API returns an object with a JSON string in data.body
        const items: ClassItem[] = JSON.parse(data.body);

        // Get today's day name (e.g. "Monday")
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        // Filter to include only classes happening today.
        // Adjust the comparison if your recurrence field has a more complex format.
        const filtered = items.filter((item) =>
        item.recurrence?.toLowerCase().includes(todayName.toLowerCase())
        );

        // Sort by the start time.
        // We assume the times string is formatted as "start - end" (e.g. "09:00 AM - 10:00 AM")
        filtered.sort((a, b) => {
        const parseStartTime = (timeStr: string) => {
            const [start] = timeStr.split(' - ');
            // Use an arbitrary date (e.g. Jan 1, 1970) to parse the time.
            return new Date(`1970/01/01 ${start}`).getTime();
        };
        return parseStartTime(a.times) - parseStartTime(b.times);
        });

        setTodayClasses(filtered);
    } catch (err) {
        console.error('Error fetching class data:', err);
        setError('Failed to load classes');
    } finally {
        setLoading(false);
    }
    }

    fetchClasses();
}, []);

if (loading) return <div>Loading classes...</div>;
if (error) return <div className="text-red-500">{error}</div>;

// Format today's date like "Monday Feb 3"
const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
});

return (
    <Card className="w-full max-w-2xl p-4 bg-dark-100 text-white">
    <CardHeader>
        <CardTitle>{todayFormatted}</CardTitle>
    </CardHeader>
    <CardContent>
        <p className="mb-4">Classes Today:</p>
        {todayClasses.length === 0 ? (
        <p>No classes today.</p>
        ) : (
        todayClasses.map((item, idx) => (
            <div key={idx} className="mb-4">
            <div className="flex items-center justify-between">
                <span className="font-bold">{item.event_name}</span>
                {/* Display a color dot using the calendar's color */}
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.event_color }} />
            </div>
            <p>{item.times}</p>
            {idx !== todayClasses.length - 1 && <hr className="my-2 border-gray-500" />}
            </div>
        ))
        )}
    </CardContent>
    </Card>
);
}
