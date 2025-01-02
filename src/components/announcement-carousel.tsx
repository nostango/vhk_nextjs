'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface AnnouncementCarouselProps {
  announcements: {
    id: string
    title: string
    date: Date
    content: string
  }[]
}

export default function AnnouncementCarousel({ announcements }: AnnouncementCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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
          <CardTitle className="text-2xl font-bold text-center">Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-400">No announcements available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Announcements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[200px] transition-all duration-500 ease-in-out">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {announcements[currentIndex].title}
              </h3>
              <span className="text-sm text-gray-400">
                {format(announcements[currentIndex].date, 'MMM dd, yyyy')}
              </span>
            </div>
            <p className="text-gray-400">
              {announcements[currentIndex].content}
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
