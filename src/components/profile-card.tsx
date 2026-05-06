"use client"

import { useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { MacCard } from "./ui/mac-card"

type ProfileCardProps = {
  imageSrc: string | StaticImageData
  caption: string
  subcaption?: string
  description: string
  alt?: string
}

export function ProfileCard({
  imageSrc,
  caption,
  subcaption,
  description,
  alt = "Profile image",
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <MacCard
      className={cn(
        "w-full max-w-sm p-0 cursor-pointer hover:border-white/20 transition-all",
        isExpanded ? "scale-[1.02]" : "hover:scale-[1.01]"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col items-center">
        {/* Thumbnail Image */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="p-5 w-full">
          {/* Caption */}
          <h3 className="text-lg font-bold text-white text-center">
            {caption}
          </h3>

          {/* Sub caption */}
          {subcaption && (
            <p className="text-sm text-gray-400 text-center mt-1">
              {subcaption}
            </p>
          )}

          {/* Expand Indicator */}
          <div className="flex justify-center mt-4">
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </div>

          {/* Expandable Description */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isExpanded ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-white/10" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{description}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </MacCard>
  )
}
