import { getCustomPageBySlug, getRecentDonations, getDonationStatusByReference } from '@/app/actions'
import { notFound } from 'next/navigation'
import { RewardClient } from './RewardClient'

export const dynamic = 'force-dynamic'

export default async function CustomRewardPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const tripayRef = resolvedSearchParams.tripay_reference as string | undefined

  const pageData = await getCustomPageBySlug(slug)
  
  if (!pageData) {
    notFound()
  }

  const recentDonations = await getRecentDonations(10)

  let initialUnlocked = false;
  if (tripayRef) {
    const status = await getDonationStatusByReference(tripayRef);
    if (status === 'PAID') {
      initialUnlocked = true;
    }
  }

  return (
    <RewardClient 
      pageData={pageData} 
      recentDonations={recentDonations} 
      initialUnlocked={initialUnlocked}
    />
  )
}
