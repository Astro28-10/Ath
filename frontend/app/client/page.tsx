'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:3001/api';
type FreelancerReputation = { reputationScore: number; credentialCount: number; averageRating: number };

export default function ClientCreateProject() {
  const [step, setStep] = useState(1);
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('7');
  const [description, setDescription] = useState('');
  const [reputation, setReputation] = useState<FreelancerReputation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookupReputation = async () => {
    if (!freelancerAddress) { setError('Address required'); return; }
    try { setError(''); setLoading(true); const response = await axios.get(`${API_BASE}/reputation/${freelancerAddress}`); setReputation(response.data); setStep(2); } catch { setError('Not found'); } finally { setLoading(false); }
  };

  const handleCreateProject = async () => {
    try { setError(''); setLoading(true); await axios.post(`${API_BASE}/projects`, { clientAddress: '0xClientAddressHere', freelancerAddress, amount, duration: parseInt(duration), description }); setStep(4); } catch { setError('Failed'); } finally { setLoading(false); }
  };

  const reputationDiscount = reputation ? 100 - reputation.reputationScore / 100 : 0;
  const discountedAmount = amount ? (parseFloat(amount) * (100 - reputationDiscount) / 100).toFixed(4) : '0';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12"><div className="section-container"><div className="flex items-center justify-between"><h1 className="text-4xl font-bold tracking-tight">Create Project</h1><Link href="/history"><button className="btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>Your Projects</button></Link></div></div></section>

      <div className="section-container flex-1 pb-16" style={{ maxWidth: '800px' }}>
        {/* Step indicator */}
        <div className="flex gap-4 mb-12">
          {[{ n: 1, l: 'Find' }, { n: 2, l: 'Budget' }, { n: 3, l: 'Review' }, { n: 4, l: 'Done' }].map((s) => (
            <div key={s.n} className="flex-1">
              <div className="h-1.5 rounded-full mb-2" style={{ background: step >= s.n ? 'var(--accent-blue)' : 'var(--border-default)' }} />
              <p className="text-xs font-medium" style={{ color: step >= s.n ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.l}</p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Find Talent</h2>
            <div className="solid-card p-8">
              <p className="label">Freelancer Address</p>
              <input type="text" value={freelancerAddress} onChange={(e) => { setFreelancerAddress(e.target.value); setError(''); }} placeholder="0x1234..." className="input-field mb-4" />
              {error && <div className="p-3 rounded-lg mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}><p className="text-sm" style={{ color: 'var(--accent-rose)' }}>{error}</p></div>}
              <button onClick={handleLookupReputation} disabled={!freelancerAddress || loading} className="btn-primary w-full">{loading ? 'Checking...' : 'Check Reputation'}</button>
            </div>
          </div>
        )}

        {step === 2 && reputation && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Budget & Details</h2>
            <div className="solid-card p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div><p className="label">Reputation</p><p className="text-3xl font-bold gradient-text">{(reputation.reputationScore / 100).toFixed(0)}%</p></div>
                <div><p className="label">Your Discount</p><p className="text-3xl font-bold" style={{ color: 'var(--accent-emerald)' }}>{reputationDiscount.toFixed(0)}%</p></div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm" style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
                <div><p className="label">Projects</p><p className="text-xl font-bold">{reputation.credentialCount}</p></div>
                <div><p className="label">Rating</p><p className="text-xl font-bold">{reputation.averageRating}★</p></div>
              </div>
            </div>

            <div className="solid-card p-6 space-y-5">
              <div><p className="label">Budget (ETH)</p><input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2.5" className="input-field text-lg font-bold" /></div>
              {amount && (
                <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Original</span><span className="font-semibold">Ξ {parseFloat(amount).toFixed(4)}</span></div>
                  <div className="flex justify-between" style={{ color: 'var(--accent-emerald)' }}><span>Discount ({reputationDiscount.toFixed(0)}%)</span><span className="font-semibold">-Ξ {(parseFloat(amount) * reputationDiscount / 100).toFixed(4)}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: '1px solid var(--border-default)' }}><span>You Pay</span><span>Ξ {discountedAmount}</span></div>
                </div>
              )}
              <div><p className="label">Timeline</p><select value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field">{[3, 5, 7, 14, 30].map((d) => <option key={d} value={d}>{d} days</option>)}</select></div>
              <div><p className="label">Description</p><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What needs to be built?" rows={4} className="input-field" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }} /></div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} disabled={!amount || !description} className="btn-primary flex-1">Review</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && reputation && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold">Review & Fund</h2>
            <div className="solid-card p-6 space-y-6">
              <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '16px' }}>
                <p className="label">Freelancer</p>
                <p className="text-sm break-all mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{freelancerAddress}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reputation</p><p className="font-bold">{(reputation.reputationScore / 100).toFixed(0)}%</p></div>
                  <div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Projects</p><p className="font-bold">{reputation.credentialCount}</p></div>
                  <div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Rating</p><p className="font-bold">{reputation.averageRating}★</p></div>
                </div>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '16px' }}>
                <p className="label">Project</p>
                <p className="text-sm mb-1">{duration} days</p>
                <p className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{description}</p>
              </div>
              <div className="p-4 rounded-lg space-y-2 text-sm" style={{ background: 'var(--bg-elevated)' }}>
                <p className="label">Cost Breakdown</p>
                <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Original</span><span className="font-semibold">Ξ {parseFloat(amount).toFixed(4)}</span></div>
                <div className="flex justify-between font-semibold" style={{ color: 'var(--accent-emerald)' }}><span>Discount</span><span>-Ξ {(parseFloat(amount) * reputationDiscount / 100).toFixed(4)}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: '1px solid var(--border-default)' }}><span>Total</span><span>Ξ {discountedAmount}</span></div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={handleCreateProject} disabled={loading} className="btn-primary flex-1">{loading ? 'Funding...' : 'Fund Escrow'}</button>
              </div>
              {error && <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}><p className="text-sm" style={{ color: 'var(--accent-rose)' }}>{error}</p></div>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <div className="solid-card p-8 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <span className="text-2xl" style={{ color: 'var(--accent-emerald)' }}>✓</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Project Created</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Escrow funded and freelancer notified</p>
              <div className="p-4 rounded-lg mb-8" style={{ background: 'var(--bg-elevated)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Amount Funded</p>
                <p className="text-3xl font-bold gradient-text mb-1">Ξ {discountedAmount}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--accent-emerald)' }}>Saved Ξ {(parseFloat(amount) * reputationDiscount / 100).toFixed(4)}</p>
              </div>
              <Link href="/"><button className="btn-primary w-full">Back to Home</button></Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
