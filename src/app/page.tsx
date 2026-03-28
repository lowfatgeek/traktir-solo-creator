import { LandingClient } from '@/components/LandingClient'
import { getDonationStats, getRecentDonations, getDonationStatusByReference } from './actions'

// Allow automatic revalidation and dynamic fetching since we want mostly live stats (though realtime handles client side)
export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const stats = await getDonationStats()
  const recentDonations = await getRecentDonations(10)

  const resolvedSearchParams = await searchParams
  const tripayRef = resolvedSearchParams.tripay_reference as string | undefined

  let initialThankYou = false;
  if (tripayRef) {
    const status = await getDonationStatusByReference(tripayRef);
    if (status === 'PAID') {
      initialThankYou = true;
    }
  }

  return (
    <LandingClient 
      initialStats={stats} 
      initialDonations={recentDonations} 
      initialThankYou={initialThankYou}
    />
  )
}
