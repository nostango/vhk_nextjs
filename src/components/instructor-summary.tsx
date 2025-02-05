import { StaticImageData } from "next/image"
import Image from "next/image"

interface InstructorSummaryProps {
  instructors: {
    name: string
    biography: string
    imageUrl: string | StaticImageData
  }[]
}

export default function InstructorSummary({ instructors }: InstructorSummaryProps) {
  return (
    <section className="container mx-auto px-4">
      {instructors.map((instructor, index) => (
        <div key={index} className="grid md:grid-cols-2 gap-8 items-start">
          {/* Image container - full width on mobile, half width on desktop */}
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
            <Image
              src={instructor.imageUrl}
              alt={`Portrait of ${instructor.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1000px) 50vw, 20vw"
              className="object-cover"
            />
          </div>

          {/* Content container */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{instructor.name}</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed">{instructor.biography}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

