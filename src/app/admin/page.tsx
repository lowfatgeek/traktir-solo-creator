import { getDonationStats, getRecentDonations, getCustomPages } from '@/app/actions'
import { AdminClient } from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const stats = await getDonationStats()
  const recentDonations = await getRecentDonations(20)
  const customPages = await getCustomPages()

  return (
    <AdminClient 
      stats={stats} 
      recentDonations={recentDonations} 
      customPages={customPages} 
    />
  )
}
