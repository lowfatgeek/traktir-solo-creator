'use client'

import { useState } from 'react'
import { submitDonation } from '@/app/actions'
import { Coffee, ArrowRight, ShieldCheck, Loader2, Download, User, Star } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

type Donation = {
  id: string
  name: string
  amount: number
  message: string
  created_at: string
}

type CustomPage = {
  id: string
  slug: string
  title: string
  reward_url: string
  reward_image_url?: string
  created_at: string
}

export function RewardClient({ 
  pageData,
  recentDonations,
  initialUnlocked = false
}: { 
  pageData: CustomPage,
  recentDonations: Donation[],
  initialUnlocked?: boolean
}) {
  const [open, setOpen] = useState(initialUnlocked)
  const [amount, setAmount] = useState<number | ''>('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(initialUnlocked)
  const [payment, setPayment] = useState<{
    id: string;
    qr_url: string;
    reference: string;
    amount: number;
    expiry: number;
  } | null>(null)
  
  const presetAmounts = [5000, 10000, 25000, 50000]

  const handleDonate = async () => {
    if (!amount || amount < 1000) {
      alert("Minimum donasi adalah Rp 1.000")
      return
    }

    setLoading(true)
    const res = await submitDonation({ 
      name, 
      amount: Number(amount), 
      message: `${message} (Reward: ${pageData.title})`,
      returnUrl: window.location.href
    })
    setLoading(false)

    if (res.success && res.payment) {
      window.location.href = res.payment.checkout_url
    } else {
      alert("Gagal mengirim dukungan: " + res.error)
    }
  }

  // Trigger confetti on initial unlocked load
  useEffect(() => {
    if (initialUnlocked) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })
    }
  }, [initialUnlocked])

  // Monitor payment status with Supabase Realtime
  useEffect(() => {
    if (!payment?.id || unlocked) return

    const channel = supabase
      .channel(`donation_${payment.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'donations',
          filter: `id=eq.${payment.id}`
        },
        (payload) => {
          if (payload.new.status === 'PAID') {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            })
            setUnlocked(true)
            setPayment(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [payment?.id, unlocked])

  const handleDownload = () => {
    window.open(pageData.reward_url, '_blank')
    setOpen(false)
  }

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} mnt lalu`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} jam lalu`
    return `${Math.floor(diffHours / 24)} hr lalu`
  }

  if (unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden py-12">
        {/* Background Elements */}
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-tertiary-fixed-dim/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
        
        <main className="w-full max-w-5xl px-6 py-12 flex flex-col items-center justify-center relative z-10 animate-in fade-in zoom-in-95 duration-700">
           <div className="w-full text-center mb-12">
             <div className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-secondary-container rounded-full relative mx-auto shadow-lg">
                <ShieldCheck className="w-12 h-12 text-secondary" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-tertiary-fixed-dim rounded-full flex items-center justify-center shadow-sm">
                  <Star className="w-4 h-4 text-on-tertiary-fixed font-bold" />
                </div>
             </div>
             <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-primary mb-6">Terima Kasih!</h1>
             <p className="text-on-surface-variant max-w-xl mx-auto text-lg leading-relaxed font-medium">
                 Atas traktiran <span className="font-bold text-primary">caffeine boost</span> ekstra untuk terus mendukung saya tetap berkarya.
             </p>
           </div>
           
           <div className="relative group mb-16 max-w-4xl mx-auto w-full">
              <div className="absolute inset-0 bg-secondary/5 blur-3xl rounded-[2.5rem]"></div>
              <div className="relative bg-surface-container-lowest border border-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-12 shadow-[0_12px_40px_rgba(25,28,29,0.08)] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                 <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner flex items-center justify-center bg-surface-container-low border border-outline-variant/20">
                    {pageData.reward_image_url ? (
                      <img src={pageData.reward_image_url} alt={pageData.title} className="w-full h-full object-cover" />
                    ) : (
                      <Coffee className="w-32 h-32 text-secondary/30" />
                    )}
                 </div>
                 
                 <div className="w-full text-left flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">{pageData.title}</h2>
                    <p className="text-on-surface-variant mb-8 leading-relaxed font-medium">
                       Sebagai tanda apresiasi, saya telah siapkan bonus spesial untukmu. Buka tautan di bawah ini untuk mengambil reward kamu!
                    </p>
                    <button onClick={handleDownload} className="inline-flex items-center justify-center w-full px-8 py-5 bg-secondary text-on-secondary text-lg font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-secondary/20 hover:shadow-secondary/40">
                       <Download className="mr-3 w-6 h-6" />
                       Download Reward
                    </button>
                    
                    <div className="mt-10">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Reward Unlocked</span>
                          <span className="text-[11px] font-bold text-secondary">100%</span>
                       </div>
                       <div className="h-2.5 w-full bg-secondary-container rounded-full overflow-hidden">
                          <div className="h-full bg-secondary w-full relative">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center justify-center">
              <a href="/" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:text-primary transition-all active:scale-95 bg-surface-container-low border border-transparent hover:border-outline-variant/30">
                 Kembali ke Beranda
              </a>
           </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-16 md:py-24 max-w-4xl mx-auto space-y-16">
      <section className="flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] overflow-hidden">
            <img alt="Creator Profile" className="w-full h-full object-cover" src="https://r2.kelaswfa.my.id/img/logo-yuktraktir.png" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-tight">
            Traktir KelasWFA
          </h1>
          <p className="text-on-surface-variant text-lg font-medium max-w-xl mx-auto">
            Dukung KelasWFA dan dapatkan reward ekslusif. Setiap dukungan membantu saya buat konten berkualitas.
          </p>
        </div>
      </section>

      <section className="w-full max-w-2xl">
        <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.04),_0px_12px_40px_rgba(15,23,42,0.06)] border border-outline-variant/30">
          <div className="flex flex-col items-center space-y-8 py-4">
            <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center bg-gradient-to-tr from-surface-container-high to-surface-container-lowest border border-outline-variant/20 overflow-hidden">
               {pageData.reward_image_url ? (
                 <img src={pageData.reward_image_url} alt={pageData.title} className="w-full h-full object-cover" />
               ) : (
                 <Coffee className="w-32 h-32 text-secondary/30" />
               )}
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary tracking-tight text-center">
              {pageData.title}
            </h2>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center space-y-6 w-full max-w-md">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-full py-5 bg-primary text-on-primary font-heading text-xl font-bold rounded-2xl shadow-xl hover:bg-primary-container transition-all active:scale-95 group flex items-center justify-center gap-3">
            Traktir & Buka Reward
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </DialogTrigger>

          <DialogContent className="max-w-[440px] p-0 bg-surface-container-lowest border-none shadow-2xl rounded-2xl overflow-y-auto max-h-[95vh]">
            {payment ? (
              <div className="px-8 py-8 flex flex-col items-center gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h3 className="font-heading text-xl font-extrabold text-primary">Selesaikan Pembayaran</h3>
                  <p className="text-on-surface-variant text-xs font-medium">Scan kode QRIS di bawah ini untuk membayar {formatIDR(payment.amount)}</p>
                </div>
                
                <div className="bg-white p-4 rounded-2xl border-4 border-primary/10 shadow-inner">
                  <img src={payment.qr_url} alt="QRIS Code" className="w-64 h-64 grayscale-0" />
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant px-1">
                    <span>STATUS</span>
                    <span className="flex items-center gap-1.5 text-secondary">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Menunggu Pembayaran
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl text-left">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">ID Transaksi</p>
                    <p className="text-sm font-mono font-bold text-primary break-all">{payment.reference}</p>
                  </div>
                </div>

                <p className="text-[10px] text-on-surface-variant font-medium">
                  Halaman ini akan otomatis diperbarui setelah pembayaran terdeteksi.
                </p>
                
                <button 
                  onClick={() => setPayment(null)}
                  className="text-xs font-bold text-outline hover:text-primary transition-colors"
                >
                  Ganti Metode atau Nominal
                </button>
              </div>
            ) : (
              <div className="px-8 py-6 space-y-4">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <h3 className="font-heading text-xl font-bold text-primary text-center">Checkout Reward</h3>
                  <p className="text-xs text-on-surface-variant font-medium">{pageData.title}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider px-1">Nama</label>
                    <input 
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-xl px-4 py-2.5 focus:outline-none focus:ring-0 focus:border-secondary/30 transition-all font-medium text-sm" 
                      placeholder="Nama (Opsional)" type="text"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider px-1">Pesan</label>
                    <textarea 
                      value={message} onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-xl px-4 py-2.5 focus:outline-none focus:ring-0 focus:border-secondary/30 transition-all placeholder:text-on-primary-container/50 resize-none font-medium text-sm" 
                      placeholder="Pesan untuk kreator..." rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider px-1">Pilih Nominal</label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetAmounts.map((preset) => (
                        <button 
                          key={preset} onClick={() => setAmount(preset)}
                          className={`py-2 rounded-xl font-bold transition-all text-sm border-2 ${
                            amount === preset 
                              ? 'bg-secondary text-white border-secondary' 
                              : 'bg-surface-container-low text-primary border-transparent hover:bg-secondary-container/50'
                          }`}
                        >
                          {preset / 1000}k
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-on-primary-container/60 font-bold text-xs">IDR</span>
                      </div>
                      <input 
                        value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-surface-container-low border-2 border-transparent rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:ring-0 focus:border-secondary/30 transition-all font-bold text-sm" 
                        placeholder="Custom Amount" type="number" min="1000"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleDonate} disabled={loading}
                    className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-extrabold text-lg shadow-xl shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    Bayar via QRIS
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <p className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-tertiary-fixed-dim" />
          Traktiran Aman Mulai Rp. 5.000
        </p>
      </section>

      <section className="w-full max-w-2xl pt-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-outline-variant/50"></div>
          <h3 className="font-heading text-xs font-bold text-outline uppercase tracking-[0.2em]">Latest Traktirans</h3>
          <div className="h-[1px] flex-1 bg-outline-variant/50"></div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {recentDonations.map(d => (
            <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-outline-variant/30 hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm line-clamp-1">{d.name || 'Anonim'}</p>
                  <p className="text-xs text-on-surface-variant max-w-[150px] md:max-w-xs truncate">{d.message || "Memberikan dukungan"}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-secondary font-bold text-sm">{formatIDR(d.amount)}</span>
                <p className="text-[10px] text-outline uppercase tracking-widest mt-0.5">{timeAgo(d.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
