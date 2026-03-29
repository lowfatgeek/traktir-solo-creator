'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DonationModal } from './DonationModal'
import { Coffee, User, ShieldCheck } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import confetti from 'canvas-confetti'
import Link from 'next/link'

// Replace Material UI Verified Icon with lucide check-circle-2
import { CheckCircle2 } from 'lucide-react'

type Donation = {
  id: string
  name: string
  amount: number
  message: string
  created_at: string
  status?: string
}

export function LandingClient({ 
  initialStats, 
  initialDonations,
  initialThankYou = false
}: { 
  initialStats: { count: number, totalAmount: number },
  initialDonations: Donation[],
  initialThankYou?: boolean
}) {
  const MESSAGES = [
    "Dukung karya ini dengan secangkir kopi favoritmu ☕",
    "Yuk bantu terus berkarya🚀, mulai dari 5.000 rupiah saja!☕",
    "Setiap kopi dari kamu berarti besar untuk karya ini 🙌",
    "Dukung perjalanan kreatif ini dengan secangkir kopi ☕",
    "Satu kopi darimu, semangat baru untuk berkarya ✨",
    "Traktir kopi ☕ untuk terus hadirkan karya terbaik 🚀",
    "Ngopi bareng sambil dukung karya ini yuk ☕",
    "Dari kamu, untuk karya yang terus berkembang 🌱",
    "Dukung konten ini dengan cara sederhana tapi bermakna 🙌",
    "Traktiranmu hari ini, karya baru besok 🚀",
    "Jadikan dukunganmu sebagai bahan bakar kreativitas ⚡",
    "Bantu wujudkan lebih banyak karya menarik ✨",
    "Satu klik, satu kopi, satu dukungan besar ☕",
    "Yuk, jadi bagian dari perjalanan karya ini 🙌",
    "Jangan cuma ngopi sendiri, traktir saya juga dong ☕😆",
    "Kopimu satu, semangatku seribu 💪☕",
    "Ngopi bareng☕? Kamu bayarin ya 😜",
    "Satu kopi darimu, aku nggak jadi rebahan terus 😴➡️🔥",
    "Biar aku nggak cuma ngopi imajinasi ☕👻",
    "Traktir kopi biar ideku nggak ngelag 😵💫⚡",
    "Bantu aku tetap waras dengan secangkir kopi 😵💫☕",
    "Satu klik, satu kopi, satu langkah menjauh dari tanggal tua 😭☕"
  ]

  const [stats, setStats] = useState(initialStats)
  const [donations, setDonations] = useState(initialDonations)
  const [randomMessage, setRandomMessage] = useState(MESSAGES[0])
  const [showThankYou, setShowThankYou] = useState(initialThankYou)

  useEffect(() => {
    if (showThankYou) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })
      const timer = setTimeout(() => {
        setShowThankYou(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showThankYou])

  useEffect(() => {
    // Pick random message on client mount to avoid hydration mismatch
    const randomIndex = Math.floor(Math.random() * MESSAGES.length)
    setRandomMessage(MESSAGES[randomIndex])

    // Realtime subscription for TriPay updates
    const channel = supabase.channel('realtime:donations')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'donations' }, payload => {
        const newDonation = payload.new as Donation
        const oldDonation = payload.old as Donation
        
        // Only trigger update when status changes to PAID
        if (newDonation.status === 'PAID' && oldDonation.status !== 'PAID') {
          // Update Feed
          setDonations(prev => [newDonation, ...prev].slice(0, 10))
          
          // Update Stats optimistically
          setStats(prev => ({
            count: prev.count + 1,
            totalAmount: prev.totalAmount + Number(newDonation.amount)
          }))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Format IDR helper
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Format Relative Time
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit yang lalu`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Kemarin'
    return `${diffDays} hari yang lalu`
  }

  return (
    <>
      <section className="max-w-2xl mx-auto px-6 flex flex-col items-center text-center pt-20 pb-24">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-secondary to-tertiary-fixed-dim">
            <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden">
              <img alt="Creator Profile" className="w-full h-full object-cover" src="https://r2.kelaswfa.my.id/img/logo-yuktraktir.png"/>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white/0 rounded-full flex items-center justify-center p-0.5">
             <CheckCircle2 className="w-8 h-8 text-secondary fill-white stroke-secondary" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 font-heading">
          Yuk Traktir
        </h1>
        
        <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed min-h-[3.5em] flex items-center justify-center">
          {randomMessage}
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider mb-1">Total Traktir</span>
            <span className="text-2xl font-bold text-primary">{stats.count}</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider mb-1">Total Dukungan</span>
            <span className="text-2xl font-bold text-primary">{formatIDR(stats.totalAmount)}</span>
          </div>
        </div>

        <div className="w-full">
          <DonationModal />
          <p className="mt-4 text-sm text-on-surface-variant/70">Traktir KelasWFA mulai Rp 5.000,- via QRIS</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-primary font-heading">10 Traktirans Terakhir</h2>
        </div>

        <div className="space-y-6">
          {donations.length === 0 ? (
            <p className="text-center text-on-surface-variant py-10">Belum ada dukungan. Jadilah yang pertama!</p>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="flex gap-5 p-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                  <User className="w-6 h-6" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-primary text-lg">{donation.name || 'Anonim'}</span>
                    <div className="self-start flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                      <Coffee className="w-3.5 h-3.5" />
                      {formatIDR(donation.amount)}
                    </div>
                  </div>
                  
                  {donation.message && (
                    <p className="text-on-surface-variant leading-relaxed bg-surface-container-low/50 p-4 rounded-2xl rounded-tl-none italic text-sm md:text-base">
                      "{donation.message}"
                    </p>
                  )}
                  
                  <span className="text-[11px] font-medium text-on-surface-variant/50 uppercase tracking-widest block">
                    {timeAgo(donation.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="w-full pb-12 pt-8 flex flex-col items-center justify-center border-t border-outline-variant/20 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4 text-sm font-medium text-on-surface-variant/80">
          <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors text-center">Privacy Policy</Link>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant/40"></div>
          <Link href="/kebijakan-layanan" className="hover:text-primary transition-colors text-center">Terms of Service</Link>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant/40"></div>
          <Link href="/hubungi-kami" className="hover:text-primary transition-colors text-center">Contact Me</Link>
        </div>
      </footer>

      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-[400px] p-0 bg-surface-container-lowest border-none shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-8 py-10 flex flex-col items-center gap-5 text-center bg-gradient-to-b from-secondary-container/30 to-transparent">
            <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] -top-4 relative">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h3 className="font-heading text-3xl font-extrabold text-primary">Terima Kasih!</h3>
              <p className="text-on-surface-variant text-base leading-relaxed font-medium">
                Dukunganmu sangat berarti! Terima kasih telah memberikan <span className="font-bold text-primary">caffeine boost</span> ekstra.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
