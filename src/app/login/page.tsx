'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('disaster123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.user.role === 'RESCUER') {
        router.push('/rescuer');
      } else {
        router.push('/victim');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Decorative */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#4a0e8f]/15 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full bg-[#d4a843]/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#0f2042]/80 border border-purple-500/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl">
          <div className="p-8 pb-6 border-b border-white/5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#4a0e8f] to-[#7c3aed] rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-lg shadow-purple-500/30">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Secure Sign In</h2>
            <p className="text-sm text-slate-400">Access your Disaster<span className="gold-shimmer">Lens</span> portal</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl font-medium flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation"></i> {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cmdr. Lohith or Chandana"
                className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition placeholder-slate-600"
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition placeholder-slate-600"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#4a0e8f] to-[#7c3aed] hover:from-[#5b1aab] hover:to-[#8b5cf6] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-[0_8px_30px_rgba(74,14,143,0.3)] flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Authenticating...</span> : <><i className="fa-solid fa-right-to-bracket"></i> Authorize Login</>}
            </button>
          </form>

          <div className="px-8 py-5 bg-[#0a1628]/50 border-t border-white/5 text-xs text-slate-500 space-y-1">
            <p className="font-bold text-[#d4a843] text-[10px] uppercase tracking-widest mb-2">Demo Credentials</p>
            <p><span className="text-slate-400 font-semibold">Rescuers:</span> Cmdr. Lohith, Cmdr. Rakshith</p>
            <p><span className="text-slate-400 font-semibold">Victims:</span> Chandana, Sindhu, Shalini, Keerthi, Madan, Meghana, Keertana, Maanya</p>
            <p><span className="text-slate-400 font-semibold">Password:</span> disaster123</p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">Kalpataru Institute of Technology, Tiptur</p>
      </div>
    </div>
  );
}
