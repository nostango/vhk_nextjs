"use client"
// pages/index.tsx

import { NavbarComponent } from '../components/navbar';
import AnnouncementCarousel from '@/components/announcement-carousel';
import InstructorSummary from '@/components/instructor-summary';
import ClassList from '@/components/classeslist';
import TodayClasses from '@/components/currentclasses';
import cInstructorImage from '/public/images/c_instructor.jpg';
import yInstructorImage from '/public/images/y_instructor.jpg';
import aInstructorImage from '/public/images/a_instructor.jpg';
import dynamic from 'next/dynamic';

const MapComponentNoSSR = dynamic(() => import('../components/map'), {
  ssr: false,
});

export default function Home() {

  const instructors = [
    {
      name: "Sensei Antonio Valenzuela",
      biography: "biography",
      imageUrl: cInstructorImage,
    },
    {
      name: "Sensei Yoas Valenzuela",
      biography: "other bio...",
      imageUrl: yInstructorImage,
    },
    {
      name: "Sensei Abigail Valenzuela",
      biography: "I started karate when I was 6 Years old. I would watch my dad and my brother do karate and it fascinated me and caught my interest in how they can do combat and defend themselves at ease as well as how they worked on all these different techniques. I never expected to get far in karate, but today I'm a black belt getting ready for my first dan. I enjoy sparring and doing Martial Art technique because you can feel safe around the open world knowing you know how to defend yourself.",
      imageUrl: aInstructorImage,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarComponent />
      <AnnouncementCarousel />
      <div id='today_classes'>
        <TodayClasses />
      </div>

      <div id='calendar' className="flex justify-center items-center min-h-screen bg-black text-white">
        <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&showNav=0&showDate=0&showTabs=0&showCalendars=0&showTz=0&showTitle=0&src=NmY5OWI2NTlkNWQ1YTVkNWE2MTg2YzFkYWFhYTVmYTg5ZTY0MTI4NWU4MWMyNThkNzZlMjMwODcyN2RkYmQxY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NzhjNWJiM2RjOWYyY2Q4NjVmZTBiMWU3NTFkNDQxODMzZTdlZWNiZjhmOWUxMDBlMGRhMjFhZmVmZDY4YWVjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZDFlNzljMDI0YWQ5ZDliNDk1NTdiZDVkYWUyZTQyZTE5ZDFmNzQ1NWNhOTkxMDczMmQzMjYzODQ4MDg2ZWQ3MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NjZjNzAxZWUxYTRlYzMzNjhlODI0YmUzZjhhNDdlNjBiYjIzZTM5ZGVjMDFkNjU3YWMyZGNjNTZmYWI1ZmYxMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=N2MwOTYxZWQzMTNkNThmMTUyZjVlMWU1Njg2YzUwZjdiMTUxYjJlNmIyNWM2NDBlNDE0NWU4OTBhODE0MWY3YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Zjg1YjcwYzdkMjBkOTI2ZTQ4YWExMjZmN2JiYzI4NDUyZjhmOTU5MDA1MzJlYTQ2YWUzN2FhYTVlYzg4ZmExZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%230B8043&color=%23616161&color=%234285F4&color=%23D50000&color=%23D50000&color=%23AD1457&color=%23A79B8E" 
          style={{ border: 'solid 0px'}}
          width="800"
          height="600"
          frameBorder="0"
          scrolling="no"
          />
      </div>
      <div id="classes">
        <ClassList />
      </div>

      <div id="instructors">
        <InstructorSummary instructors={instructors} />
      </div>

      <div id="map">
        <MapComponentNoSSR />
      </div>
    </div>
  );
}
