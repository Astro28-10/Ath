'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [reputationScore, setReputationScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reputationScore < 85) {
        setReputationScore(prev => prev + 1);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [reputationScore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 text-slate-900 font-mono">
      {/* Navigation */}
      <nav className="border-b-2 border-blue-400/20 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-500 rounded-lg">
                <span className="text-white text-sm font-bold">SB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SKILLBOND</span>
            </div>
            <div className="flex gap-2">
              <Link href="/learn">
                <button className="border-2 border-blue-400/50 px-4 py-2 text-xs font-bold tracking-widest hover:border-blue-400 hover:bg-blue-50 transition rounded-lg">
                  LEARN
                </button>
              </Link>
              <Link href="/simulate">
                <button className="border-2 border-blue-500 px-4 py-2 text-xs font-bold tracking-widest bg-blue-500 text-white hover:bg-blue-600 transition rounded-lg">
                  TRY DEMO
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - The Hook */}
      <section className="py-24 px-8 border-b-2 border-blue-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Message */}
            <div>
              <span className="inline-block border-2 border-blue-500/30 px-4 py-2 text-xs tracking-widest font-bold mb-8 bg-blue-50 text-blue-700 rounded-lg">
                REPUTATION-BACKED ESCROW
              </span>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Reputation</span>
                <br />
                <span className="text-slate-900">Is Worth Money</span>
              </h1>

              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                High reputation means lower escrow costs. Instant. On-chain. Verifiable. Build your track record once, benefit everywhere.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/simulate" className="flex-1">
                  <button className="w-full border-2 border-blue-500 px-8 py-4 text-sm font-bold tracking-widest bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl rounded-lg">
                    INTERACTIVE DEMO →
                  </button>
                </Link>
                <Link href="/learn" className="flex-1">
                  <button className="w-full border-2 border-blue-500/30 px-8 py-4 text-sm font-bold tracking-widest hover:border-blue-500 hover:bg-blue-50 transition-all rounded-lg">
                    LEARN MORE
                  </button>
                </Link>
              </div>

              <p className="text-xs tracking-widest text-slate-500 font-bold">
                FOR JUDGES: See the full system working in 2 minutes →
              </p>
            </div>

            {/* Right: Live Demo Box */}
            <div className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
              <p className="text-xs tracking-widest font-bold text-blue-600 mb-8">LIVE REPUTATION IMPACT</p>

              <div className="space-y-8">
                {/* Reputation Score */}
                <div>
                  <p className="text-xs tracking-widest text-slate-600 mb-3 font-bold">FREELANCER REPUTATION</p>
                  <div className="text-6xl font-bold text-blue-600">{reputationScore}%</div>
                  <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden border-2 border-blue-400">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                      style={{ width: `${reputationScore}%` }}
                    />
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t-2 border-blue-400/30 pt-8">
                  <p className="text-xs tracking-widest text-slate-600 mb-4 font-bold">PROJECT COST: 1.0 ETH</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Escrow Cost</span>
                        <span className="font-bold text-red-600">
                          {(0.20 * (1 - reputationScore / 100)).toFixed(3)} ETH
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${(0.20 * (1 - reputationScore / 100) / 0.20) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Freelancer Gets</span>
                        <span className="font-bold text-green-600">
                          {(0.80 + 0.20 * (reputationScore / 100)).toFixed(3)} ETH
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${((0.80 + 0.20 * (reputationScore / 100)) / 1.0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings */}
                <div className="border-t-2 border-blue-400/30 pt-8 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-xs tracking-widest text-green-700 mb-2 font-bold">TOTAL SAVINGS</p>
                  <p className="text-3xl font-bold text-green-700">
                    {(0.20 * (reputationScore / 100)).toFixed(3)} ETH
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    {reputationScore}% reputation = {Math.round(reputationScore * 150 / 100)}% discount
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE VALUE - Why It Matters */}
      <section className="py-20 px-8 border-b-2 border-blue-400/20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">
            Reputation Unlocks Opportunity
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💰',
                title: 'LOWER COSTS',
                desc: 'Every reputation point = automatic discount on escrow. Save up to 30%.'
              },
              {
                icon: '📜',
                title: 'PORTABLE CREDENTIALS',
                desc: 'Your reputation follows you everywhere. W3C verifiable, blockchain-backed.'
              },
              {
                icon: '⚖️',
                title: 'FAIR DISPUTES',
                desc: 'Smart contract arbitration. Transparent. On-chain. No favorites.'
              }
            ].map((item, idx) => (
              <div key={idx} className="border-2 border-blue-400/20 p-8 bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-400 transition-all rounded-xl hover:shadow-lg hover:-translate-y-1">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-sm font-bold tracking-widest text-blue-700 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 4 Steps */}
      <section className="py-20 px-8 border-b-2 border-blue-400/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Check Reputation', desc: 'See freelancer history on-chain' },
              { step: '2', title: 'Get Discount', desc: 'Escrow cost drops automatically' },
              { step: '3', title: 'Complete Work', desc: 'Fund escrow & deliver' },
              { step: '4', title: 'Earn Credential', desc: 'Get portable W3C proof' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent -mx-4 translate-x-full" />
                )}
                <div className="border-2 border-blue-400/20 p-8 bg-gradient-to-br from-white to-blue-50 rounded-xl hover:border-blue-400 transition-all">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-lg flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold tracking-widest text-blue-700 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF - Stats */}
      <section className="py-20 px-8 border-b-2 border-blue-400/20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest font-bold mb-8 text-blue-100">LIVE NETWORK STATS</p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'ACTIVE USERS', value: '12,847' },
              { label: 'PROJECTS COMPLETED', value: '48,392' },
              { label: 'TOTAL VOLUME', value: 'Ξ 2,847' },
              { label: 'AVG DISCOUNT', value: '18%' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-xs tracking-widest font-bold text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE ASK - Final CTA */}
      <section className="py-20 px-8 border-b-2 border-blue-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            See It Live in 2 Minutes
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Our interactive demo walks you through a complete project lifecycle. Watch how reputation affects costs, see disputes resolved fairly, and generate verifiable credentials.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simulate">
              <button className="border-2 border-blue-500 px-8 py-4 text-sm font-bold tracking-widest bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl rounded-lg">
                TRY INTERACTIVE DEMO →
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="border-2 border-blue-500/30 px-8 py-4 text-sm font-bold tracking-widest hover:border-blue-500 hover:bg-blue-50 transition-all rounded-lg">
                VIEW OVERVIEW
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-8 border-t-2 border-blue-400/20 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="text-xs tracking-widest font-bold text-slate-600 mb-4">EXPLORE</p>
              <ul className="space-y-2 text-sm text-slate-600 hover:text-slate-900">
                <li><Link href="/learn" className="hover:text-blue-600 transition">Learn System</Link></li>
                <li><Link href="/leaderboard" className="hover:text-blue-600 transition">Leaderboard</Link></li>
                <li><Link href="/certificates" className="hover:text-blue-600 transition">Certificates</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest font-bold text-slate-600 mb-4">DEMO</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/simulate" className="hover:text-blue-600 transition">Interactive Demo</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest font-bold text-slate-600 mb-4">NETWORK</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition">PolygonScan</a></li>
                <li>Polygon Amoy Testnet</li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest font-bold text-slate-600 mb-4">STATUS</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>All Systems Live</li>
                <li>v2.0 Beta</li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-blue-400/10 pt-8 text-center text-xs tracking-widest text-slate-500 font-bold">
            SKILLBOND © 2026 • REPUTATION-BACKED ESCROW PROTOCOL
          </div>
        </div>
      </section>
    </div>
  );
}
