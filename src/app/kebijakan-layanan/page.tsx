import { Scale, CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Kebijakan Layanan | yuktraktir.com'
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface text-on-surface">
      <div className="max-w-[800px] mx-auto flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        <div className="mb-16 text-center space-y-4 pt-10">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-secondary-container text-secondary mb-4 shadow-sm">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-primary">
            Kebijakan Layanan
          </h1>
          <p className="text-on-surface-variant font-medium tracking-wide">
            Pembaruan Terakhir: <span className="text-secondary font-bold">29 Maret 2026</span>
          </p>
        </div>

        <div className="w-full space-y-8">
          <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-outline-variant/10">
            <div className="flex items-start gap-5">
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center font-bold text-secondary text-lg">1</span>
              <div className="space-y-3 pt-2">
                <h2 className="text-xl font-heading font-bold text-primary">Deskripsi Layanan</h2>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  yuktraktir.com adalah platform perantara yang memungkinkan penggemar/penonton memberikan apresiasi finansial atau "traktiran" kepada <span className="font-bold text-primary">KelasWFA</span>. Dukungan ini bersifat sukarela dan tidak menciptakan hubungan kerja atau kontrak profesional apa pun antara donatur dan konten kreator.
                </p>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-3xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-outline-variant/10">
            <div className="flex items-start gap-5">
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center font-bold text-secondary text-lg">2</span>
              <div className="space-y-4 pt-2">
                <h2 className="text-xl font-heading font-bold text-primary">Penggunaan Layanan</h2>
                <ul className="space-y-4 text-on-surface-variant font-medium">
                  <li className="flex gap-4">
                    <CheckCircle2 className="text-secondary shrink-0 mt-0.5 w-6 h-6" />
                    <span>Anda harus berusia minimal 18 tahun atau memiliki izin orang tua/wali untuk melakukan transaksi.</span>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle2 className="text-secondary shrink-0 mt-0.5 w-6 h-6" />
                    <span>Anda dilarang menggunakan nama panggilan (nickname) yang mengandung unsur SARA, pornografi, penghinaan, atau melanggar hukum.</span>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle2 className="text-secondary shrink-0 mt-0.5 w-6 h-6" />
                    <span>Seluruh pembayaran diproses secara real-time via Tripay. Segala bentuk kesalahan pembayaran di luar sistem kami bukanlah tanggung jawab kami.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-3xl bg-secondary-container/30 border-2 border-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertTriangle className="w-48 h-48 -mr-10 -mt-10" />
            </div>
            <div className="flex items-start gap-5 relative z-10">
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-secondary/20">3</span>
              <div className="space-y-3 pt-2">
                <h2 className="text-xl font-heading font-bold text-primary">Kebijakan Pengembalian Dana (Refund)</h2>
                <div className="space-y-4">
                  <p className="text-on-secondary-fixed-variant font-bold text-lg leading-snug">
                    PENTING: Seluruh dukungan yang telah berhasil dikirimkan bersifat Final dan Tidak Dapat Dibatalkan atau Dikembalikan (Non-refundable).
                  </p>
                  <p className="text-on-secondary-fixed-variant/80 font-medium leading-relaxed italic">
                    Dengan melakukan transaksi, Anda memahami bahwa ini adalah bentuk "donasi" atau "hadiah" (gift) atas konten yang telah atau akan dibuat oleh KelasWFA.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-16 pt-12 border-t border-outline-variant/20">
            <div className="p-10 rounded-[2rem] bg-primary text-on-primary shadow-2xl space-y-6 text-center">
              <ShieldCheck className="w-16 h-16 text-tertiary-fixed-dim mx-auto" />
              <p className="text-lg font-medium leading-relaxed max-w-2xl mx-auto text-primary-fixed-dim">
                Dengan menekan tombol bayar atau menyelesaikan transaksi di yuktraktir.com, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh isi Kebijakan Layanan ini.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold text-white w-full sm:w-auto">
                  <ArrowLeft className="w-5 h-5" />
                  Kembali ke Beranda
                </Link>
                <Link href="/hubungi-kami" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/90 transition-colors font-bold text-white w-full sm:w-auto">
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
