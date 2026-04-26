'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:3001/api';

export default function VerifyPage() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await axios.get(`${API_BASE}/reputation/${address}`);
      setResult(response.data);
    } catch { setError('Unable to verify.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12"><div className="section-container"><h1 className="text-4xl font-bold tracking-tight mb-2">Verify Credential</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Check any freelancer&apos;s on-chain reputation</p></div></section>

      <main className="section-container flex-1 pb-16" style={{ maxWidth: '700px' }}>
        <div className="solid-card p-8 mb-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="label">Wallet Address</p>
            <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setError(''); }} placeholder="0x..." className="input-field" />
            <button type="submit" disabled={!address.trim() || loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify'}</button>
          </form>
        </div>

        {error && <div className="solid-card p-4 mb-6" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}><p className="text-sm" style={{ color: 'var(--accent-rose)' }}>{error}</p></div>}

        {result && (
          <div className="animate-fade-in space-y-6">
            <div className="solid-card p-6" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <span className="text-lg" style={{ color: 'var(--accent-emerald)' }}>✓</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--accent-emerald)' }}>Verified On-Chain</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Polygon Amoy Blockchain</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div><p className="label">Score</p><p className="text-3xl font-bold gradient-text">{(result.reputationScore / 100).toFixed(1)}%</p></div>
                <div><p className="label">Projects</p><p className="text-3xl font-bold">{result.credentialCount}</p></div>
                <div><p className="label">Rating</p><p className="text-3xl font-bold">{result.averageRating}★</p></div>
              </div>
            </div>
            <a href={`https://amoy.polygonscan.com/address/${address}`} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full flex items-center justify-center">View on PolygonScan →</a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
