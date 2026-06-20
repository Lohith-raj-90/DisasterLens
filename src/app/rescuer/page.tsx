'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

export default function RescuerTerminal() {
  const router = useRouter();
  const [signals, setSignals] = useState<any[]>([]);
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [tab, setTab] = useState<'triage' | 'comms'>('triage');
  const [actionLoading, setActionLoading] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const fetchSignals = async () => {
    try {
      const res = await fetch('/api/sos/stream');
      const data = await res.json();
      if (data.signals) {
        setSignals(data.signals);
        if (activeSignal) {
          const updated = data.signals.find((s: any) => s.id === activeSignal.id);
          if (updated) setActiveSignal(updated);
          else setActiveSignal(null);
        }
      }
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages/stream');
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {}
  };

  useEffect(() => {
    fetchSignals();
    fetchMessages();
    const i1 = setInterval(fetchSignals, 5000);
    const i2 = setInterval(fetchMessages, 4000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelect = (id: string) => {
    const s = signals.find((x: any) => x.id === id);
    if (s) setActiveSignal(s);
  };

  const handleDispatch = async (signalId: string) => {
    setActionLoading('dispatch_' + signalId);
    try {
      await fetch('/api/sos/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalId, action: 'DISPATCHED' })
      });
      await fetchSignals();
      await fetchMessages();
      showToast('🚁 Rescue unit dispatched! Victim has been notified.', 'success');
    } catch { showToast('❌ Dispatch failed', 'error'); }
    setActionLoading('');
  };

  const handleResolve = async (signalId: string) => {
    setActionLoading('resolve_' + signalId);
    try {
      await fetch('/api/sos/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalId, action: 'RESOLVED' })
      });
      await fetchSignals();
      await fetchMessages();
      if (activeSignal?.id === signalId) setActiveSignal(null);
      showToast('✅ Signal resolved and removed from active grid.', 'success');
    } catch { showToast('❌ Resolve failed', 'error'); }
    setActionLoading('');
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          recipientId: activeSignal?.userId || null,
          signalId: activeSignal?.id || null
        })
      });
      setNewMessage('');
      fetchMessages();
    } catch {}
  };

  const getStatusBadge = (status: string) => {
    if (status === 'DISPATCHED') return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'DISPATCHED' };
    if (status === 'RESOLVED') return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'RESOLVED' };
    return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'PENDING' };
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-primary)] text-slate-50 overflow-hidden" style={{ fontFamily: "var(--font-display)" }}>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-[slideUp_0.3s_ease] ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          'bg-[var(--color-purple-royal)] text-white'
        }`}>
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <header className="h-16 bg-[var(--color-bg-secondary)]/90 border-b border-purple-500/10 flex items-center justify-between px-6 z-20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <i className="fa-solid fa-satellite-dish text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Disaster<span className="gold-shimmer">Lens</span></h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-semibold">Rescuer Command Terminal · Sector KA</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-sm font-semibold text-slate-300">System Live</span>
          <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
            {signals.length} Active
          </span>
          <button onClick={handleLogout} className="ml-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1.5">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[340px] bg-[var(--color-bg-secondary)]/40 flex flex-col border-r border-white/5 z-20 shrink-0">
          <div className="p-4 border-b border-white/5">
            <h2 className="type-h3 flex items-center gap-2"><i className="fa-solid fa-layer-group text-[var(--color-gold)]"></i> Active SOS Grid</h2>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">AI MCDM Ranked · Click to inspect</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {signals.map((sig: any) => {
              const score = sig.priority_score;
              const isCrit = score >= 60;
              const isHigh = score >= 35;
              const rankStr = isCrit ? 'CRITICAL' : (isHigh ? 'HIGH' : 'MEDIUM');
              const statusBadge = getStatusBadge(sig.status);

              return (
                <div
                  key={sig.id}
                  onClick={() => handleSelect(sig.id)}
                  className={`p-3 rounded-xl border cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-all group ${
                    activeSignal?.id === sig.id
                      ? 'border-[var(--color-gold)]/50 bg-[var(--color-bg-secondary)] shadow-[0_0_20px_rgba(212,168,67,0.1)]'
                      : (isCrit ? 'border-red-500/20' : 'border-white/5')
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-white">{sig.user?.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isCrit ? 'bg-red-500/20 text-red-400' : (isHigh ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400')
                    }`}>
                      {rankStr} [{score}]
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span><i className="fa-solid fa-truck-medical mr-1"></i>{sig.disaster_type}</span>
                    <span className={`${statusBadge.bg} ${statusBadge.text} px-2 py-0.5 rounded-full font-bold`}>{statusBadge.label}</span>
                  </div>

                  <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {sig.status === 'PENDING' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDispatch(sig.id); }}
                        disabled={actionLoading === 'dispatch_' + sig.id}
                        className="flex-1 py-1.5 btn-action-dispatch text-white text-[10px] font-bold rounded-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-helicopter"></i> {actionLoading === 'dispatch_' + sig.id ? '...' : 'Dispatch'}
                      </button>
                    )}
                    {sig.status !== 'RESOLVED' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleResolve(sig.id); }}
                        disabled={actionLoading === 'resolve_' + sig.id}
                        className="flex-1 py-1.5 btn-action-resolve text-white text-[10px] font-bold rounded-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-check"></i> {actionLoading === 'resolve_' + sig.id ? '...' : 'Resolve'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {signals.length === 0 && (
              <div className="text-center text-slate-600 mt-16">
                <i className="fa-solid fa-satellite-dish text-3xl mb-3 opacity-20"></i>
                <p className="text-sm">Awaiting incoming signals...</p>
              </div>
            )}
          </div>
        </aside>

        <section className="flex-1 relative z-10 w-full h-full">
          <MapComponent signals={signals} activeSignalId={activeSignal?.id} onMarkerClick={handleSelect} />
        </section>

        <aside className="w-[380px] bg-[var(--color-bg-secondary)]/60 border-l border-white/5 flex flex-col z-20 shrink-0">
          <div className="flex border-b border-white/5 shrink-0">
            <button onClick={() => setTab('triage')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition ${tab === 'triage' ? 'text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'text-slate-500 hover:text-slate-300'}`}>
              <i className="fa-solid fa-brain mr-1"></i> AI Triage
            </button>
            <button onClick={() => setTab('comms')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition ${tab === 'comms' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
              <i className="fa-solid fa-comments mr-1"></i> Comms
              {messages.length > 0 && <span className="ml-1 bg-purple-500/30 text-purple-300 text-[9px] px-1.5 py-0.5 rounded-full">{messages.length}</span>}
            </button>
          </div>

          {tab === 'triage' ? (
            !activeSignal ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-600">
                <i className="fa-solid fa-crosshairs text-4xl mb-3 opacity-20 animate-pulse"></i>
                <p className="text-sm">Select an SOS beacon to view AI analysis.</p>
              </div>
            ) : (
              <div className="flex-1 p-4 flex flex-col overflow-y-auto">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="type-h3 text-white">{activeSignal.user?.name}</h3>
                    <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${getStatusBadge(activeSignal.status).bg} ${getStatusBadge(activeSignal.status).text}`}>
                      {getStatusBadge(activeSignal.status).label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">{activeSignal.location_lat?.toFixed(4)}, {activeSignal.location_lng?.toFixed(4)}</p>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="bg-[var(--color-bg-primary)] p-3 rounded-xl border border-white/5 text-center">
                      <p className="text-[9px] uppercase text-slate-500 font-bold mb-1">Battery</p>
                      <p className={`font-bold text-sm ${activeSignal.battery_level < 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{activeSignal.battery_level}%</p>
                    </div>
                    <div className="bg-[var(--color-bg-primary)] p-3 rounded-xl border border-white/5 text-center">
                      <p className="text-[9px] uppercase text-slate-500 font-bold mb-1">Hazard</p>
                      <p className="font-bold text-sm text-slate-200">{activeSignal.disaster_type}</p>
                    </div>
                    <div className="bg-[var(--color-bg-primary)] p-3 rounded-xl border border-white/5 text-center">
                      <p className="text-[9px] uppercase text-slate-500 font-bold mb-1">Severity</p>
                      <p className="font-bold text-sm text-orange-400">{activeSignal.injury_severity}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--color-bg-primary)] border border-white/5 p-4 rounded-2xl mb-4">
                  <h4 className="type-xs uppercase font-bold text-[var(--color-gold)] mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-robot"></i> AI Reasoning Payload
                  </h4>
                  <div className="text-xs text-slate-300 font-mono leading-relaxed bg-black/30 p-3 rounded-xl">
                    {activeSignal.ai_explanation || 'Processing...'}
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  {activeSignal.status === 'PENDING' && (
                    <button
                      onClick={() => handleDispatch(activeSignal.id)}
                      disabled={actionLoading === 'dispatch_' + activeSignal.id}
                      className="w-full py-3.5 btn-action-dispatch-pulse text-white font-bold rounded-xl active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      <i className="fa-solid fa-helicopter"></i>
                      {actionLoading === 'dispatch_' + activeSignal.id ? 'Dispatching...' : 'Dispatch Rescue Unit'}
                    </button>
                  )}

                  {activeSignal.status === 'DISPATCHED' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 flex items-center gap-2">
                      <i className="fa-solid fa-truck-fast animate-pulse"></i>
                      <span className="font-bold">Unit en route — ETA calculating...</span>
                    </div>
                  )}

                  {activeSignal.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(activeSignal.id)}
                      disabled={actionLoading === 'resolve_' + activeSignal.id}
                      className="w-full py-3.5 btn-action-resolve text-white font-bold rounded-xl active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      <i className="fa-solid fa-check-double"></i>
                      {actionLoading === 'resolve_' + activeSignal.id ? 'Resolving...' : 'Mark Resolved & Remove'}
                    </button>
                  )}

                  <button
                    onClick={() => { setTab('comms'); }}
                    className="w-full py-3.5 gradient-purple text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(74,14,143,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <i className="fa-solid fa-comments"></i> Send Instructions to Victim
                  </button>

                  <button
                    onClick={() => alert('📡 Mesh broadcast initiated. SOS relay propagated to 3 nearby nodes.')}
                    className="w-full py-3 btn-ghost font-bold rounded-xl active:scale-[0.97] flex items-center justify-center gap-2 text-xs"
                  >
                    <i className="fa-solid fa-tower-broadcast"></i> Broadcast to Mesh Network
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600">
                    <i className="fa-solid fa-message text-3xl mb-3 opacity-20"></i>
                    <p className="text-sm">No communications yet.</p>
                    <p className="text-[10px] text-slate-700 mt-1">Dispatch a unit to auto-message the victim.</p>
                  </div>
                ) : (
                  messages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.senderRole === 'RESCUER' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.senderRole === 'RESCUER'
                          ? 'gradient-purple-dark text-white rounded-br-md'
                          : 'bg-[var(--color-bg-primary)] border border-amber-500/20 text-slate-200 rounded-bl-md'
                      }`}>
                        <div className="text-[9px] font-bold uppercase tracking-wider opacity-60 mb-1">
                          {msg.senderRole === 'VICTIM' ? '🆘 ' : '🛡️ '}{msg.senderName}
                        </div>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className="text-[9px] opacity-30 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef}></div>
              </div>

              <div className="p-3 border-t border-white/5 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Send rescue instructions..."
                    className="flex-1 bg-[var(--color-bg-primary)] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-gold)]/50 transition placeholder-slate-600"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-5 py-3 gradient-purple text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
