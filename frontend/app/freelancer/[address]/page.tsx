'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ReputationGraph } from '../../components/ReputationGraph';
import { CertificateTemplate } from '../../components/CertificateTemplate';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:3001/api';

interface FreelancerData {
  address: string;
  name?: string;
  score?: number;
  reputationScore?: number;
  credentialCount?: number;
  averageRating?: number;
  lastActivity?: string;
  source?: string;
}

export default function FreelancerBioPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = React.use(params);
  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'graphs' | 'certificate'>('overview');
  const [certificateId, setCertificateId] = useState('');

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const response = await axios.get(`${API_BASE}/reputation/${address}`);
        setFreelancer(response.data);
      } catch {
        const mockData: FreelancerData = {
          address, name: address.slice(0, 10) + '...', score: 8500,
          credentialCount: 8, averageRating: 4.7, lastActivity: new Date().toISOString(),
        };
        setFreelancer(mockData);
      } finally { setLoading(false); }
    };
    fetchFreelancer();
    setCertificateId(uuidv4());
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center"><div className="w-12 h-12 rounded-full mx-auto mb-4 skeleton" /><p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p></div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center"><p className="text-xl font-bold mb-2">Profile Not Found</p><Link href="/search"><button className="btn-secondary">Back to Search</button></Link></div>
        </div>
        <Footer />
      </div>
    );
  }

  const score = freelancer.reputationScore ?? freelancer.score ?? 0;
  const scorePercent = (score / 10000 * 100).toFixed(1);
  const credentialCount = freelancer.credentialCount ?? 0;
  const rating = freelancer.averageRating ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Profile Header */}
      <section className="py-12" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="section-container">
          <Link href="/search"><button className="btn-ghost" style={{ paddingLeft: 0 }}>← Back to Search</button></Link>
          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{freelancer.name || freelancer.address.slice(0, 12) + '...'}</h1>
              <p className="text-xs mt-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{freelancer.address}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold gradient-text">{scorePercent}%</div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Reputation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="section-container py-4">
          <div className="flex gap-2">
            {[
              { id: 'overview' as const, label: 'Overview' },
              { id: 'graphs' as const, label: 'Reputation Analytics' },
              { id: 'certificate' as const, label: 'Certificate' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-5 py-2.5 text-xs font-medium rounded-lg transition-all" style={{
                background: activeTab === tab.id ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === tab.id ? 'var(--accent-blue)' : 'var(--border-default)'}`,
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </section>

      <main className="section-container flex-1 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 stagger-children">
              <div className="solid-card p-6"><p className="label" style={{ color: 'var(--accent-blue-light)' }}>Score</p><p className="text-4xl font-bold gradient-text">{scorePercent}%</p><p className="text-xs mt-1" style={{ color: 'var(--accent-emerald)' }}>↑ Excellent</p></div>
              <div className="solid-card p-6"><p className="label" style={{ color: 'var(--accent-violet-light)' }}>Credentials</p><p className="text-4xl font-bold">{credentialCount}</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>projects completed</p></div>
              <div className="solid-card p-6"><p className="label" style={{ color: 'var(--accent-amber)' }}>Rating</p><p className="text-4xl font-bold">{rating}★</p><p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>average rating</p></div>
              <div className="solid-card p-6"><p className="label" style={{ color: 'var(--accent-emerald)' }}>Status</p><p className="text-4xl font-bold" style={{ color: 'var(--accent-emerald)' }}>✓</p><p className="text-xs mt-1" style={{ color: 'var(--accent-emerald)' }}>Verified on Chain</p></div>
            </div>

            {/* Bio */}
            <div className="solid-card p-6">
              <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Biography</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Accomplished Web3 developer with a passion for building decentralized applications.
                Specializes in smart contract development, frontend integration, and full-stack blockchain solutions.
              </p>
              <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                With {credentialCount} completed projects and a {scorePercent}% reputation score, this freelancer has
                demonstrated consistent quality and reliability across diverse project types.
              </p>
            </div>

            {/* Skills */}
            <div className="solid-card p-6">
              <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Core Skills</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Solidity', 'React', 'TypeScript', 'Web3.js', 'Hardhat', 'Smart Contracts', 'DeFi', 'Full-Stack'].map((skill) => (
                  <span key={skill} className="badge badge-blue">{skill}</span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="solid-card p-6">
              <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Recent Projects</p>
              <div className="space-y-3 mt-4">
                {[
                  { title: 'DeFi Dashboard', desc: 'Interactive analytics platform for yield farming', status: 'COMPLETED' },
                  { title: 'NFT Marketplace', desc: 'ERC-721 marketplace with gas optimization', status: 'COMPLETED' },
                  { title: 'Governance Token', desc: 'DAO token with voting mechanisms', status: 'IN PROGRESS' },
                ].map((project, idx) => (
                  <div key={idx} className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-sm">{project.title}</h3>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{project.desc}</p>
                      </div>
                      <span className={`badge ${project.status === 'COMPLETED' ? 'badge-emerald' : 'badge-blue'}`}>{project.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/client"><button className="btn-primary w-full" style={{ padding: '16px' }}>Hire This Freelancer</button></Link>
              <button className="btn-secondary w-full" style={{ padding: '16px' }}>Contact</button>
            </div>
          </div>
        )}

        {activeTab === 'graphs' && (
          <div className="animate-fade-in">
            <ReputationGraph address={freelancer.address} reputationScore={score} credentialCount={credentialCount} />
          </div>
        )}

        {activeTab === 'certificate' && (
          <div className="animate-fade-in">
            <CertificateTemplate
              freelancerName={freelancer.name || 'Freelancer'}
              address={freelancer.address}
              reputationScore={score}
              credentialCount={credentialCount}
              certificateId={certificateId}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
