import { StaticImageData } from "next/image"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { ProfileCard } from "./profile-card"

interface InstructorSummaryProps {
  instructors: {
    name: string
    biography: {
      en: string
      es: string
    }
    imageUrl: string | StaticImageData
  }[]
}

export default function InstructorSummary({ instructors }: InstructorSummaryProps) {
  const { i18n } = useTranslation();
  
  return (
    <section className="container mx-auto px-4 grid md:grid-cols-3 gap-8 items-start">
      {instructors.map((instructor, index) => (
          <ProfileCard
            key={index}
            imageSrc={instructor.imageUrl as string}
            caption={instructor.name}
            description={instructor.biography[i18n.language as keyof typeof instructor.biography]}
          />
      ))}
    </section>
  )
}

