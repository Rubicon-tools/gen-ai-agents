"use client"

import { HeroBanner } from "@/components/hero-banner"
import { PremiumDashboard } from "@/components/premium-dashboard"
import { PartnerLogos } from "@/components/partner-logos"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PartnerLogos />
      <HeroBanner />
      <PremiumDashboard />
    </div>
  )
}
