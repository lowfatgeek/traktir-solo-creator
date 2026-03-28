import { ShieldCheck, User, Banknote, MessageCircle, Terminal, MousePointerClick, MapPin, LineChart } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Kebijakan Privasi | yuktraktir.com'
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface text-on-surface">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-16 animate-in fade-in zoom-in-95 duration-700 pt-8">
        <div className="inline-flex items-center justify-center p-4 mb-6 bg-secondary-container rounded-2xl text-secondary shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary tracking-tight mb-4">Kebijakan Privasi</h1>
        <p className="text-on-surface-variant text-lg max-w-xl mx-auto font-medium">
          Di yuktraktir.com, kami menghargai kepercayaan Anda dan berkomitmen untuk melindungi data pribadi Anda.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-secondary font-bold tracking-wide uppercase">
          <span>Terakhir diperbarui: 29 Maret 2026</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <section className="text-center">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">1. Informasi yang Anda Berikan Secara Sukarela</h2>
          <div className="bg-surface-container-low p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(25,28,29,0.02)] border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed mb-6 font-medium">
              Kami hanya mengumpulkan data yang Anda masukkan saat memberikan dukungan kepada KelasWFA:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                <User className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1.5">Nama/Panggilan</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Untuk ditampilkan di daftar pendukung (bisa diisi anonim).</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                <Banknote className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1.5">Nominal</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Jumlah uang yang Anda traktirkan.</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                <MessageCircle className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1.5">Pesan</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">(Opsional) Jika Anda menyertakan pesan untuk konten kreator.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">2. Informasi yang Dikumpulkan Secara Otomatis</h2>
          <div className="bg-surface-container-low p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(25,28,29,0.02)] border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed mb-6 font-medium">
              Saat Anda mengunjungi yuktraktir.com, kami menggunakan layanan analitik pihak ketiga melalui Cookies meliputi:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-start gap-4">
                <Terminal className="w-6 h-6 text-secondary shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1">Data Log</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Alamat IP (disamarkan), jenis perangkat, browser, dan sistem operasi.</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-start gap-4">
                <MousePointerClick className="w-6 h-6 text-secondary shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1">Data Perilaku</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Halaman yang dikunjungi, durasi kunjungan, dan referal asal kunjungan.</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-start gap-4">
                <MapPin className="w-6 h-6 text-secondary shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1">Lokasi Geografis</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Estimasi lokasi berdasarkan alamat IP Anda untuk keperluan analitik.</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-start gap-4">
                <LineChart className="w-6 h-6 text-secondary shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-primary text-sm mb-1">Tujuan</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Memahami efektivitas kampanye dan memperbaiki performa website.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">3. Berbagi Informasi</h2>
          <div className="bg-surface-container-low p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_rgba(25,28,29,0.02)] border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed mb-6 font-medium">
              Kami tidak akan menjual atau menyewakan data Anda. Data hanya dibagikan kepada:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-surface-container-lowest rounded-2xl">
                <p className="font-heading font-bold text-primary text-sm mb-1.5">Layanan Analitik</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Untuk pengolahan data statistik.</p>
              </div>
              <div className="p-5 bg-surface-container-lowest rounded-2xl">
                <p className="font-heading font-bold text-primary text-sm mb-1.5">Layanan Pembayaran</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Tripay untuk validasi pembayaran QRIS Anda.</p>
              </div>
              <div className="p-5 bg-surface-container-lowest rounded-2xl">
                <p className="font-heading font-bold text-primary text-sm mb-1.5">Otoritas Hukum</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">Jika terdapat permintaan resmi dari hukum di Indonesia.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-primary bg-primary-container/5 hover:bg-primary-container/10 transition-colors w-full sm:w-auto">
            Kembali ke Beranda
          </Link>
          <Link href="/hubungi-kami" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-secondary bg-secondary-container/30 hover:bg-secondary-container/50 transition-colors w-full sm:w-auto">
            Hubungi Kami
          </Link>
        </div>

        <div className="mt-24 text-center">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-40">
            © {new Date().getFullYear()} yuktraktir.com. All Rights Reserved.
          </p>
        </div>
      </div>
    </main>
  )
}
