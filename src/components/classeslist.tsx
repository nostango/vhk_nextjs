'use client';

import { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';

interface GroupedClasses {
    calendarName: string;
    eventColor: string;
    events: { eventName: string; times: string; description: string; eventAges: string }[];
}

export default function ClassList() {
    const [classes, setClasses] = useState<GroupedClasses[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch(
                    'https://moik8i7sua.execute-api.us-east-1.amazonaws.com/default/pullSchedule'
                );
                const data = await res.json();
                const items = JSON.parse(data.body);

                const groupedClassesMap: Record<string, GroupedClasses> = {};

                items.forEach((item: { calendarID: string; calendar_name: string; description_en: string; event_color: string; event_name: string; recurrence: string; times: string; event_ages: string }) => {
                    const { calendarID, calendar_name, description_en, event_color, event_name, recurrence, times, event_ages } = item;

                    if (!groupedClassesMap[calendarID]) {
                        groupedClassesMap[calendarID] = {
                            calendarName: calendar_name,
                            eventColor: event_color || '#ffffff',
                            events: [{
                                eventName: event_name,
                                times: `${recurrence} - ${times}`,
                                description: description_en || 'No description available',
                                eventAges: event_ages || 'No age range provided',
                            }],
                        };
                    } else {
                        const existingEvent = groupedClassesMap[calendarID].events.find(e => e.eventName === event_name && e.description === description_en && e.eventAges === event_ages);
                        if (!existingEvent) {
                            groupedClassesMap[calendarID].events.push({
                                eventName: event_name,
                                times: `${recurrence} - ${times}`,
                                description: description_en || 'No description available',
                                eventAges: event_ages || 'No age range provided',
                            });
                        }
                    }
                });

                setClasses(Object.values(groupedClassesMap));
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
    if (classes.length === 0) return <div>No classes available</div>;

    return (
        <div className="flex flex-col items-center w-full">
            {classes.map((klass, index) => (
                <Card key={index} className="w-full max-w-2xl p-4 bg-dark-100 text-white relative">
                    {/* Color Circle in Top Right */}
                    <div 
                        className="absolute top-5 right-5 w-12 h-12 rounded-full border border-white" 
                        style={{ backgroundColor: klass.eventColor }}
                    />
                    
                    <CardHeader>
                        <CardTitle>{klass.calendarName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {klass.events.map((event, idx) => (
                            <div key={idx} className="mb-4">
                                <p className="font-bold">{event.eventName}</p>
                                <p>{event.times}</p>
                                <p>{event.description}</p>
                                {idx !== klass.events.length - 1 && <hr className="my-2" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
