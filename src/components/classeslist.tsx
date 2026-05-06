'use client';

import { useEffect, useState } from 'react';
import { MacCard } from '@/components/ui/mac-card';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const ClassEvent = ({ event, i18n, getAgeContent }: { event: GroupedByDay['events'][0], i18n: any, getAgeContent: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-4 last:mb-0">
            <div 
                className="flex flex-col cursor-pointer group" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                            <div
                                className="w-3 h-3 rounded-full mr-2 border border-white/20"
                                style={{ backgroundColor: event.eventColor }}
                            />
                            <h4 className="text-sm font-semibold text-gray-400">{event.calendarName}</h4>
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-white group-hover:text-gray-200 transition-colors">
                            {event.eventName}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">{getAgeContent(event.eventAges)}</p>
                        <p className="text-sm text-gray-300">{event.times}</p>
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 text-gray-600 transition-transform duration-300 mt-2",
                            isExpanded && "rotate-180"
                        )}
                    />
                </div>
            </div>

            {/* Expandable Description */}
            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-white/5" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <p className="text-sm text-gray-400 leading-relaxed italic">
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
                </div>
            </div>
            <hr className="mt-4 border-white/5 last:hidden" />
        </div>
    );
};

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
        let hours;
        const [h, minutes] = time.split(':').map(Number);
        hours = h;

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
                <MacCard key={index} className="w-full max-w-2xl p-6 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                        {klass.dayName}
                    </h2>
                    <div className="space-y-6">
                        {klass.events.map((event, idx) => (
                            <ClassEvent 
                                key={idx} 
                                event={event} 
                                i18n={i18n} 
                                getAgeContent={getAgeContent} 
                            />
                        ))}
                    </div>
                </MacCard>
            ))}
        </div>
    );
}