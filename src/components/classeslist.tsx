'use client';

import { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface GroupedByDay {
    dayName: string;
    events: {
        eventName: string;
        times: string;
        description_en: string;
        description_es: string;
        eventAges: string;
        calendarName: string;
        eventColor: string;
    }[];
}

export default function ClassList() {
    const { t, i18n } = useTranslation('common');
    const [classes, setClasses] = useState<GroupedByDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to extract age content
    const getAgeContent = (content: string) => {
        return content || t('classes.noAgeRange');
    };

    // Helper function to parse time for sorting
    const parseTime = (timeString: string) => {
        const timePart = timeString.split(' - ')[0];
        const [time, modifier] = timePart.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        return hours * 60 + minutes;
    };

    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch(
                    'https://moik8i7sua.execute-api.us-east-1.amazonaws.com/default/pullSchedule'
                );
                const data = await res.json();
                const items = JSON.parse(data.body);

                // Group the classes by day of the week
                const groupedByDayMap: Record<string, GroupedByDay> = {};

                items.forEach((item: {
                    calendarID: string;
                    calendar_name: string;
                    description_en: string;
                    description_es: string;
                    event_color: string;
                    event_name: string;
                    event_recurr: string[];
                    times: string;
                    event_ages: string
                }) => {
                    if (item.calendarID === '78c5bb3dc9f2cd865fe0b1e751d441833e7eecbf8f9e100e0da21afefd68aece@group.calendar.google.com' || !item.event_recurr) {
                        return;
                    }
                    const { calendar_name, description_en, description_es, event_color, event_name, event_recurr, times, event_ages } = item;

                    event_recurr.forEach(day => {
                        if (!groupedByDayMap[day]) {
                            groupedByDayMap[day] = {
                                dayName: day,
                                events: [],
                            };
                        }

                        const existingEvent = groupedByDayMap[day].events.find(e =>
                            e.eventName === event_name &&
                            e.times === times &&
                            e.calendarName === calendar_name
                        );

                        if (!existingEvent) {
                            groupedByDayMap[day].events.push({
                                eventName: event_name,
                                times: times,
                                description_en: description_en || 'No description available',
                                description_es: description_es || 'No description available',
                                eventAges: event_ages || 'No age range provided',
                                calendarName: calendar_name,
                                eventColor: event_color || '#ffffff',
                            });
                        }
                    });
                });

                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

                const sortedGroupedClasses = Object.values(groupedByDayMap).sort((a, b) => {
                    const indexA = dayOrder.indexOf(a.dayName);
                    const indexB = dayOrder.indexOf(b.dayName);
                    return indexA - indexB;
                });

                sortedGroupedClasses.forEach(group => {
                    group.events.sort((a, b) => {
                        const timeA = parseTime(a.times);
                        const timeB = parseTime(b.times);
                        return timeA - timeB;
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


    if (loading) return <div>{t('classes.loading')}</div>;
    if (error) return <div className="text-red-500">{t('classes.error')}</div>;
    if (classes.length === 0) return <div>{t('classes.noClasses')}</div>;

    return (
        <div className="flex flex-col items-center w-full">
            {classes.map((klass, index) => (
                <Card key={index} className="w-full max-w-2xl p-4 bg-dark-100 text-white mb-4">
                    <CardHeader>
                        <CardTitle>{klass.dayName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {klass.events.map((event, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-1">
                                        <div
                                            className="w-4 h-4 rounded-full mr-2 border border-white"
                                            style={{ backgroundColor: event.eventColor }}
                                        />
                                        <h4 className="text-l font-semibold">{event.calendarName}</h4>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{event.eventName}</h3>
                                    <p className="text-sm text-gray-400 mb-1">{getAgeContent(event.eventAges)}</p>
                                    <p className="text-sm mb-2">{event.times}</p>
                                </div>
                                <p className="mt-2">
                                    {i18n.language === 'en' ?
                                        event.description_en
                                            .replace(/\[AGES\].*?\[\/AGES\]/g, '')
                                            .replace(/\[EN\]/g, '')
                                            .replace(/\[ES\].*$/g, '')
                                            .trim() :
                                        event.description_es
                                            .replace(/\[AGES\].*?\[\/AGES\]/g, '')
                                            .replace(/\[ES\]/g, '')
                                            .replace(/\[EN\].*\[ES\]/g, '')
                                            .trim()
                                    }
                                </p>
                                {idx !== klass.events.length - 1 && <hr className="my-2" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}