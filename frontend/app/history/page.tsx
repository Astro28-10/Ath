'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HistoryPage() {
  const projects = [
    { id: 'proj-001', title: 'DeFi Dashboard', client: 'TechCorp', amount: '2.5 ETH', status: 'COMPLETED', date: '2024-04-15', rating: 5 },
    { id: 'proj-002', title: 'Smart Contract Audit', client: 'DeFi Labs', amount: '5.0 ETH', status: 'COMPLETED', date: '2024-03-28', rating: 5 },
    { id: 'proj-003', title: 'NFT Marketplace', client: 'ArtDAO', amount: '3.5 ETH', status: 'IN PROGRESS', date: '2024-04-20', rating: 0 },
    { id: 'proj-004', title: 'Token Vesting Contract', client: 'StartupXYZ', amount: '1.8 ETH', status: 'COMPLETED', date: '2024-02-10', rating: 4 },
    { id: 'proj-005', title: 'API Integration', client: 'Enterprise Inc', amount: '3.0 ETH', status: 'DISPUTED', date: '2024-01-25', rating: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12"><div className="section-container"><h1 className="text-4xl font-bold tracking-tight mb-2">Project History</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Timeline of all your projects</p></div></section>

      <main className="section-container flex-1 pb-16">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12 stagger-children">
          {[
            { label: 'Total Projects', value: projects.length.toString() },
            { label: 'Completed', value: projects.filter((p) => p.status === 'COMPLETED').length.toString() },
            { label: 'In Progress', value: projects.filter((p) => p.status === 'IN PROGRESS').length.toString() },
            { label: 'Total Earned', value: 'Ξ 15.8' },
          ].map((stat, idx) => (
            <div key={idx} className="solid-card p-6 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="solid-card p-6">
              <div className="grid md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Client: {p.client}</p>
                </div>
                <div>
                  <p className="font-semibold">{p.amount}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.date}</p>
                </div>
                <div>
                  <span className={`badge ${p.status === 'COMPLETED' ? 'badge-emerald' : p.status === 'IN PROGRESS' ? 'badge-blue' : 'badge-rose'}`}>
                    {p.status}
                  </span>
                </div>
                <div className="md:text-right">
                  {p.rating > 0 && <p className="text-sm" style={{ color: 'var(--accent-amber)' }}>{'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
