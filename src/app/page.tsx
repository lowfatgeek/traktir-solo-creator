import { LandingClient } from '@/components/LandingClient'
import { getDonationStats, getRecentDonations } from './actions'

// Allow automatic revalidation and dynamic fetching since we want mostly live stats (though realtime handles client side)
export const dynamic = 'force-dynamic'

export default async function Home() {
  const stats = await getDonationStats()
  const recentDonations = await getRecentDonations(10)

  return (
    <LandingClient initialStats={stats} initialDonations={recentDonations} />
  )
}
