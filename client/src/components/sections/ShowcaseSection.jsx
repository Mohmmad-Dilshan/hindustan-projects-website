import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor,
  Smartphone,
  Laptop,
  Check,
  TrendingUp,
  Users,
  Search,
  ShoppingCart,
  Heart,
  Grid,
  Menu,
  Bell,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  FolderKanban,
  Star
} from 'lucide-react'
import { Container } from '@/components/ui'

export default function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState('web') // web | mobile | saas

  const tabs = [
    { id: 'web', label: 'Web Application', icon: Monitor, desc: 'Responsive Corporate & Web Apps' },
    { id: 'saas', label: 'SaaS Platform', icon: Laptop, desc: 'Custom Dashboard & Analytics' },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone, desc: 'iOS & Android E-Commerce App' }
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50 border-t border-b border-gray-100">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand-blue/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-brand-red/5 blur-3xl" />
      </div>

      <Container className="space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold tracking-widest uppercase text-brand-red bg-brand-red/10 border border-brand-red/20 px-4.5 py-1.5 rounded-full inline-block">
            Our Craftsmanship
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            Premium Interfaces, Built to Perform
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Explore how we design and build gorgeous, fast, and responsive user experiences across different devices and platforms.
          </p>
        </div>

        {/* Device Switcher / Tabs */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[200px] max-w-[260px] text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm flex items-start gap-3.5 group
                  ${
                    active
                      ? 'bg-white border-brand-blue ring-2 ring-brand-blue/10 scale-102'
                      : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300'
                  }`}
              >
                <div
                  className={`p-2.5 rounded-xl transition-colors
                    ${active ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${active ? 'text-brand-blue' : 'text-gray-800'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">{tab.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* 3D Showcase Window */}
        <div className="relative pt-8 pb-12 flex justify-center perspective-[1200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, rotateX: 5, rotateY: 15, scale: 0.95 }}
              animate={{ opacity: 1, rotateX: 8, rotateY: -12, rotateZ: 2, scale: 1 }}
              exit={{ opacity: 0, rotateX: -5, rotateY: -15, scale: 0.95 }}
              whileHover={{
                rotateX: 4,
                rotateY: -4,
                rotateZ: 1,
                scale: 1.03,
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.25)'
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 18,
                scale: { duration: 0.3 }
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full max-w-4xl bg-transparent select-none"
            >
              {/* ── Tab 1: Web Application (Desktop) ── */}
              {activeTab === 'web' && (
                <div className="relative mx-auto max-w-3xl">
                  {/* Monitor Frame */}
                  <div className="bg-slate-900 border-[10px] border-slate-950 rounded-t-3xl shadow-2xl overflow-hidden aspect-[16/9.8] flex flex-col">
                    {/* Browser Chrome Header */}
                    <div className="bg-slate-950 px-4 py-2 flex items-center gap-2 border-b border-slate-800 shrink-0">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      </div>
                      <div className="flex-1 max-w-sm mx-auto bg-slate-900 border border-slate-800 rounded-md py-0.5 px-3 text-[10px] text-gray-500 font-mono text-center truncate">
                        https://hindustanprojects.com
                      </div>
                    </div>

                    {/* Browser Content */}
                    <div className="flex-1 bg-[#f8fafc] text-slate-800 p-6 flex flex-col justify-between overflow-hidden relative">
                      {/* Sub-Header */}
                      <header className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                        <span className="font-heading font-extrabold text-sm text-brand-blue tracking-wider">HINDUSTAN PROJECTS</span>
                        <div className="flex gap-4 text-[10px] font-bold text-slate-500">
                          <span className="text-brand-blue font-extrabold border-b-2 border-brand-blue pb-0.5">Home</span>
                          <span>Services</span>
                          <span>Portfolio</span>
                          <span>Careers</span>
                        </div>
                      </header>

                      {/* Web App Body */}
                      <div className="flex-1 flex gap-6 items-center py-4">
                        <div className="flex-1 space-y-4">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red inline-block uppercase">
                            Digital Transformation
                          </span>
                          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">
                            Smart Software For <span className="text-brand-blue">Smarter Businesses.</span>
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            We develop robust cloud infrastructures and bespoke customer portals to help your operations run smooth.
                          </p>
                          <div className="flex gap-2">
                            <span className="bg-brand-blue text-white px-3 py-1.5 rounded-lg text-[9px] font-bold">Start Free Trial</span>
                            <span className="border border-slate-200 bg-white text-slate-700 px-3 py-1.5 rounded-lg text-[9px] font-bold">View Portfolio</span>
                          </div>
                        </div>

                        {/* Visual element on right */}
                        <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-xl p-4 space-y-3.5 max-w-[280px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-800">Operational Health</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">99.9% Active</span>
                          </div>
                          {/* Mock chart bars */}
                          <div className="flex gap-1.5 items-end justify-between h-20 pt-2">
                            {[40, 55, 30, 75, 50, 90, 60, 45, 80].map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-full rounded-t-sm transition-all duration-300 hover:bg-brand-red
                                  ${i === 5 ? 'bg-brand-red' : 'bg-slate-200'}`}
                              />
                            ))}
                          </div>
                          {/* Mini stats */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 text-[10px]">
                            <div>
                              <p className="text-[8px] text-gray-400">Total Visits</p>
                              <p className="font-bold text-slate-800">12.5k</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-gray-400">Bounce Rate</p>
                              <p className="font-bold text-slate-800">22.4%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monitor Stand Base */}
                  <div className="relative mx-auto w-32 h-14 bg-slate-800 border-x border-slate-900 flex justify-center items-start shrink-0">
                    <div className="absolute bottom-0 w-44 h-2.5 bg-slate-900 border-t border-slate-800 rounded-t-md" />
                  </div>
                </div>
              )}

              {/* ── Tab 2: SaaS Platform (Laptop) ── */}
              {activeTab === 'saas' && (
                <div className="relative mx-auto max-w-3xl">
                  {/* Laptop Screen Body */}
                  <div className="bg-slate-900 border-[10px] border-slate-950 rounded-t-2xl shadow-2xl overflow-hidden aspect-[16/10] flex flex-col">
                    {/* Screen Notch Camera */}
                    <div className="bg-slate-950 h-5 flex justify-center items-center border-b border-slate-800 shrink-0 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
                    </div>

                    {/* SaaS Dashboard UI */}
                    <div className="flex-1 bg-[#f1f5f9] text-slate-800 flex overflow-hidden">
                      {/* Sidebar */}
                      <aside className="w-40 bg-[#0f172a] text-slate-400 p-4 space-y-5 flex flex-col shrink-0">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded bg-brand-red flex items-center justify-center text-white font-bold text-xs">H</div>
                          <span className="text-[10px] font-bold text-white tracking-wider">HIPRO CMS</span>
                        </div>
                        <nav className="space-y-2 text-[9px] font-semibold flex-1">
                          <div className="flex items-center gap-2 text-white bg-slate-800 rounded-lg px-2.5 py-1.5">
                            <Grid className="w-3.5 h-3.5 text-brand-red-light" />
                            <span>Dashboard</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                            <FolderKanban className="w-3.5 h-3.5" />
                            <span>Projects</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                            <Users className="w-3.5 h-3.5" />
                            <span>Leads</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                            <PieIcon className="w-3.5 h-3.5" />
                            <span>Monitoring</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Integrations</span>
                          </div>
                        </nav>
                        <div className="border-t border-slate-800 pt-3 text-[8px] text-gray-500">
                          <p>Ver 2.5.0</p>
                        </div>
                      </aside>

                      {/* Main Dashboard Area */}
                      <main className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200 shrink-0">
                          <div className="relative max-w-[140px] w-full">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                            <input type="text" placeholder="Quick search..." className="w-full bg-white border border-slate-200 text-[9px] rounded-lg pl-7 pr-3 py-1 placeholder-slate-400 focus:outline-none" />
                          </div>
                          <div className="flex items-center gap-3">
                            <Bell className="w-3.5 h-3.5 text-slate-500" />
                            <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-[9px] border border-white shadow-sm">
                              MD
                            </div>
                          </div>
                        </div>

                        {/* Top Cards Grid */}
                        <div className="grid grid-cols-3 gap-3.5 py-3 shrink-0">
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[8px] font-bold uppercase tracking-wider">Total Revenue</span>
                              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-slate-900">₹45,200</span>
                              <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">+12.5%</span>
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[8px] font-bold uppercase tracking-wider">Active Leads</span>
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-slate-900">182</span>
                              <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">+4.2%</span>
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="text-[8px] font-bold uppercase tracking-wider">Live Projects</span>
                              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-slate-900">12</span>
                              <span className="text-[8px] text-brand-red font-bold bg-red-50 px-1 rounded">Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Chart/Table Area */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between overflow-hidden">
                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 shrink-0">
                            <span className="text-[10px] font-bold text-slate-800">Ongoing Projects Progress</span>
                            <span className="text-[9px] text-brand-blue font-bold hover:underline cursor-pointer">View All</span>
                          </div>
                          {/* Mock Project Table Rows */}
                          <div className="flex-1 flex flex-col justify-center space-y-2 py-2">
                            {[
                              { name: 'E-Commerce App', client: 'Retail Client', progress: 45, color: 'bg-brand-blue' },
                              { name: 'Corporate Portal', client: 'Bhilwara Textiles', progress: 80, color: 'bg-emerald-500' },
                              { name: 'Brand Identity', client: 'Singhal Marbles', progress: 100, color: 'bg-brand-red' }
                            ].map((proj, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[9px] gap-4">
                                <div className="w-28 truncate">
                                  <p className="font-bold text-slate-800 leading-snug">{proj.name}</p>
                                  <p className="text-[8px] text-gray-400 leading-none">{proj.client}</p>
                                </div>
                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div style={{ width: `${proj.progress}%` }} className={`h-full rounded-full ${proj.color}`} />
                                </div>
                                <span className="font-bold text-slate-700 w-6 text-right shrink-0">{proj.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </main>
                    </div>
                  </div>

                  {/* Laptop Base Bezel / Keyboard section */}
                  <div className="relative mx-auto w-[82%] h-4.5 bg-slate-800 rounded-b-lg border-t border-slate-700 shadow-xl flex justify-center items-start shrink-0">
                    <div className="w-20 h-1 bg-slate-900 rounded-b" />
                  </div>
                </div>
              )}

              {/* ── Tab 3: Mobile Application (Phone) ── */}
              {activeTab === 'mobile' && (
                <div className="relative mx-auto max-w-[290px] w-full">
                  {/* Phone Case Frame */}
                  <div className="bg-slate-900 border-[8px] border-slate-950 rounded-[44px] shadow-2xl overflow-hidden aspect-[9/18.5] flex flex-col relative ring-1 ring-white/10">
                    {/* Dynamic Island Notch */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-950 rounded-full z-30 flex items-center justify-end px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
                    </div>

                    {/* Phone App Content */}
                    <div className="flex-1 bg-white text-slate-800 flex flex-col justify-between overflow-hidden relative pt-7 font-sans">
                      {/* App Header */}
                      <header className="px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <Menu className="w-4 h-4 text-slate-600" />
                        <span className="font-heading font-black text-xs text-brand-blue tracking-wider">HINDUSTAN SHOP</span>
                        <div className="relative">
                          <ShoppingCart className="w-4 h-4 text-slate-600" />
                          <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white w-3 h-3 rounded-full text-[6px] font-bold flex items-center justify-center">2</span>
                        </div>
                      </header>

                      {/* App Scroll Area */}
                      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                        {/* Promo Card Banner */}
                        <div className="bg-gradient-to-br from-brand-blue to-[#1e40af] text-white rounded-xl p-3.5 shadow-sm space-y-2 relative overflow-hidden">
                          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-white/5" />
                          <span className="text-[7px] font-bold tracking-widest uppercase bg-white/15 px-1.5 py-0.5 rounded-full w-fit block">Seasonal Offer</span>
                          <h4 className="font-heading text-xs font-bold leading-tight">Flat 50% Off On Web Portals</h4>
                          <p className="text-[7px] text-white/80">Valid till Sunday. Grab yours now!</p>
                        </div>

                        {/* Categories Row */}
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-bold text-slate-800">Categories</p>
                          <div className="flex gap-2.5 overflow-x-auto pb-1 text-[8px] font-bold text-slate-500">
                            <span className="bg-brand-blue text-white px-2.5 py-1 rounded-full shrink-0">All Products</span>
                            <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full shrink-0">Fashion</span>
                            <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full shrink-0">Electronics</span>
                            <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full shrink-0">B2B Software</span>
                          </div>
                        </div>

                        {/* Products Grid */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-slate-800">Featured Services</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            {/* Product Card 1 */}
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm space-y-1.5 relative group">
                              <Heart className="w-3.5 h-3.5 text-gray-300 absolute top-2 right-2 hover:text-red-500 transition-colors" />
                              <div className="bg-slate-100 w-full aspect-square rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                Web App
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="text-[8px] font-bold text-slate-800 leading-tight">Custom React Website</h5>
                                <div className="flex gap-0.5 text-amber-400">
                                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-2 h-2 fill-current" />)}
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                  <span className="text-[9px] font-bold text-slate-900">₹14,999</span>
                                  <span className="bg-brand-red text-white p-1 rounded-full"><PlusIcon className="w-2.5 h-2.5" /></span>
                                </div>
                              </div>
                            </div>

                            {/* Product Card 2 */}
                            <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm space-y-1.5 relative group">
                              <Heart className="w-3.5 h-3.5 text-gray-300 absolute top-2 right-2 hover:text-red-500 transition-colors" />
                              <div className="bg-slate-100 w-full aspect-square rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                Mobile UI
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="text-[8px] font-bold text-slate-800 leading-tight">E-Commerce Android</h5>
                                <div className="flex gap-0.5 text-amber-400">
                                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-2 h-2 fill-current" />)}
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                  <span className="text-[9px] font-bold text-slate-900">₹24,999</span>
                                  <span className="bg-brand-red text-white p-1 rounded-full"><PlusIcon className="w-2.5 h-2.5" /></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* App Bottom Navigation */}
                      <footer className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[7px] font-semibold bg-gray-50 shrink-0">
                        <div className="flex flex-col items-center gap-0.5 text-brand-blue">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Shop</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <Heart className="w-4 h-4" />
                          <span>Favorites</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <Users className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </footer>
                    </div>

                    {/* Phone Screen Notch Bottom Bar */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-900 rounded-full z-30" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
