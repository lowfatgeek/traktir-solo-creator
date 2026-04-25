'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Coffee, Loader2 } from 'lucide-react'
import { submitDonation } from '@/app/actions'
import confetti from 'canvas-confetti'

export function DonationModal() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<number | ''>('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const presetAmounts = [5000, 10000, 25000, 50000]

  const handleDonate = async () => {
    if (!amount || amount < 5000) {
      alert("Minimum donasi adalah Rp 5.000")
      return
    }

    setLoading(true)
    const res = await submitDonation({ 
      name, 
      amount: Number(amount), 
      message,
      returnUrl: window.location.href 
    })
    setLoading(false)

    if (res.success && res.payment) {
      window.location.href = res.payment.checkout_url
    } else {
      alert("Gagal mengirim dukungan: " + res.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group w-full py-5 rounded-2xl bg-secondary text-on-secondary font-bold text-xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-secondary/20 transition-all active:scale-[0.98] duration-200">
        <Coffee className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        Traktir Kopi
      </DialogTrigger>

      <DialogContent className="max-w-[440px] p-0 bg-surface-container-lowest border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl gap-0 overflow-y-auto max-h-[95vh]">
        <div className="px-8 pt-6 pb-2 flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary shadow-sm">
            <Coffee className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-primary tracking-tight">Traktir KelasWFA</h2>
          <p className="text-on-surface-variant text-xs font-medium">Bantu saya terus berkarya untuk kamu.</p>
        </div>

        <div className="px-10 py-4 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider px-1">Nama</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-transparent rounded-xl px-4 py-3 text-on-surface focus:ring-0 focus:outline-none focus:border-secondary/30 focus:bg-white transition-all placeholder:text-on-primary-container/50 font-medium text-sm" 
              placeholder="Nama (Opsional)" 
              type="text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider px-1">Pesan</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-transparent rounded-xl px-4 py-3 text-on-surface focus:ring-0 focus:outline-none focus:border-secondary/30 focus:bg-white transition-all placeholder:text-on-primary-container/50 resize-none font-medium text-sm" 
              placeholder="Pesan penyemangat..." 
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider px-1">Pilih Nominal</label>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((preset) => (
                <button 
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-2.5 rounded-xl font-bold transition-all text-sm border-2 ${
                    amount === preset 
                      ? 'bg-secondary text-white border-secondary' 
                      : 'bg-surface-container-low text-primary border-transparent hover:bg-secondary-container/50 hover:text-on-secondary-container'
                  }`}
                >
                  {preset / 1000}k
                </button>
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-on-primary-container/60 font-bold text-xs">IDR</span>
              </div>
              <input 
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-surface-container-low border-2 border-transparent rounded-xl pl-12 pr-4 py-3 text-on-surface focus:ring-0 focus:outline-none focus:border-secondary/30 focus:bg-white transition-all placeholder:text-on-primary-container/50 font-bold text-sm" 
                placeholder="Custom Amount" 
                type="number"
                min="5000"
              />
            </div>
          </div>
        </div>

        <div className="px-10 pb-6 space-y-2">
          <button 
            onClick={handleDonate}
            disabled={loading}
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-extrabold text-base shadow-xl shadow-primary/20 hover:bg-primary-container hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Traktir Sekarang
          </button>
          <button 
            onClick={() => setOpen(false)}
            className="w-full py-2 text-on-surface-variant font-bold text-xs hover:text-primary transition-colors tracking-wide"
          >
            Nanti Saja
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
