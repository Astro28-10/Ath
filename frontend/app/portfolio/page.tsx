'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  const projects = [
    { title: 'DeFi Yield Optimizer', desc: 'Automated yield farming strategy executor on Polygon', budget: '5.0 ETH', rating: 5, status: 'COMPLETED', date: '2024-04-10', skills: ['Solidity', 'React', 'Web3.js'] },
    { title: 'NFT Marketplace', desc: 'Full-stack ERC-721 marketplace with gas optimization', budget: '3.5 ETH', rating: 5, status: 'COMPLETED', date: '2024-03-22', skills: ['Solidity', 'Next.js', 'IPFS'] },
    { title: 'DAO Governance Portal', desc: 'Token-gated voting with delegation and timelock', budget: '4.0 ETH', rating: 4, status: 'COMPLETED', date: '2024-03-01', skills: ['Solidity', 'TypeScript', 'Hardhat'] },
    { title: 'Cross-Chain Bridge UI', desc: 'Frontend for multi-chain token transfers', budget: '2.5 ETH', rating: 5, status: 'COMPLETED', date: '2024-02-15', skills: ['React', 'ethers.js', 'GraphQL'] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="py-12"><div className="section-container"><h1 className="text-4xl font-bold tracking-tight mb-2">Portfolio</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Showcase your best work</p></div></section>

      <main className="section-container flex-1 pb-16">
        <div className="grid md:grid-cols-4 gap-6 mb-12 stagger-children">
          {[
            { label: 'Total Projects', value: projects.length },
            { label: 'Avg Rating', value: '4.75★' },
            { label: 'Total Earned', value: 'Ξ 15.0' },
            { label: 'Success Rate', value: '100%' },
          ].map((s, idx) => (
            <div key={idx} className="solid-card p-6 text-center">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">Projects</h2>
        <div className="space-y-4">
          {projects.map((p, idx) => (
            <div key={idx} className="solid-card p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.skills.map((s) => <span key={s} className="badge badge-blue">{s}</span>)}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg font-bold">{p.budget}</p>
                  <p className="text-sm" style={{ color: 'var(--accent-amber)' }}>{'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)}</p>
                  <span className="badge badge-emerald">{p.status}</span>
                  <p className="text-xs block mt-1" style={{ color: 'var(--text-muted)' }}>{p.date}</p>
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
