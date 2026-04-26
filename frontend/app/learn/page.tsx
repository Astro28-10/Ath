'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'calculation' | 'onchain' | 'credentials' | 'system'>('calculation');

  const tabs = [
    { id: 'calculation' as const, label: 'Reputation Scoring' },
    { id: 'onchain' as const, label: 'Why On-Chain' },
    { id: 'credentials' as const, label: 'W3C Credentials' },
    { id: 'system' as const, label: 'Full System' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="py-20">
        <div className="section-container">
          <div className="badge badge-violet mb-6">Learn the System</div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4 tracking-tight gradient-text">
            Why Reputation Matters
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Reputation on SkillBond is cryptographic proof of your track record. It unlocks discounts, enables portability, and powers fair arbitration.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="section-container py-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2.5 text-xs font-medium rounded-lg transition-all duration-200"
                style={{
                  background: activeTab === tab.id ? 'var(--accent-blue)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 flex-1">
        <div className="section-container">
          {activeTab === 'calculation' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">How Reputation is Calculated</h2>
                <p style={{ color: 'var(--text-secondary)' }}>A transparent, on-chain metric derived from your project history, ratings, and dispute outcomes.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 stagger-children">
                {[
                  { title: 'Project Completion', factor: 50, desc: 'Each completed project adds 10-50 points. Failed projects subtract.', example: '10 projects: +500 pts' },
                  { title: 'Client Ratings', factor: 30, desc: '5-star ratings boost reputation most. Low ratings penalize.', example: '4.9 avg: +30% bonus' },
                  { title: 'Dispute History', factor: 20, desc: 'Clean history builds trust. Dispute losses reduce reputation.', example: '0 disputes: +20% bonus' },
                ].map((f, idx) => (
                  <div key={idx} className="solid-card p-6">
                    <p className="label" style={{ color: 'var(--accent-blue-light)' }}>{f.title}</p>
                    <p className="text-3xl font-bold gradient-text mb-3">{f.factor}%</p>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                    <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
                      <p className="text-xs" style={{ color: 'var(--accent-violet-light)' }}>{f.example}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formula */}
              <div className="solid-card p-6" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
                <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Reputation Formula</p>
                <div className="p-4 rounded-lg overflow-x-auto text-sm mt-2" style={{ background: 'var(--bg-primary)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  <pre>{`score = (
  (completed × 10) + (avg_rating × 5) + (on_time × 2)
  - (failed × 15) - (dispute_loss × 20)
) / max_possible × 10000`}</pre>
                </div>
              </div>

              {/* Progression */}
              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Progression Example</p>
                <div className="space-y-2 mt-4">
                  {[
                    { milestone: 'Day 1', events: 'First project completed', score: 150, label: 'Beginner' },
                    { milestone: 'Week 2', events: '5 projects, 4.8★ avg', score: 800, label: 'Emerging' },
                    { milestone: 'Month 1', events: '20 projects, 1 dispute (won)', score: 1500, label: 'Trusted' },
                    { milestone: 'Month 6', events: '100 projects, 4.9★ avg', score: 7200, label: 'Established' },
                    { milestone: 'Year 1', events: '250+ projects, 0 losses', score: 9500, label: 'Elite' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-3 rounded-lg transition-colors" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="w-20 flex-shrink-0">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{item.milestone}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{item.events}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold gradient-text">{item.score}</p>
                        <p className="text-xs" style={{ color: 'var(--accent-violet-light)' }}>{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'onchain' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Why Reputation Must Be On-Chain</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Storing reputation on Polygon ensures it&apos;s immutable, verifiable, and portable.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Immutability', desc: 'Once recorded, reputation cannot be altered, faked, or deleted.', benefit: 'Permanent proof of track record' },
                  { title: 'Transparency', desc: 'All changes are auditable. Anyone can verify and trace history.', benefit: 'No hidden algorithms' },
                  { title: 'Portability', desc: 'Your reputation lives in your wallet, usable by any application.', benefit: 'Your reputation is YOUR asset' },
                  { title: 'Decentralization', desc: 'No single entity controls reputation. Rules are permanent.', benefit: 'Fair, unbiased, forever' },
                ].map((b, idx) => (
                  <div key={idx} className="solid-card p-6" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--accent-violet-light)' }}>{b.title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
                    <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{b.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Technical Details</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2" style={{ color: 'var(--accent-blue-light)' }}>Polygon Amoy (Testnet)</p>
                    <ul className="space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Block finality in ~2 seconds</li>
                      <li>• ~$0.001 per transaction</li>
                      <li>• 1000s of txn/sec capacity</li>
                      <li>• EVM compatible (Solidity)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2" style={{ color: 'var(--accent-blue-light)' }}>Smart Contracts</p>
                    <ul className="space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <li>• ReputationRegistry: Core scoring</li>
                      <li>• EscrowContract: Fund management</li>
                      <li>• Open source & auditable</li>
                      <li>• Upgradeable pattern</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="solid-card p-6" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                <p className="label" style={{ color: 'var(--accent-amber)' }}>Verify Yourself</p>
                <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>Check any freelancer&apos;s reputation directly on the blockchain:</p>
                <a
                  href="https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex"
                  style={{ fontSize: '12px' }}
                >
                  View on PolygonScan →
                </a>
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">W3C Verifiable Credentials</h2>
                <p style={{ color: 'var(--text-secondary)' }}>International standard for digital credentials — cryptographically verified by anyone.</p>
              </div>

              <div className="solid-card p-6">
                <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Credential Lifecycle</p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    { phase: 'Issued', desc: 'SkillBond signs your credential with private key', color: 'var(--accent-blue)' },
                    { phase: 'Presented', desc: 'You share it to prove your reputation', color: 'var(--accent-violet)' },
                    { phase: 'Verified', desc: 'Anyone can verify it is genuine', color: 'var(--accent-emerald)' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-1 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: p.color }}>{p.phase}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="solid-card p-6" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
                <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Credential Structure (JSON-LD)</p>
                <div className="p-4 rounded-lg overflow-x-auto text-xs mt-2" style={{ background: 'var(--bg-primary)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  <pre>{`{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "SkillBondCredential"],
  "issuer": "did:polygon:0x1B1C962B...7ba02",
  "credentialSubject": {
    "reputation": 9500,
    "projectsCompleted": 150,
    "averageRating": 4.9
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "signatureValue": "0x7a8b9c0d..."
  }
}`}</pre>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: '🎓', title: 'Freelance Platforms', desc: 'Add to Upwork, Fiverr, Toptal profile' },
                  { icon: '💼', title: 'Job Applications', desc: 'Prove track record to employers' },
                  { icon: '🤝', title: 'Client Partnerships', desc: 'Share with clients for trust' },
                  { icon: '📱', title: 'Social Profiles', desc: 'Add badge to LinkedIn, Twitter' },
                ].map((u, idx) => (
                  <div key={idx} className="solid-card p-5 flex gap-4 items-start">
                    <span className="text-2xl">{u.icon}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--accent-blue-light)' }}>{u.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{u.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">The Full System</h2>
                <p style={{ color: 'var(--text-secondary)' }}>How reputation, credentials, escrow, and arbitration create a fair marketplace.</p>
              </div>

              <div className="solid-card p-6 space-y-6">
                <p className="label" style={{ color: 'var(--accent-blue-light)' }}>System Architecture</p>
                {[
                  { phase: 'Onboarding', steps: ['Connect wallet', 'ReputationRegistry entry created', 'Initial score: 5000 (50%)', 'W3C credential issued'] },
                  { phase: 'Project Execution', steps: ['Client checks reputation', 'Escrow cost calculated with discount', 'Client funds escrow', 'Freelancer delivers', 'Client rates 1-5 stars', 'Reputation auto-updates'] },
                  { phase: 'Dispute Resolution', steps: ['Either party initiates within 7 days', 'Evidence submitted on-chain', 'Smart contract analyzes scores', 'Verdict released, funds distributed'] },
                  { phase: 'Credential Generation', steps: ['Project completes', 'W3C credential issued with proof', 'QR code links to verification', 'Credential added to wallet'] },
                ].map((p, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-1 rounded-full flex-shrink-0" style={{ background: 'var(--accent-violet)' }} />
                    <div>
                      <p className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-violet-light)' }}>{idx + 1}. {p.phase}</p>
                      <ul className="space-y-1">
                        {p.steps.map((s, si) => (
                          <li key={si} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--accent-blue-light)' }}>→</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Arbitration Time', value: '24 hours' },
                  { label: 'Protocol Fee', value: '0.5%' },
                  { label: 'Credential Validity', value: 'Permanent' },
                  { label: 'Maximum Discount', value: '30%' },
                ].map((m, idx) => (
                  <div key={idx} className="solid-card p-5 text-center">
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                    <p className="text-xl font-bold gradient-text">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ borderTop: '1px solid var(--border-default)' }}>
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to See It In Action?</h2>
          <Link href="/simulate"><button className="btn-primary">Try Interactive Demo →</button></Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
