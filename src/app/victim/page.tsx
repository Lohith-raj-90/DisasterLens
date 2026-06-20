'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

export default function VictimDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SENT'>('IDLE');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    disaster_type: 'Medical',
    injury_severity: 'Severe',
    battery_level: Math.floor(Math.random() * 20) + 5,
    location_lat: 12.9716 + (Math.random() - 0.5) * 0.1,
    location_lng: 77.5946 + (Math.random() - 0.5) * 0.1,
    group_size: 1,
    environment: 'Normal'
  });

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  useEffect(() => {
    if (!isOnline) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages/stream');
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, offlineQueue]);

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      const syncCount = offlineQueue.length;
      offlineQueue.forEach(async (msg) => {
        try {
          await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: msg.content })
          });
        } catch {}
      });
      setOfflineQueue([]);
      showToast(`✅ ${syncCount} queued item(s) synced to server`, 'success');
    }
  }, [isOnline]);

  const sendSOS = async () => {
    setLoading(true);
    if (isOnline) {
      try {
        const res = await fetch('/api/sos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const data = await res.json();
          setStatus('SENT');
          showToast(`🚨 SOS Transmitted — AI Rank: ${data.rank} (Score: ${data.score}/100)`, 'success');
        }
      } catch { 
        showToast('❌ Failed to transmit SOS', 'error');
      }
    } else {
      const offlineSOS = { ...formData, id: 'offline_' + Date.now(), timestamp: new Date().toISOString() };
      setOfflineQueue(prev => [...prev, { type: 'sos', content: JSON.stringify(offlineSOS) }]);
      setStatus('SENT');
      showToast('📡 SOS queued (Mesh Mode). Will sync when online.', 'info');
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (isOnline) {
      try {
        await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newMessage })
        });
        setNewMessage('');
        const res = await fetch('/api/messages/stream');
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch {}
    } else {
      const offlineMsg = {
        id: 'local_' + Date.now(),
        content: newMessage,
        senderRole: 'VICTIM',
        senderName: 'You (Offline)',
        timestamp: new Date().toISOString(),
        offline: true
      };
      setOfflineQueue(prev => [...prev, offlineMsg]);
      setMessages(prev => [...prev, offlineMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a1628] text-white overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-[slideUp_0.3s_ease] ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          'bg-[#4a0e8f] text-white'
        }`}>
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-[#0f2042]/90 border-b border-purple-500/10 flex items-center justify-between px-5 z-20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4a0e8f] to-[#7c3aed] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform">
            <i className="fa-solid fa-shield-halved text-white text-sm"></i>
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Disaster<span className="gold-shimmer">Lens</span></h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-semibold">Victim Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{isOnline ? 'Online' : 'Offline'}</span>
          <div
            className={`toggle-switch ${isOnline ? 'active' : ''}`}
            style={{ background: isOnline ? 'linear-gradient(135deg, #4a0e8f, #7c3aed)' : '#374151' }}
            onClick={() => { setIsOnline(!isOnline); showToast(isOnline ? '📡 Switched to Mesh Offline Mode' : '🌐 Back Online — Syncing...', 'info'); }}
          >
            <div className="toggle-knob"></div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {isOnline ? 'Connected' : 'Mesh Mode'}
          </div>
          <button onClick={handleLogout} className="ml-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1.5">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel — SOS + Map */}
        <div className="w-[420px] flex flex-col border-r border-white/5 shrink-0">
          <div className="h-48 shrink-0 relative">
            {isOnline ? (
              <MapComponent signals={[{
                id: 'self',
                location_lat: formData.location_lat,
                location_lng: formData.location_lng,
                priority_score: 50,
                user: { name: 'Your Location' },
                disaster_type: formData.disaster_type,
                battery_level: formData.battery_level
              }]} activeSignalId={null} onMarkerClick={() => {}} />
            ) : (
              <div className="h-full w-full bg-[#0f2042] flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-amber-500/20 flex items-center justify-center relative mb-3">
                  <div className="absolute inset-0 rounded-full radar-sweep"></div>
                  <i className="fa-solid fa-wifi text-amber-500/50 text-xl relative z-10"></i>
                </div>
                <p className="text-amber-500/70 text-xs font-semibold">Mesh Scanning · Last coordinates cached</p>
              </div>
            )}
            {!isOnline && (
              <div className="absolute top-2 left-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 z-30">
                <i className="fa-solid fa-triangle-exclamation"></i> OFFLINE MODE
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div>
              <h3 className="font-bold text-white text-lg mb-0.5 flex items-center gap-2">
                <i className="fa-solid fa-hand-holding-medical text-purple-400"></i> Emergency Intel
              </h3>
              <p className="text-[10px] text-slate-500">Fill all fields for accurate AI triage scoring.</p>
            </div>

            {/* Emergency Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 block">Emergency Type</label>
              <select 
                value={formData.disaster_type} 
                onChange={e => setFormData({...formData, disaster_type: e.target.value})}
                className="w-full bg-[#0f2042] border border-purple-500/20 rounded-xl p-2.5 text-white font-semibold outline-none focus:border-[#d4a843] transition text-sm"
              >
                <option value="Medical">🩺 Medical Emergency</option>
                <option value="Trapped">🏚️ Structural Collapse / Trapped</option>
                <option value="Fire">🔥 Fire / Smoke Condition</option>
                <option value="Flood">🌊 Water Level Rising</option>
                <option value="Earthquake">🌍 Earthquake Aftermath</option>
                <option value="Chemical">☣️ Chemical / HAZMAT Exposure</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 block">Injury Severity</label>
              <div className="flex gap-2">
                {['Minor', 'Moderate', 'Severe'].map(s => (
                  <button key={s} onClick={() => setFormData({...formData, injury_severity: s})}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${formData.injury_severity === s 
                      ? 'bg-gradient-to-r from-[#4a0e8f] to-[#7c3aed] text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-[#0f2042] border border-white/5 text-slate-400 hover:border-purple-500/30'}`}>
                    {s === 'Minor' ? '🟢' : s === 'Moderate' ? '🟡' : '🔴'} {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Group Size + Environment — NEW */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 block">Group Size</label>
                <select 
                  value={formData.group_size} 
                  onChange={e => setFormData({...formData, group_size: parseInt(e.target.value)})}
                  className="w-full bg-[#0f2042] border border-white/5 rounded-xl p-2.5 text-white font-semibold outline-none focus:border-[#d4a843] transition text-sm"
                >
                  <option value={1}>👤 1 Person</option>
                  <option value={2}>👥 2 People</option>
                  <option value={3}>👥 3-4 People</option>
                  <option value={5}>👨‍👩‍👧‍👦 5+ People</option>
                  <option value={10}>🏘️ 10+ (Mass)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 block">Conditions</label>
                <select 
                  value={formData.environment} 
                  onChange={e => setFormData({...formData, environment: e.target.value})}
                  className="w-full bg-[#0f2042] border border-white/5 rounded-xl p-2.5 text-white font-semibold outline-none focus:border-[#d4a843] transition text-sm"
                >
                  <option value="Normal">☀️ Normal</option>
                  <option value="Night">🌙 Nighttime</option>
                  <option value="Rain">🌧️ Heavy Rain</option>
                  <option value="Extreme_Heat">🌡️ Extreme Heat</option>
                </select>
              </div>
            </div>

            {/* System Readings */}
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0f2042] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase"><i className="fa-solid fa-battery-half mr-1"></i>Power</span>
                <span className={`font-bold text-sm ${formData.battery_level < 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{formData.battery_level}%</span>
              </div>
              <div className="flex-1 bg-[#0f2042] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase"><i className="fa-solid fa-satellite mr-1"></i>GPS</span>
                <span className="font-bold text-sm text-emerald-400">LOCKED</span>
              </div>
            </div>

            {/* SOS Button or Confirmation */}
            {status === 'SENT' ? (
              <div className="bg-gradient-to-r from-purple-900/30 to-[#0f2042] border border-purple-500/20 rounded-2xl p-4">
                <h4 className="font-bold text-purple-300 flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-check-circle text-[#d4a843]"></i> Signal Transmitted
                </h4>
                <p className="text-[11px] text-slate-400 mb-2">AI Command logged your coordinates. Rescue routing in progress.</p>
                <div className="bg-[#0a1628] rounded-lg p-2.5 text-xs font-bold flex justify-between items-center">
                  <span className="text-slate-400">Unit Dispatch</span>
                  <span className="text-[#d4a843] animate-pulse">Routing...</span>
                </div>
                <button 
                  onClick={() => setStatus('IDLE')}
                  className="w-full mt-3 py-2 bg-[#0f2042] border border-white/10 text-slate-400 text-xs font-bold rounded-xl hover:bg-[#0f2042]/80 transition active:scale-95"
                >
                  <i className="fa-solid fa-rotate-left mr-1"></i> Send Another SOS
                </button>
              </div>
            ) : (
              <button 
                onClick={sendSOS} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-lg py-4 rounded-2xl shadow-[0_8px_30px_rgba(239,68,68,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <i className="fa-solid fa-satellite-dish"></i> {loading ? 'TRANSMITTING...' : 'TRANSMIT SOS'}
              </button>
            )}

            {!isOnline && offlineQueue.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left"></i> {offlineQueue.length} item(s) queued for sync
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Two-Way Chat */}
        <div className="flex-1 flex flex-col bg-[#080e1a]">
          <div className="h-12 bg-[#0f2042]/60 border-b border-white/5 flex items-center px-5 shrink-0">
            <i className="fa-solid fa-comments text-[#d4a843] mr-3"></i>
            <h2 className="font-bold text-white text-sm">Live Communication</h2>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {isOnline ? '● Server Connected' : '○ Offline Cache'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600">
                <div className="w-16 h-16 rounded-full bg-[#0f2042] flex items-center justify-center mb-4">
                  <i className="fa-solid fa-message text-2xl opacity-30"></i>
                </div>
                <p className="text-sm font-semibold">No messages yet</p>
                <p className="text-xs mt-1 text-slate-700">Rescuer instructions will appear here after your SOS.</p>
              </div>
            )}
            {messages.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.senderRole === 'VICTIM' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.senderRole === 'VICTIM' 
                    ? 'bg-gradient-to-r from-[#4a0e8f] to-[#6b21a8] text-white rounded-br-md' 
                    : 'bg-[#0f2042] border border-[#d4a843]/20 text-slate-200 rounded-bl-md'
                } ${msg.offline ? 'opacity-70 border-dashed' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {msg.senderRole === 'RESCUER' ? '🛡️ ' : ''}{msg.senderName}
                    </span>
                    {msg.offline && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">QUEUED</span>}
                  </div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] opacity-40 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className="p-4 border-t border-white/5 bg-[#0f2042]/40 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={isOnline ? "Type a message to rescue command..." : "Message queued for sync..."}
                className="flex-1 bg-[#0a1628] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-500/50 transition placeholder-slate-600"
              />
              <button 
                onClick={sendMessage}
                className="px-5 py-3 bg-gradient-to-r from-[#4a0e8f] to-[#7c3aed] text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-purple-500/20"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
