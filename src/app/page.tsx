"use client"
// pages/index.tsx

import { NavbarComponent } from '../components/navbar';
import AnnouncementCarousel from '@/components/announcement-carousel';


export default function Home() {

  const announcements = [
    {
      id: '1',
      title: 'Company All-Hands Meeting',
      date: new Date('2024-01-15'),
      content: 'Join us for our monthly all-hands meeting where we will discuss Q4 results and upcoming initiatives for the new year.'
    },
    {
      id: '2',
      title: 'New Product Launch',
      date: new Date('2024-01-20'),
      content: 'We are excited to announce the launch of our new product line. Join the product team for a live demo and Q&A session.'
    },
    {
      id: '3',
      title: 'Office Closure Notice',
      date: new Date('2024-01-25'),
      content: 'The office will be closed for maintenance on January 25th. All employees are encouraged to work from home on this day.'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarComponent />
      <AnnouncementCarousel announcements={announcements} />
    </div>
  );
}
