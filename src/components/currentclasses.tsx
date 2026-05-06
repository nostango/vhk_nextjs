'use client';

import { useEffect, useState } from 'react';
import { MacCard } from '@/components/ui/mac-card';
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
                const items: ClassItem[] = JSON.parse(data.body)

                const filteredByCalendar = items.filter(item =>
                    item.calendarID !== '78c5bb3dc9f2cd865fe0b1e751d441833e7eecbf8f9e100e0da21afefd68aece@group.calendar.google.com'
                )

                const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

                const filtered = filteredByCalendar.filter((item) =>
                    item.event_day_of_week?.toLowerCase().includes(todayName.toLowerCase())
                )

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
    if (loading) return <div className="text-gray-400">Loading today's classes...</div>;

    const todayFormatted = new Date().toLocaleDateString(
        i18n.language === 'en' ? 'en-US' : 'es-ES',
        {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
        }
    );

    return (
        <div className="flex items-center justify-center w-full">
            <MacCard className="w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold text-white">{todayFormatted}</h2>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                        {t('today.classesTitle', 'Classes Today')}
                    </span>
                </div>
                
                <div className="space-y-4">
                    {todayClasses.length === 0 ? (
                        <p className="text-center text-gray-500 py-4 italic">
                            {t('today.noClasses', 'No classes scheduled for today.')}
                        </p>
                    ) : (
                        todayClasses.map((item, idx) => (
                            <div key={idx} className="group transition-all">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors">
                                        {item.event_name}
                                    </span>
                                    <div 
                                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm" 
                                        style={{ backgroundColor: item.event_color }} 
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-400">{item.times}</p>
                                    <p className="text-xs text-gray-500">{item.event_ages}</p>
                                </div>
                                {idx !== todayClasses.length - 1 && (
                                    <hr className="mt-4 border-white/5" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </MacCard>
        </div>
    )
}
