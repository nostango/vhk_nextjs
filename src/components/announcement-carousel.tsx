'use client'

import { useEffect, useState } from 'react'
import { MacCard } from '@/components/ui/mac-card'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface AnnouncementItem {
  id: string
  title: string
  event_date: Date
  content: string
}

export default function AnnouncementCarousel() {
  const { t, i18n } = useTranslation('common')
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Helper function to extract correct language content
  const getLocalizedContent = (content: string) => {
    const enMatch = content.match(/\[EN\](.*?)(?=\[ES\]|$)/s)
    const esMatch = content.match(/\[ES\](.*?)(?=$)/s)
    
    const enContent = enMatch ? enMatch[1].trim() : ''
    const esContent = esMatch ? esMatch[1].trim() : ''
    
    return i18n.language === 'en' ? enContent : esContent
  }

  // 1) Fetch from your "GetSchedule" Lambda endpoint on mount
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('https://moik8i7sua.execute-api.us-east-1.amazonaws.com/default/pullSchedule')
        const data = await res.json()
        const items = JSON.parse(data.body)

        interface ScheduleItem {
          calendarID: string
          eventID: string
          event_name: string
          event_date: string
          description_en?: string
          description_es?: string
        }

        const filtered = items.filter((item: ScheduleItem) => item.calendarID === '78c5bb3dc9f2cd865fe0b1e751d441833e7eecbf8f9e100e0da21afefd68aece@group.calendar.google.com')

        const announcementsData = filtered.map((item: ScheduleItem) => {
          const enPart = item.description_en || '';
          const esPart = item.description_es ? `[ES]${item.description_es}` : '';
          const combinedContent = `${enPart}${esPart}`;

          return {
            id: item.eventID,           // or some unique ID from DynamoDB
            title: item.event_name,
            event_date: new Date(item.event_date),
            content: combinedContent || 'No description available',
          }
        })

        setAnnouncements(announcementsData)
      } catch (error) {
        console.error('Error fetching announcements:', error)
      }
    }

    fetchAnnouncements()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (announcements.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % announcements.length)
    }, 5000) // Increased to 5s for better reading

    return () => clearInterval(interval)
  }, [announcements.length])

  // Handle dot click
  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  if (announcements.length === 0) {
    return (
      <MacCard className="w-full max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-center text-white mb-4 border-b border-white/10 pb-4">
          {t('announcements.title', 'Announcements')}
        </h2>
        <p className="text-center text-gray-500 italic py-8">
          {t('announcements.empty', 'No announcements available')}
        </p>
      </MacCard>
    )
  }

  return (
    <MacCard className="w-full max-w-2xl mx-auto p-8 relative overflow-hidden group">
      <div className="flex flex-col items-center">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">
          {t('announcements.title', 'Announcements')}
        </h2>
        
        <div className="w-full min-h-[160px] flex flex-col items-center text-center transition-all duration-700">
          <span className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
            {announcements[currentIndex].event_date instanceof Date && !isNaN(announcements[currentIndex].event_date.getTime())
                ? format(announcements[currentIndex].event_date, 'MMMM dd, yyyy')
                : 'Invalid date'}
          </span>
          
          <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
            {announcements[currentIndex].title}
          </h3>
          
          <p className="text-gray-400 text-base leading-relaxed max-w-lg">
            {getLocalizedContent(announcements[currentIndex].content)}
          </p>
        </div>

        {/* Pagination dots */}
        {announcements.length > 1 && (
          <div className="flex justify-center gap-3 pt-8">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500",
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-gray-700 hover:bg-gray-500"
                )}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </MacCard>
  )
}
