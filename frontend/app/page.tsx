'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  const [reputationScore, setReputationScore] = useState(0);
  const targetScore = 85;

  useEffect(() => {
    const interval = setInterval(() => {
      setReputationScore((prev) => {
        if (prev < targetScore) return prev + 1;
        return prev;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const escrowSaving = (0.2 * (reputationScore / 100)).toFixed(3);
  const freelancerGets = (0.8 + 0.2 * (reputationScore / 100)).toFixed(3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
          }}
        />

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Message */}
            <div className="animate-fade-in">
              <div className="badge badge-blue mb-6">
                <span className="status-dot status-dot-live" />
                Reputation-Backed Escrow Protocol
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                <span className="gradient-text">Your reputation</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>is worth money.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                Freelancers with proven track records get instant discounts on escrow costs.
                Build verifiable credentials that follow you across every platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/simulate">
                  <button className="btn-primary w-full sm:w-auto">
                    Try Interactive Demo
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 12l4-4-4-4" />
                    </svg>
                  </button>
                </Link>
                <Link href="/search">
                  <button className="btn-secondary w-full sm:w-auto">Discover Talent</button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8">
                {[
                  { value: '58%', label: 'freelancers face non-payment' },
                  { value: '$13.8B', label: 'projected market by 2030' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Live Reputation Card */}
            <div className="animate-slide-up">
              <div
                className="glass-card p-8"
                style={{ borderColor: 'rgba(59,130,246,0.2)' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <p className="label" style={{ color: 'var(--accent-blue-light)', margin: 0 }}>Live Reputation Impact</p>
                  <div className="badge badge-emerald" style={{ fontSize: '10px' }}>
                    <span className="status-dot status-dot-live" style={{ width: 6, height: 6 }} />
                    LIVE
                  </div>
                </div>

                {/* Score */}
                <div className="mb-6">
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Freelancer Reputation</p>
                  <div className="text-6xl font-extrabold gradient-text tracking-tight">{reputationScore}%</div>
                  <div
                    className="mt-4 h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${reputationScore}%`,
                        background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-violet))',
                      }}
                    />
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="space-y-4 pt-6" style={{ borderTop: '1px solid var(--border-default)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>On a 1.0 ETH project</p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Escrow Cost</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent-rose)' }}>
                      {(0.2 * (1 - reputationScore / 100)).toFixed(3)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Freelancer Receives</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent-emerald)' }}>{freelancerGets} ETH</span>
                  </div>
                </div>

                {/* Savings highlight */}
                <div
                  className="mt-6 p-4 rounded-lg"
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent-emerald)' }}>TOTAL SAVINGS</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent-emerald)' }}>{escrowSaving} ETH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="section-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {[
              { value: '12,847', label: 'Active Users' },
              { value: '48,392', label: 'Projects Completed' },
              { value: 'Ξ 2,847', label: 'Total Volume' },
              { value: '18%', label: 'Avg Discount' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="label" style={{ color: 'var(--accent-violet-light)' }}>How It Works</p>
            <h2 className="text-4xl font-bold mt-3 tracking-tight">Four steps to portable reputation</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 stagger-children">
            {[
              { step: '01', title: 'Check Reputation', desc: 'Verify freelancer track record directly on-chain', icon: '⚡' },
              { step: '02', title: 'Lower Costs', desc: 'Automatic discount applied based on reputation score', icon: '💰' },
              { step: '03', title: 'Complete Work', desc: 'Fund escrow, deliver work, approve delivery', icon: '✓' },
              { step: '04', title: 'Earn Credential', desc: 'Get W3C verified proof — portable everywhere', icon: '📜' },
            ].map((item) => (
              <div key={item.step} className="solid-card p-6 group">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 text-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  {item.icon}
                </div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-blue-light)' }}>Step {item.step}</p>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Why SkillBond</p>
            <h2 className="text-4xl font-bold mt-3 tracking-tight">Reputation as a first-class asset</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { title: 'Cryptographically Signed', desc: 'ECDSA proofs ensure every credential is authentic and tamper-proof.', color: 'var(--accent-blue)' },
              { title: 'Cross-Platform Portable', desc: 'W3C credentials work on any platform — Upwork, Fiverr, LinkedIn, anywhere.', color: 'var(--accent-violet)' },
              { title: 'Instant Discounts', desc: 'High reputation = lower escrow costs. Save 15-30% on every project.', color: 'var(--accent-emerald)' },
              { title: 'Transparent Scoring', desc: 'See exactly how your score is calculated. No hidden algorithms.', color: 'var(--accent-blue-light)' },
              { title: 'Fair Disputes', desc: 'Smart contract arbitration with transparent, on-chain logic.', color: 'var(--accent-amber)' },
              { title: 'Owned By You', desc: 'Your credentials live in your wallet, not locked to any platform.', color: 'var(--accent-violet-light)' },
            ].map((feature, idx) => (
              <div key={idx} className="solid-card p-6">
                <div
                  className="w-1.5 h-8 rounded-full mb-5"
                  style={{ background: feature.color }}
                />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP PERFORMERS ═══ */}
      <section className="py-24">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Leaderboard</p>
              <h2 className="text-3xl font-bold mt-2 tracking-tight">Top Performers</h2>
            </div>
            <Link href="/leaderboard">
              <button className="btn-secondary" style={{ fontSize: '12px', padding: '8px 20px' }}>View All</button>
            </Link>
          </div>

          <div className="solid-card overflow-hidden" style={{ borderRadius: '12px' }}>
            {/* Table header */}
            <div
              className="hidden md:grid grid-cols-4 gap-4 px-6 py-3"
              style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}
            >
              {['Rank', 'Name', 'Score', 'Projects'].map((h) => (
                <p key={h} className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{h}</p>
              ))}
            </div>

            {/* Rows */}
            {[
              { rank: 1, name: 'alice.eth', score: 98, projects: 156 },
              { rank: 2, name: 'bob_dev.eth', score: 96, projects: 142 },
              { rank: 3, name: 'carol.sol', score: 95, projects: 138 },
              { rank: 4, name: 'dave.web3', score: 93, projects: 124 },
              { rank: 5, name: 'eve_coder.eth', score: 91, projects: 118 },
            ].map((entry, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-4 gap-4 px-6 py-4 transition-colors duration-200"
                style={{
                  borderBottom: idx < 4 ? '1px solid var(--border-default)' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{
                      background: idx < 3 ? 'rgba(59,130,246,0.15)' : 'var(--bg-elevated)',
                      color: idx < 3 ? 'var(--accent-blue-light)' : 'var(--text-muted)',
                      border: `1px solid ${idx < 3 ? 'rgba(59,130,246,0.3)' : 'var(--border-default)'}`,
                    }}
                  >
                    {entry.rank}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{entry.name}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{entry.score}%</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{entry.projects}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section
        className="py-24"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
          borderTop: '1px solid var(--border-default)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="section-container text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Ready to build portable reputation?</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Start earning verified credentials immediately. See the full system in action with our interactive demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client">
              <button className="btn-secondary w-full sm:w-auto">Create a Project</button>
            </Link>
            <Link href="/freelancer">
              <button className="btn-primary w-full sm:w-auto">Check Your Profile</button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
