import { getCustomPageBySlug, getRecentDonations } from '@/app/actions'
import { notFound } from 'next/navigation'
import { RewardClient } from './RewardClient'

export const dynamic = 'force-dynamic'

export default async function CustomRewardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pageData = await getCustomPageBySlug(slug)
  
  if (!pageData) {
    notFound()
  }

  const recentDonations = await getRecentDonations(10)

  return (
    <RewardClient 
      pageData={pageData} 
      recentDonations={recentDonations} 
    />
  )
}
