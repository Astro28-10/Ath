'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [reputationScore, setReputationScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reputationScore < 85) setReputationScore((prev) => prev + 1);
    }, 30);
    return () => clearInterval(interval);
  }, [reputationScore]);

  const stats = [
    { label: 'Active Users', value: '12,847', change: '+23%' },
    { label: 'Projects Completed', value: '48,392', change: '+18%' },
    { label: 'Total Volume', value: 'Ξ 2,847', change: '+31%' },
    { label: 'Avg Discount', value: '18%', change: '+5%' },
  ];

  const keyFeatures = [
    { title: 'Reputation-Backed Discounts', desc: 'High reputation = Lower escrow costs. Instantly.', benefit: 'Freelancers save up to 30% on projects' },
    { title: 'On-Chain Verification', desc: 'All credentials verified on Polygon blockchain.', benefit: 'Transparent, permanent, tamper-proof' },
    { title: 'Portable Credentials', desc: 'W3C verifiable credentials follow you everywhere.', benefit: 'Your reputation is YOUR asset' },
    { title: 'Fair Dispute Resolution', desc: 'Smart contract arbitration with transparent logic.', benefit: 'No bias, automated fairness' },
  ];

  const workflow = [
    { step: 1, title: 'Check Reputation', desc: 'Verify track record', icon: '⚡' },
    { step: 2, title: 'Lower Costs', desc: 'Automatic discount applied', icon: '💰' },
    { step: 3, title: 'Complete Work', desc: 'Fund & approve delivery', icon: '✓' },
    { step: 4, title: 'Earn Credential', desc: 'Get W3C verified proof', icon: '📜' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="badge badge-violet mb-6">Executive Summary</div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight gradient-text">
                Reputation is Worth Money
              </h1>
              <p className="text-lg leading-relaxed mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                SkillBond transforms how freelancers and clients interact. Your reputation isn&apos;t just a number—it&apos;s currency. High reputation unlocks instant discounts, portable credentials, and transparent dispute resolution.
              </p>
              <Link href="/simulate">
                <button className="btn-primary">
                  See It In Action
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12l4-4-4-4" /></svg>
                </button>
              </Link>
            </div>

            <div className="glass-card p-6" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
              <p className="label" style={{ color: 'var(--accent-violet-light)', margin: 0, marginBottom: '16px' }}>The Opportunity</p>
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-bold gradient-text">$13.8B</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Projected Market by 2030</p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '24px' }}>
                  <p className="text-3xl font-bold" style={{ color: 'var(--accent-rose)' }}>58%</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Freelancers Face Non-Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }} className="py-12">
        <div className="section-container">
          <div className="grid md:grid-cols-4 gap-6 stagger-children">
            {stats.map((stat, idx) => (
              <div key={idx} className="solid-card p-6">
                <p className="text-2xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-emerald)' }}>↑ {stat.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="section-container">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 stagger-children">
            {workflow.map((item) => (
              <div key={item.step} className="solid-card p-6 group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-blue-light)' }}>Step {item.step}</p>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="section-container">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">Why SkillBond</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {keyFeatures.map((feature, idx) => (
              <div key={idx} className="solid-card p-6 group">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-violet-light)' }}>{feature.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '12px' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{feature.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to See the Magic?</h2>
          <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
            Experience the full SkillBond system with our interactive demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simulate"><button className="btn-primary">Interactive Demo →</button></Link>
            <Link href="/learn"><button className="btn-secondary">Learn More</button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
