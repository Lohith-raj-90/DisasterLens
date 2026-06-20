'use client';
import Link from 'next/link';

const volunteers = [
  { name: 'Lohith', role: 'Lead Developer & AI Architect', emoji: '🧠' },
  { name: 'Rakshith', role: 'Backend Engineer & Mesh Protocol', emoji: '⚙️' },
  { name: 'Chandana', role: 'Frontend Designer & UX Lead', emoji: '🎨' },
  { name: 'Sindhu', role: 'Database Engineer & API Design', emoji: '🗄️' },
  { name: 'Shalini', role: 'Testing & Quality Assurance', emoji: '✅' },
  { name: 'Keerthi', role: 'Maps & GIS Integration', emoji: '🗺️' },
  { name: 'Madan', role: 'Systems & DevOps Engineer', emoji: '🔧' },
  { name: 'Meghana', role: 'AI Model Training & Data', emoji: '📊' },
  { name: 'Keertana', role: 'Documentation & Research', emoji: '📝' },
  { name: 'Maanya', role: 'UI/UX Designer & Prototyping', emoji: '💎' },
];

const features = [
  {
    icon: 'fa-solid fa-brain',
    title: 'Explainable AI Triage',
    desc: 'Multi-Criteria Decision Making algorithm ranks every SOS signal and generates human-readable reasoning for emergency prioritization.',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: 'fa-solid fa-satellite-dish',
    title: 'Offline Mesh Resiliency',
    desc: 'When networks fail, DisasterLens simulates Bluetooth ad-hoc mesh relay to bridge SOS payloads from disconnected devices.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: 'fa-solid fa-map-location-dot',
    title: 'Live Tactical Maps',
    desc: 'Interactive Leaflet maps with real-time SOS marker clustering, priority-color-coded pins, and automatic rescue route visualization.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: 'fa-solid fa-comments',
    title: 'Two-Way Communication',
    desc: 'Victims and rescuers exchange real-time messages. Instructions flow both ways, even in simulated offline mesh mode.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Role-Based Access Control',
    desc: 'Secure JWT authentication with distinct dashboards for Victims and Rescuers. Each role sees only what they need.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: 'fa-solid fa-battery-half',
    title: 'Survival Window Estimation',
    desc: 'AI predicts battery drain curves and urgency windows, escalating priority for victims about to lose connectivity.',
    gradient: 'from-yellow-500 to-amber-600',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-white overflow-hidden" style={{ fontFamily: "var(--font-display)" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-[var(--color-bg-primary)]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center shadow-lg shadow-purple-500/30">
            <i className="fa-solid fa-shield-halved text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Disaster<span className="gold-shimmer">Lens</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold">AI Intelligence System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-5 py-2.5 gradient-purple hover:gradient-purple-hover text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <i className="fa-solid fa-right-to-bracket"></i> Secure Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 px-4 overflow-hidden perspective-container">
        <div className="absolute top-[-200px] left-[10%] w-[500px] h-[500px] rounded-full bg-[var(--color-purple-royal)]/20 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-[var(--color-gold)]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] left-[50%] w-[300px] h-[300px] rounded-full bg-[var(--color-accent-blue)]/10 blur-[100px] pointer-events-none"></div>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="slide-up inline-flex items-center gap-2 border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5 rounded-full text-[var(--color-gold)] text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(212,168,67,0.15)]">
            <span className="w-2 h-2 bg-[var(--color-gold)] rounded-full animate-pulse"></span>
            AI Triage Engine v2.0 Active
          </div>

          <h1 className="slide-up slide-up-delay-1 text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">Intelligence</span>
            <br/>
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">in the Midst of </span>
            <span className="gold-shimmer">Chaos</span>
          </h1>

          <p className="slide-up slide-up-delay-2 text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Connecting victims and rescuers through a <strong className="text-purple-300">real-time, explainable, and offline-resilient</strong> AI platform. Prioritizing those in critical need when every second counts.
          </p>

          <div className="slide-up slide-up-delay-3 flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
            <Link href="/login" className="btn-hyper-purple w-full sm:w-auto px-10 py-4 text-white font-bold text-lg rounded-2xl shadow-[0_8px_40px_rgba(74,14,143,0.4)] active:scale-95 flex items-center justify-center gap-3 z-10">
              <i className="fa-solid fa-rocket"></i> Access Platform
            </Link>
            <button onClick={() => fetch('/api/seed').then(r=>r.json()).then(d=>alert(d.message || 'Database Seeded!'))} className="btn-hyper-gold w-full sm:w-auto px-10 py-4 text-white font-bold text-lg rounded-2xl active:scale-95 flex items-center justify-center gap-3 z-10">
              <i className="fa-solid fa-database"></i> Initialize Database
            </button>
          </div>

          <div className="perspective-container grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto slide-up slide-up-delay-4">
            <div className="card-3d bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border border-purple-500/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black gold-shimmer mb-1">10+</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Volunteers</div>
            </div>
            <div className="card-3d bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border border-purple-500/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black gold-shimmer mb-1">MCDM</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">AI Algorithm</div>
            </div>
            <div className="card-3d bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border border-purple-500/20 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black gold-shimmer mb-1">24/7</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Offline Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">Core </span>
              <span className="gold-shimmer">Capabilities</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">Engineered for the worst-case scenarios. Every feature is built to save lives.</p>
          </div>
          <div className="perspective-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-3d group bg-[var(--color-bg-secondary)]/80 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white text-xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <i className={f.icon}></i>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Team Section */}
      <section className="py-24 px-6 relative border-t border-white/5">
        <div className="absolute top-0 left-[30%] w-[500px] h-[500px] rounded-full bg-[var(--color-purple-royal)]/10 blur-[150px] pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5 rounded-full text-[var(--color-gold)] text-xs font-bold tracking-widest uppercase mb-6">
              <i className="fa-solid fa-graduation-cap"></i> Academic Project
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">Meet the </span>
              <span className="gold-shimmer">Volunteers</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light mb-3">
              Proudly built by students of <strong className="text-[var(--color-gold)]">Kalpataru Institute of Technology, Tiptur</strong>
            </p>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Department of Computer Science & Engineering — Karnataka, India.
              All volunteers are Software Engineers passionate about using technology for disaster response.
            </p>
          </div>

          <div className="perspective-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-12">
            {volunteers.map((v, i) => (
              <div key={i} className="card-3d group bg-[var(--color-bg-secondary)]/80 border border-white/5 rounded-2xl p-5 text-center hover:border-[var(--color-gold)]/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-full gradient-purple flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  {v.emoji}
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{v.name}</h4>
                <p className="text-[10px] text-slate-400 leading-tight uppercase tracking-wider font-semibold">{v.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center bg-[var(--color-bg-secondary)]/60 border border-white/5 rounded-2xl px-8 py-6">
              <i className="fa-solid fa-university text-[var(--color-gold)] text-2xl mb-3"></i>
              <p className="text-white font-bold text-lg">Kalpataru Institute of Technology</p>
              <p className="text-slate-400 text-sm">Tiptur, Tumkur District, Karnataka — 572201</p>
              <p className="text-slate-500 text-xs mt-1">Affiliated to VTU Belagavi | AICTE Approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-500 text-sm">
          © 2025 Disaster<span className="gold-shimmer">Lens</span> — AI-Powered Disaster Intelligence |
          Kalpataru Institute of Technology, Tiptur
        </p>
      </footer>
    </main>
  );
}
