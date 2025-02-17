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
      biography: {
        en: "My passion for martial arts ignited as a child, captivated by the power and discipline I saw in action movies. Though medical reasons initially delayed my training, at 13 my journey began with Full Contact Karate, followed by traditional Taekwondo (TKD). A televised demonstration of the Schumann Brothers Kenpo Karate School forever changed my path; their precision and flawless technique set my heart on fire. I knew I'd found my calling, and with my father's support, I immersed myself in the world of Hawaiian Kenpo. For over 30 years, I've relentlessly honed my skills, fueled by a deep respect for Kenpo's rich history. As director and founder of VALENZUELA'S Hawaiian Kenpo, I'm honored to share this dynamic art form, fostering a legacy of excellence and empowering students through national and international competition.",
        es: "Todo empezó desde que tenia uso de razón era un niño apasionado por películas de artes marciales, siempre quise entrenar Karate pero por razones medicas nunca se medio, hasta fue en 1989 a la edad de 13 años que empecé entrenando FULL CONTACT KARATE, al año me pase a entrenar TKD pero cuando en realidad era TKD (la vieja escuela). Y todo cambio hasta que vi una demostración de karate en la TV en la teleton de mi país, de una escuela de artes marciales muy famosa llamada en aquellos años así: kenpo karate los hnos Shumann. Donde vi que esos chicos hacían unos movimientos de defensa y ataque tan precisos una técnica tan perfecta, fue donde le dije a mi padre QEPD papá no me compre nada pero inscríbame al Kenpo como se hacía llamar esa escuela famosa en esos años 80 y 90, fue así como empezó la pasión por el kenpo karate. El SENSEI Antonio Valenzuela director y fundador de VALENZUELA'S hawaiian kenpo con más de 30 años de experiencia pioneros del HAWAIIAN Kenpo en New England tiene una larga trayectoria en competencia nacional e internacionales."
      },
      imageUrl: cInstructorImage,
    },
    {
      name: "Sensei Yoas Valenzuela",
      biography: {
        en: "My martial arts journey began at 11, inspired by my father, Sensei Antonio Valenzuela. Witnessing his dedication and growth as a black belt ignited my own passion. I've trained under him for 11 years, experiencing the thrill of competition and becoming a champion in point sparring and traditional forms. The greatest reward, however, is now passing on this knowledge to the next generation of martial artists.",
        es: "Durante los últimos 11 años he estado entrenando con mi padre, Sensei Antonio Valenzuela. Tenía 11 años cuando empecé a entrenar. Viendo el progreso y el crecimiento que Sensei Antonio puso mientras entrenaba para convertirse en un cinturón negro ha sido un viaje increíble, desde competir en torneos convirtiéndose en campeones en el punto de sparring y formas tradicionales, a ver la próxima generación de competidores convertirse en los nuevos campeones. Ha sido realmente una bendición ver este crecimiento y ser capaz de enseñar a la próxima generación."
      },
      imageUrl: yInstructorImage,
    },
    {
      name: "Sensei Abigail Valenzuela",
      biography: {
        en: "I started karate when I was 6 Years old. I would watch my dad and my brother do karate and it fascinated me and caught my interest in how they can do combat and defend themselves at ease as well as how they worked on all these different techniques. I never expected to get far in karate, but today I'm a black belt getting ready for my first dan. I enjoy sparring and doing Martial Art technique because you can feel safe around the open world knowing you know how to defend yourself.",
        es: "Empecé karate cuando tenía 6 años. Veía a mi papá y a mi hermano practicar karate y me fascinaba, me interesaba ver cómo podían combatir y defenderse con facilidad, así como trabajar en todas estas diferentes técnicas. Nunca esperé llegar tan lejos en karate, pero hoy soy cinta negra preparándome para mi primer dan. Disfruto el sparring y practicar técnicas de Artes Marciales porque te puedes sentir seguro en el mundo sabiendo que puedes defenderte."
      },
      imageUrl: aInstructorImage,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <NavbarComponent />

      <div className="flex flex-col items-center mt-8 md:mt-12 mb-8 md:mb-12 space-y-8 md:space-y-12 px-4 md:px-0">
        <AnnouncementCarousel />
        <div id='today_classes' className="w-full max-w-full md:max-w-4xl">
          <TodayClasses />
        </div>

        <div id='calendar' className="flex justify-center items-center w-full overflow-x-auto">
          <iframe 
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&showTz=0&showCalendars=0&showTabs=0&showNav=0&showTitle=0&src=NmY5OWI2NTlkNWQ1YTVkNWE2MTg2YzFkYWFhYTVmYTg5ZTY0MTI4NWU4MWMyNThkNzZlMjMwODcyN2RkYmQxY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NzhjNWJiM2RjOWYyY2Q4NjVmZTBiMWU3NTFkNDQxODMzZTdlZWNiZjhmOWUxMDBlMGRhMjFhZmVmZDY4YWVjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NDA2M2VmMTZkYjBiMjhjMWQ1N2JlNGMzNWQ0M2JhNzkwNTNjNGY1ODEzNTBmMDU2YTRkZTVjZjRjMGM5YzJmOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Zjg1YjcwYzdkMjBkOTI2ZTQ4YWExMjZmN2JiYzI4NDUyZjhmOTU5MDA1MzJlYTQ2YWUzN2FhYTVlYzg4ZmExZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZDFlNzljMDI0YWQ5ZDliNDk1NTdiZDVkYWUyZTQyZTE5ZDFmNzQ1NWNhOTkxMDczMmQzMjYzODQ4MDg2ZWQ3MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NjZjNzAxZWUxYTRlYzMzNjhlODI0YmUzZjhhNDdlNjBiYjIzZTM5ZGVjMDFkNjU3YWMyZGNjNTZmYWI1ZmYxMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%230B8043&color=%23616161&color=%239E69AF&color=%23AD1457&color=%234285F4&color=%23D50000&color=%230B8043" 
            style={{ border: 'solid 0px'}}
            width="700"
            height="400"
            className="max-w-[800px] md:h-[600px]"
            frameBorder="0"
            scrolling="no"
          />
        </div>

        <div id="classes" className="w-full max-w-full md:max-w-4xl px-4 md:px-0">
          <ClassList />
        </div>

        <div id="instructors" className="w-full max-w-full md:max-w-4xl px-4 md:px-0">
          <InstructorSummary instructors={instructors} />
        </div>

      </div>
      <div id="map" className="w-full">
        <MapComponentNoSSR />
      </div>
    </div>
  );
}
