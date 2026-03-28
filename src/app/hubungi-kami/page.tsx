import { Headphones, Mail, MessageCircle, Globe, MonitorPlay, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Hubungi Kami | yuktraktir.com'
}

export default function ContactPage() {
  return (
    <main className="relative flex flex-col items-center justify-center bg-background text-on-background font-body antialiased min-h-screen p-6 md:p-12 overflow-x-hidden">
      {/* Decorative Ambient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-container opacity-20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary-fixed opacity-10 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4"></div>
      
      <div className="relative z-10 w-full max-w-[800px] flex flex-col gap-16 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center space-y-4 pt-10">
            <div className="inline-flex items-center justify-center p-4 mb-4 rounded-2xl bg-surface-container-low">
              <Headphones className="w-12 h-12 text-secondary" />
            </div>
            <h1 className="font-heading text-on-background tracking-tight text-[40px] md:text-[56px] font-extrabold leading-none">
              Hubungi Kami
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Silakan hubungi kami melalui saluran berikut:
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="mailto:hi@kelaswfa.my.id" className="group flex flex-col p-8 rounded-3xl bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-low group-hover:bg-primary/5 transition-colors">
                  <Mail className="w-7 h-7 text-secondary" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-secondary mb-1">Email Resmi</span>
                <span className="text-xl font-heading font-extrabold text-primary">hi@kelaswfa.my.id</span>
              </div>
            </a>

            <a href="https://wa.me/6285657146373" target="_blank" rel="noopener noreferrer" className="group flex flex-col p-8 rounded-3xl bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-low group-hover:bg-primary/5 transition-colors">
                  <MessageCircle className="w-7 h-7 text-secondary" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-secondary mb-1">WhatsApp Chat</span>
                <span className="text-xl font-heading font-extrabold text-primary">+62 856-5714-6373</span>
              </div>
            </a>

            <a href="https://kelaswfa.my.id" target="_blank" rel="noopener noreferrer" className="group flex flex-col p-8 rounded-3xl bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-low group-hover:bg-primary/5 transition-colors">
                  <Globe className="w-7 h-7 text-secondary" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-secondary mb-1">Portal Utama</span>
                <span className="text-xl font-heading font-extrabold text-primary">kelaswfa.my.id</span>
              </div>
            </a>

            <a href="https://youtube.com/@kelaswfa" target="_blank" rel="noopener noreferrer" className="group flex flex-col p-8 rounded-3xl bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-low group-hover:bg-primary/5 transition-colors">
                  <MonitorPlay className="w-7 h-7 text-secondary" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-secondary mb-1">Video Edukasi</span>
                <span className="text-xl font-heading font-extrabold text-primary">youtube.com/@kelaswfa</span>
              </div>
            </a>
          </div>

          <div className="pt-8">
            <Link href="/" className="group inline-flex items-center gap-3 px-8 py-5 rounded-full bg-primary text-on-primary font-heading font-bold transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 text-lg">
              <ArrowLeft className="w-6 h-6" />
              Kembali ke Beranda
            </Link>
          </div>

        </div>
    </main>
  )
}
