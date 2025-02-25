'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface AnnouncementItem {
  id: string
  title: string
  start_date: Date
  content: string
}

export default function AnnouncementCarousel() {
  const { t, i18n } = useTranslation('common')
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Helper function to extract correct language content
  const getLocalizedContent = (content: string) => {
    const enMatch = content.match(/\[EN\](.*?)(?=\[ES\]|$)/)
    const esMatch = content.match(/\[ES\](.*?)(?=$)/)
    
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
          Timestamp: string
          description_en?: string
        }

        const filtered = items.filter((item: ScheduleItem) => item.calendarID === '78c5bb3dc9f2cd865fe0b1e751d441833e7eecbf8f9e100e0da21afefd68aece@group.calendar.google.com')
        

        const announcementsData = filtered.map((item: ScheduleItem) => ({
          id: item.eventID,           // or some unique ID from DynamoDB
          title: item.event_name,
          start_date: new Date(item.Timestamp),
          content: item.description_en || 'No description available',
        }))

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
    }, 3000)

    return () => clearInterval(interval)
  }, [announcements.length])

  // Handle dot click
  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  if (announcements.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t('announcements.title', 'Announcements')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-400">
            {t('announcements.empty', 'No announcements available')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t('announcements.title', 'Announcements')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[200px] transition-all duration-500 ease-in-out">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {announcements[currentIndex].title}
              </h3>
              <span className="text-sm text-gray-400">
                {format(announcements[currentIndex].start_date, 'MMM dd, yyyy')}
              </span>
            </div>
            <p className="text-gray-400">
              {getLocalizedContent(announcements[currentIndex].content)}
            </p>
          </div>
        </div>

        {/* Pagination dots */}
        {announcements.length > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-gray-400 hover:bg-white/50"
                )}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
