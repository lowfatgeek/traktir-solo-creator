'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogIn, Loader2, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Login gagal: " + error.message)
    } else {
      router.push('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-2xl border border-outline-variant/10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight font-heading">Admin Login</h1>
            <p className="text-on-surface-variant font-medium">Khusus Pengelola KelasWFA</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-widest px-1">Email Admin</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary/30 transition-all font-medium text-sm"
              placeholder="admin@kelaswfa.my.id"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-widest px-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl px-5 py-4 focus:outline-none focus:border-secondary/30 transition-all font-medium text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-extrabold text-lg shadow-xl shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            Masuk Console
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-on-surface-variant font-medium">
          Lupa password? Silahkan cek dashboard Supabase Anda.
        </p>
      </div>
    </div>
  )
}
