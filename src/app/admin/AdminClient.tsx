'use client'

import { useEffect, useState } from 'react'
import { createCustomPage, deleteCustomPage, updateCustomPage } from '@/app/actions'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Receipt, FileEdit, Users, BarChart3, Settings, HelpCircle, LogOut, Search, Bell, TrendingUp, Heart, UploadCloud, ArrowRight, Trash2, Loader2, X, Plus } from 'lucide-react'

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

export function AdminClient({ 
  stats: initialStats, 
  recentDonations: initialDonations,
  customPages
}: { 
  stats: { count: number, totalAmount: number }, 
  recentDonations: Donation[],
  customPages: CustomPage[]
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'pages'>('overview')
  const [stats, setStats] = useState(initialStats)
  const [donations, setDonations] = useState(initialDonations)
  const [pages, setPages] = useState(customPages)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [rewardUrl, setRewardUrl] = useState('')
  const [rewardImageUrl, setRewardImageUrl] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successPage, setSuccessPage] = useState<{ slug: string, title: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const channel = supabase.channel('admin:realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, payload => {
        const newDonation = payload.new as Donation
        setDonations(prev => [newDonation, ...prev].slice(0, 50))
        setStats(prev => ({
          count: prev.count + 1,
          totalAmount: prev.totalAmount + Number(newDonation.amount)
        }))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Auto-dismiss success modal after 10s
  useEffect(() => {
    if (successPage) {
      const timer = setTimeout(() => setSuccessPage(null), 10000)
      return () => clearTimeout(timer)
    }
  }, [successPage])

  const handleEditClick = (page: CustomPage) => {
    setEditingId(page.id)
    setSlug(page.slug)
    setTitle(page.title)
    setRewardUrl(page.reward_url)
    setRewardImageUrl(page.reward_image_url || '')
    // Scroll to form on mobile/small screens if needed, otherwise focus
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setSlug('')
    setTitle('')
    setRewardUrl('')
    setRewardImageUrl('')
  }

  const handleCreateOrUpdatePage = async () => {
    if (!slug || !title || !rewardUrl) return alert('Semua field harus diisi!')
    setLoading(true)

    if (editingId) {
      const res = await updateCustomPage(editingId, { slug, title, reward_url: rewardUrl, reward_image_url: rewardImageUrl })
      setLoading(false)
      if (res.success) {
        setPages(prev => prev.map(p => p.id === editingId ? { ...p, slug, title, reward_url: rewardUrl, reward_image_url: rewardImageUrl } : p))
        alert("Halaman berhasil diperbarui!")
        handleCancelEdit()
      } else {
        alert("Gagal memperbarui: " + res.error)
      }
    } else {
      const res = await createCustomPage({ slug, title, reward_url: rewardUrl, reward_image_url: rewardImageUrl })
      setLoading(false)
      if (res.success) {
        setSuccessPage({ slug, title })
        setPages(prev => [{ id: Math.random().toString(), slug, title, reward_url: rewardUrl, reward_image_url: rewardImageUrl, created_at: new Date().toISOString() }, ...prev])
        setSlug('')
        setTitle('')
        setRewardUrl('')
        setRewardImageUrl('')
      } else {
        alert("Gagal membuat halaman: " + res.error)
      }
    }
  }

  const handleDeletePage = async (id: string) => {
    if(!confirm("Yakin ingin menghapus halaman ini?")) return
    const res = await deleteCustomPage(id)
    if (res.success) {
      setPages(prev => prev.filter(p => p.id !== id))
    } else {
      alert("Gagal menghapus: " + res.error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const copyToClipboard = (text: string) => {
    const fullUrl = `${window.location.origin}/${text}`
    navigator.clipboard.writeText(fullUrl)
    alert('URL berhasil disalin!')
  }

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)

  const filteredDonations = donations.filter(d => 
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPages = pages.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Success Modal Notification */}
      {successPage && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-500 max-w-sm w-full">
          <div className="bg-primary text-white p-6 rounded-3xl shadow-2xl relative border border-white/20">
            <button onClick={() => setSuccessPage(null)} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <h4 className="font-bold text-sm">Halaman Berhasil Dibuat!</h4>
            </div>
            <p className="text-xs text-primary-fixed-dim/80 mb-4 font-medium">Link reward Anda sudah aktif dan siap dibagikan.</p>
            <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between gap-3 border border-white/5">
              <code className="text-[10px] font-mono truncate flex-1 opacity-90">{window.location.host}/{successPage.slug}</code>
              <button 
                onClick={() => copyToClipboard(successPage.slug)}
                className="bg-secondary text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:brightness-110 active:scale-95 transition-all"
              >
                Copy
              </button>
            </div>
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-secondary animate-[shrink_10s_linear_forwards]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col gap-y-6 p-6 border-r border-outline-variant/30 z-50">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
              K
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tighter text-primary">KelasWFA</h1>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 mt-4">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${activeTab === 'overview' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary hover:bg-white/50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('donations')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${activeTab === 'donations' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary hover:bg-white/50'}`}
          >
            <Receipt className="w-5 h-5" />
            Donations
          </button>
          <button 
            onClick={() => setActiveTab('pages')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${activeTab === 'pages' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary hover:bg-white/50'}`}
          >
            <FileEdit className="w-5 h-5" />
            Reward Pages
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <div className="h-[1px] bg-outline-variant/20 my-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error/5 rounded-xl transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 min-h-screen p-8 lg:p-12">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight font-heading capitalize">
              {activeTab === 'overview' ? 'Overview Dashboard' : activeTab === 'donations' ? 'Donations List' : 'Reward Pages'}
            </h2>
            <p className="text-on-surface-variant mt-1 font-medium">Welcome back, Administrator.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 focus:ring-secondary/20 w-64 shadow-sm" 
                placeholder="Search data..." 
                type="text"
              />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center bg-primary text-white font-bold text-sm">
              <img src="https://r2.kelaswfa.my.id/img/avatar-kelaswfa-1024.jpg" className="w-full h-full object-cover" alt="Admin" />
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-500">
            {/* Stats Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-primary text-white p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden h-64 shadow-xl">
                <div className="relative z-10">
                  <p className="text-primary-fixed-dim font-bold text-sm uppercase tracking-widest">Total Revenue</p>
                  <h3 className="text-4xl font-extrabold mt-2 font-heading">{formatIDR(stats.totalAmount)}</h3>
                </div>
                <div className="relative z-10 flex items-center gap-2 text-secondary-fixed">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Total Seluruh Waktu</span>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between h-64 shadow-sm border border-outline-variant/10">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-4">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Total Supporters</p>
                  <h3 className="text-4xl font-extrabold mt-2 text-primary font-heading">{stats.count}</h3>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between h-64 shadow-sm border border-outline-variant/10 relative overflow-hidden group hover:border-secondary/30 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-4">
                    <FileEdit className="w-6 h-6" />
                  </div>
                  <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Active Pages</p>
                  <h3 className="text-4xl font-extrabold mt-2 text-primary font-heading">{pages.length}</h3>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary-fixed/10 rounded-full blur-2xl group-hover:bg-tertiary-fixed/20 transition-all"></div>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-bold text-primary font-heading">Recent Supporters</h4>
                  <button onClick={() => setActiveTab('donations')} className="text-sm font-bold text-secondary hover:underline">View All</button>
                </div>
                <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/10">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-surface-container-low">
                      {filteredDonations.slice(0, 5).map(d => (
                        <tr key={d.id}>
                          <td className="px-6 py-4">
                            <span className="font-bold text-primary">{d.name || 'Anonim'}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-xs">{formatIDR(d.amount)}</span>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant text-sm truncate max-w-[150px]">{d.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredDonations.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-medium">No supporters found.</div>
                  )}
                </div>
              </div>
              <div className="bg-white/50 p-8 rounded-[2rem] border border-outline-variant/10">
                <h4 className="font-bold text-primary mb-4">Quick Stats</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Average Donation</span>
                    <span className="font-bold text-primary">{formatIDR(stats.count > 0 ? stats.totalAmount / stats.count : 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Active Pages</span>
                    <span className="font-bold text-primary">{pages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="animate-in fade-in duration-500 text-sm">
            <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-5 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Supporter</th>
                      <th className="px-6 py-5 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-center">Amount</th>
                      <th className="px-6 py-5 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Message</th>
                      <th className="px-6 py-5 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {filteredDonations.map(d => (
                      <tr key={d.id}>
                        <td className="px-6 py-4">
                          <span className="font-bold text-primary">{d.name || 'Anonim'}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-xs">{formatIDR(d.amount)}</span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant text-sm max-w-[300px] break-words">{d.message}</td>
                        <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium">{new Date(d.created_at).toLocaleDateString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDonations.length === 0 && (
                  <div className="p-16 text-center text-slate-400 font-medium">No donations found.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="animate-in fade-in duration-500 grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPages.map(page => (
                  <div key={page.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 flex flex-col gap-4 group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <button 
                        onClick={() => handleEditClick(page)}
                        className={`p-3 rounded-2xl transition-all ${editingId === page.id ? 'bg-secondary text-white' : 'bg-secondary-container/30 text-secondary hover:bg-secondary-container/50'}`}
                      >
                        <FileEdit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeletePage(page.id)} className="text-error opacity-0 group-hover:opacity-100 p-2 hover:bg-error/10 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div>
                      <h5 className="font-bold text-primary text-lg line-clamp-1">{page.title}</h5>
                      <a href={`/${page.slug}`} target="_blank" className="text-sm text-secondary hover:underline flex items-center gap-1 mt-1">
                        /{page.slug} <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/10">
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Target Link</p>
                      <p className="text-xs text-on-surface-variant truncate font-medium">{page.reward_url}</p>
                    </div>
                  </div>
                ))}
                {filteredPages.length === 0 && (
                  <div className="sm:col-span-2 p-16 bg-white rounded-[2rem] border border-dashed border-outline-variant/50 text-center text-slate-400 font-medium">
                    No reward pages found.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className={`p-8 rounded-[2.5rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden transition-all duration-500 ${editingId ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold mb-2">{editingId ? 'Edit Reward Page' : 'Create New Page'}</h4>
                      <p className="text-white/60 text-xs">{editingId ? 'Updating existing reward access.' : 'Generate a reward link for your supporters.'}</p>
                    </div>
                    {editingId && (
                      <button onClick={handleCancelEdit} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Page Title</label>
                    <input 
                      value={title} onChange={(e)=>setTitle(e.target.value)}
                      className="w-full bg-white/10 border-none focus:ring-2 focus:outline-none focus:ring-white/50 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 text-white font-medium" 
                      placeholder="e.g. WFA Ultimate Toolkit" type="text"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Slug URL</label>
                    <div className="flex">
                      <span className="bg-white/10 px-3 flex items-center rounded-l-xl text-xs text-white/40 border-r border-white/5">/</span>
                      <input 
                        value={slug} onChange={(e)=>setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="flex-1 bg-white/10 border-none focus:ring-2 focus:outline-none focus:ring-white/50 rounded-r-xl px-4 py-3 text-sm placeholder:text-white/30 text-white font-medium" 
                        placeholder="reward-access" type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Reward Link</label>
                    <input 
                      value={rewardUrl} onChange={(e)=>setRewardUrl(e.target.value)}
                      className="w-full bg-white/10 border-none focus:ring-2 focus:outline-none focus:ring-white/50 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 text-white font-medium" 
                      placeholder="https://drive.google.com/..." type="url"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-1">
                      IMG URL <span className="text-[8px] opacity-60 font-medium">(Optional)</span>
                    </label>
                    <input 
                      value={rewardImageUrl} onChange={(e)=>setRewardImageUrl(e.target.value)}
                      className="w-full bg-white/10 border-none focus:ring-2 focus:outline-none focus:ring-white/50 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 text-white font-medium" 
                      placeholder="https://image-url.com/asset.png" type="url"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingId && (
                    <button 
                      onClick={handleCancelEdit}
                      className="flex-1 bg-white/10 text-white py-4 rounded-xl font-bold transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center"
                    >
                      Batal
                    </button>
                  )}
                  <button 
                    onClick={handleCreateOrUpdatePage} disabled={loading}
                    className={`flex-[2] py-4 rounded-xl font-bold font-heading shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${editingId ? 'bg-white text-secondary' : 'bg-secondary text-white hover:brightness-110'}`}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <ArrowRight className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                    {editingId ? 'Update Page' : 'Generate Page'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
