"use client"

import Image from "next/image"

export function PartnerLogos() {
  return (
    <div className="bg-white border-b border-stone-200/30">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Logo Royaume du Maroc */}
          <div className="transition-all duration-300 hover:scale-105 opacity-75 hover:opacity-100">
            <Image
              src="/logo-royaume-maroc.png"
              alt="Ministère de l'Agriculture du Maroc"
              width={160}
              height={80}
              className="h-16 md:h-20 w-auto object-contain filter grayscale-[20%] hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
