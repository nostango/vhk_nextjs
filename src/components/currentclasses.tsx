'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface ClassItem {
calendarID: string;
calendar_name: string;
description_en: string;
event_color: string;
event_name: string;
event_day_of_week: string;
times: string;
event_ages: string;
}

export default function TodayClasses() {
const { t, i18n } = useTranslation('common');
const [todayClasses, setTodayClasses] = useState<ClassItem[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
    async function fetchClasses() {
    try {
        const res = await fetch(
        'https://moik8i7sua.execute-api.us-east-1.amazonaws.com/default/pullSchedule'
        )
        const data = await res.json()
        // Assuming the API returns an object with a JSON string in data.body
        const items: ClassItem[] = JSON.parse(data.body)

        // Filter out the specific calendar
        const filteredByCalendar = items.filter(item => 
            item.calendarID !== '78c5bb3dc9f2cd865fe0b1e751d441833e7eecbf8f9e100e0da21afefd68aece@group.calendar.google.com'
        )

        // Get today's day name (e.g. "Monday")
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
        
        // Filter to include only classes happening today.
        const filtered = filteredByCalendar.filter((item) =>
            item.event_day_of_week?.toLowerCase().includes(todayName.toLowerCase())
            )

        // Sort by the start time.
        filtered.sort((a, b) => {
        const parseStartTime = (timeStr: string) => {
            const [start] = timeStr.split(' - ');
            return new Date(`1970/01/01 ${start}`).getTime()
        }
        return parseStartTime(a.times) - parseStartTime(b.times)
        })

        setTodayClasses(filtered)
    } catch (err) {
        console.error('Error fetching class data:', err)
        setError('Failed to load classes')
    } finally {
        setLoading(false)
    }
    }
    fetchClasses()
}, [])

if (error) return <div className="text-red-500">{error}</div>;
if (loading) return <div>Loading...</div>;

// Format today's date with the correct locale
const todayFormatted = new Date().toLocaleDateString(
    i18n.language === 'en' ? 'en-US' : 'es-ES',
    {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    }
);

return (
    <div className="flex items-center justify-center">
    <Card className="flex flex-col w-full max-w-2xl bg-dark-100 text-white relative">
        <CardHeader>
        <CardTitle className="items-center text-2xl font-bold">{todayFormatted}</CardTitle>
        </CardHeader>
        <CardContent>
        <p>{t('today.classesTitle', 'Classes Today')}:</p>
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
    </div>
)
}
