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
    events: { eventName: string; times: string; description_en: string; description_es: string; eventAges: string }[];
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
    
            // Group the classes by calendarID
            const groupedClassesMap: Record<string, GroupedClasses> = {};
    
            items.forEach((item: { 
            calendarID: string; 
            calendar_name: string; 
            description_en: string;
            description_es: string; 
            event_color: string; 
            event_name: string; 
            event_recurr: string; 
            times: string; 
            event_ages: string 
            }) => {
                if (item.calendarID === '78c5bb3dc9f2cd865fe0b1e751d441833e7eecbf8f9e100e0da21afefd68aece@group.calendar.google.com') {
                    return;
                }
            const { calendarID, calendar_name, description_en, description_es, event_color, event_name, event_recurr, times, event_ages } = item;
    
            if (!groupedClassesMap[calendarID]) {
                groupedClassesMap[calendarID] = {
                calendarName: calendar_name,
                eventColor: event_color || '#ffffff',
                events: [{
                    eventName: event_name,
                    // Build the times string (assuming recurrence contains day info)
                    times: `${event_recurr} - ${times}`,
                    description_en: description_en || 'No description available',
                    description_es: description_es || 'No description available',
                    eventAges: event_ages || 'No age range provided',
                }],
                };
            } else {
                const existingEvent = groupedClassesMap[calendarID].events.find(e => 
                e.eventName === event_name && 
                e.description_en === description_en && 
                e.description_es === description_es &&
                e.eventAges === event_ages
                );
                        if (!existingEvent) {
                            groupedClassesMap[calendarID].events.push({
                                eventName: event_name,
                                times: `${event_recurr} - ${times}`,
                                description_en: description_en || 'No description available',
                                description_es: description_es || 'No description available',
                                eventAges: event_ages || 'No age range provided',
                            });
                        }
                    }
                    });
        
                    // Define your custom orders
                    const calendarOrder = ['Kids Kenpo', 'Jr Kenpo', 'Adults Kickboxing']
                    const dayOrder = ['Every Monday', 'Every Tuesday', 'Every Wednesday', 'Every Thursday', 'Every Friday', 'Every Saturday', 'Every Sunday'];
            
                    // Convert the map to an array and sort by the custom calendar order.
                    const sortedGroupedClasses = Object.values(groupedClassesMap).sort((a, b) => {
                    // Adjust if necessary (e.g., use toLowerCase() if your data might differ in case)
                    const indexA = calendarOrder.indexOf(a.calendarName.toLowerCase());
                    const indexB = calendarOrder.indexOf(b.calendarName.toLowerCase());
                    return indexA - indexB;
                    });
            
                    // Sort events in each calendar group:
                    sortedGroupedClasses.forEach(group => {
                    group.events.sort((a, b) => {
                        // First, sort by event name alphabetically.
                        const nameComparison = a.eventName.localeCompare(b.eventName);
                        if (nameComparison !== 0) return nameComparison;
            
                        // Next, if the event names are the same, sort by the day of the week.
                        // Here, we assume that the day is part of the recurrence info in the 'times' string.
                        // For example, if a.times is "Monday - 10:00 AM", we extract "monday".
                        const dayA = a.times.split('-')[0].trim().toLowerCase();
                        const dayB = b.times.split('-')[0].trim().toLowerCase();
            
                        return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
                    });
                    });
            
                    setClasses(sortedGroupedClasses);
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
                                <p>{event.description_en}</p>
                                <p>{event.description_es}</p>
                                {idx !== klass.events.length - 1 && <hr className="my-2" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
