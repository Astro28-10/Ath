'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:3001/api';

interface ReputationData { reputationScore: number; credentialCount: number; averageRating: number; lastActivity?: string; }

export default function FreelancerDashboard() {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true); setError('');
    try {
      const response = await axios.get(`${API_BASE}/reputation/${address}`);
      setData(response.data);
    } catch { setError('Unable to fetch. Check the address.'); } finally { setLoading(false); }
  };

  const score = data ? (data.reputationScore / 100).toFixed(1) : '0';
  const tier = data ? (data.reputationScore >= 8000 ? 'Elite' : data.reputationScore >= 5000 ? 'Trusted' : data.reputationScore >= 2000 ? 'Emerging' : 'New') : 'N/A';
  const discount = data ? Math.round(data.reputationScore / 333) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12"><div className="section-container"><h1 className="text-4xl font-bold tracking-tight mb-2">Freelancer Dashboard</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Check your on-chain reputation</p></div></section>

      <main className="section-container flex-1 pb-16">
        {/* Lookup */}
        <div className="solid-card p-8 mb-10" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleLookup} className="space-y-4">
            <p className="label">Your Wallet Address</p>
            <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); setError(''); }} placeholder="0x..." className="input-field" />
            <button type="submit" disabled={!address.trim() || loading} className="btn-primary w-full">{loading ? 'Loading...' : 'Check Reputation'}</button>
          </form>
          {error && <div className="p-3 mt-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}><p className="text-sm" style={{ color: 'var(--accent-rose)' }}>{error}</p></div>}
        </div>

        {data && (
          <div className="animate-fade-in space-y-8">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 stagger-children">
              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Score</p>
                <p className="text-4xl font-bold gradient-text">{score}%</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{tier}</p>
              </div>
              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Credentials</p>
                <p className="text-4xl font-bold">{data.credentialCount}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Projects</p>
              </div>
              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-amber)' }}>Rating</p>
                <p className="text-4xl font-bold">{data.averageRating}★</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Avg</p>
              </div>
              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-emerald)' }}>Discount</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-emerald)' }}>{discount}%</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>On escrow</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href={`/freelancer/${address}`} className="solid-card p-6 group block">
                <p className="font-semibold mb-1">Public Profile</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>View full profile</p>
              </Link>
              <Link href="/portfolio" className="solid-card p-6 group block">
                <p className="font-semibold mb-1">Portfolio</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Manage your showcase</p>
              </Link>
              <Link href="/certificates" className="solid-card p-6 group block">
                <p className="font-semibold mb-1">Certificates</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>View earned credentials</p>
              </Link>
            </div>

            {/* Verify */}
            <div className="solid-card p-6" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
              <p className="label" style={{ color: 'var(--accent-amber)' }}>On-Chain Verification</p>
              <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>Check your reputation directly on the blockchain.</p>
              <a href={`https://amoy.polygonscan.com/address/${address}`} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex" style={{ fontSize: '12px' }}>View on PolygonScan →</a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
