'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Certificate {
  id: string;
  freelancer: string;
  issueDate: string;
  reputation: number;
  credentials: number;
}

const mockCertificates: Certificate[] = [
  { id: uuidv4(), freelancer: 'alice.eth', issueDate: '2024-04-20', reputation: 95, credentials: 5 },
  { id: uuidv4(), freelancer: 'bob.eth', issueDate: '2024-04-19', reputation: 72, credentials: 3 },
  { id: uuidv4(), freelancer: 'carol.eth', issueDate: '2024-04-18', reputation: 40, credentials: 1 },
];

export default function CertificatesPage() {
  const [certificates] = useState(mockCertificates);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-12">
        <div className="section-container">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Certificates</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Blockchain-verified credentials</p>
        </div>
      </section>

      <main className="section-container flex-1 pb-16">
        {/* Info */}
        <div className="solid-card p-6 mb-10" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
          <h2 className="font-semibold text-lg mb-2">What are SkillBond Certificates?</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tamper-proof, blockchain-verified credentials that prove a freelancer&apos;s reputation. Permanently recorded on Polygon Amoy — immutable proof of work excellence.
          </p>
        </div>

        {/* Grid */}
        <h2 className="text-xl font-bold mb-6">Issued Certificates ({certificates.length})</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {certificates.map((cert) => (
            <Link key={cert.id} href={`/certificate/${cert.id}`}>
              <div className="solid-card p-6 group cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <span className="text-lg">📜</span>
                  </div>
                  <h3 className="text-lg font-bold">{cert.freelancer}</h3>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Reputation</span>
                    <span className="font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{cert.reputation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Credentials</span>
                    <span className="font-semibold" style={{ color: 'var(--accent-violet-light)' }}>{cert.credentials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Issued</span>
                    <span className="font-semibold">{cert.issueDate}</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
                  <p className="text-xs truncate" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{cert.id}</p>
                </div>
                <button className="btn-secondary w-full mt-4" style={{ fontSize: '12px', padding: '8px' }}>View & Verify</button>
              </div>
            </Link>
          ))}
        </div>

        {/* Why */}
        <h2 className="text-xl font-bold mb-6">Why Blockchain Certificates?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🔒', title: 'Immutable', desc: 'Cannot be modified or deleted once issued.' },
            { icon: '🌍', title: 'Publicly Verifiable', desc: 'Anyone can verify using PolygonScan.' },
            { icon: '🎯', title: 'Decentralized', desc: 'No single point of failure.' },
          ].map((f, idx) => (
            <div key={idx} className="solid-card p-6">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
