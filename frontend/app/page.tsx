'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [reputationScore, setReputationScore] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      if (reputationScore < 85) {
        setReputationScore(prev => prev + 1);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [reputationScore]);

  const stats = [
    { label: 'USERS', value: '12,847' },
    { label: 'PROJECTS COMPLETED', value: '48,392' },
    { label: 'TOTAL VOLUME', value: 'Ξ 2,847' },
    { label: 'AVG DISCOUNT', value: '18%' },
  ];

  const leaderboard = [
    { rank: '1', name: 'alice.eth', score: 98, projects: 156 },
    { rank: '2', name: 'bob_dev.eth', score: 96, projects: 142 },
    { rank: '3', name: 'carol.sol', score: 95, projects: 138 },
    { rank: '4', name: 'dave.web3', score: 93, projects: 124 },
    { rank: '5', name: 'eve_coder.eth', score: 91, projects: 118 },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black">
                <span className="text-white text-lg font-bold">SB</span>
              </div>
              <h1 className="text-3xl font-bold">SKILLBOND</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/leaderboard">
                <button className="border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                  LEADERBOARD
                </button>
              </Link>
              <Link href="/search">
                <button className="border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                  SEARCH
                </button>
              </Link>
            </div>
          </div>
          <p className="text-xs tracking-widest">REPUTATION-BACKED ESCROW PROTOCOL</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left */}
            <div>
              <div className="mb-12">
                <span className="inline-block border-2 border-black px-4 py-2 text-xs tracking-widest font-bold mb-8">
                  REPUTATION = CURRENCY
                </span>
                <h2 className="text-6xl lg:text-7xl font-bold leading-tight">
                  Your track record is worth something.
                </h2>
              </div>

              <p className="text-lg leading-relaxed mb-8 max-w-lg">
                Freelancers with proven history get instant discounts on escrow costs. Build verifiable credentials that follow you everywhere.
              </p>

              <div className="flex flex-col gap-3 mb-12">
                <Link href="/client">
                  <button className="w-full border-2 border-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                    HIRE TALENT →
                  </button>
                </Link>
                <Link href="/freelancer">
                  <button className="w-full border-2 border-black px-8 py-3 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition-all">
                    CHECK STATS →
                  </button>
                </Link>
              </div>

              <div className="space-y-6 border-t-2 border-black pt-6">
                <div>
                  <p className="text-4xl font-bold">58%</p>
                  <p className="text-xs tracking-widest">FREELANCERS FACE NON-PAYMENT</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">$13.8B</p>
                  <p className="text-xs tracking-widest">MARKET BY 2030</p>
                </div>
              </div>
            </div>

            {/* Right - Reputation Counter */}
            <div className="border-2 border-black p-8">
              <p className="text-xs tracking-widest font-bold mb-8 border-b-2 border-black pb-4">
                LIVE REPUTATION EXAMPLE
              </p>

              <div className="space-y-8">
                <div>
                  <p className="text-xs tracking-widest mb-3">SCORE</p>
                  <div className="text-7xl font-bold">{reputationScore}%</div>
                </div>

                <div className="border-t-2 border-black pt-8">
                  <p className="text-xs tracking-widest mb-4">DISCOUNT EARNED</p>
                  <div className="space-y-4">
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-bold text-red-700">{(100 - reputationScore)}%</span>
                      <span className="text-sm mb-1">OFF ESCROW</span>
                    </div>
                    <div className="border-2 border-black p-4">
                      <p className="text-xs tracking-widest mb-2">SAVINGS ON 1 ETH</p>
                      <p className="text-3xl font-bold">
                        0.{(100 - reputationScore).toString().padStart(2, '0')} ETH
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-8 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>PROJECTS</span>
                    <span className="font-bold">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RATING</span>
                    <span className="font-bold">4.9★</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RESPONSE TIME</span>
                    <span className="font-bold">2 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="py-16 px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest font-bold mb-8">NETWORK STATISTICS</p>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="border-2 border-black p-6 text-center">
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-xs tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-16 tracking-tight">HOW IT WORKS</h3>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: '1', title: 'CHECK REPUTATION', desc: 'Verify freelancer track record on-chain' },
              { n: '2', title: 'LOWER COSTS', desc: 'Automatic discount applied instantly' },
              { n: '3', title: 'COMPLETE WORK', desc: 'Fund and approve delivery' },
              { n: '4', title: 'EARN CREDENTIAL', desc: 'Get W3C verified proof' },
            ].map((item) => (
              <div key={item.n} className="border-2 border-black p-6">
                <div className="text-6xl font-bold mb-4 text-gray-400">{item.n}</div>
                <h4 className="text-xs tracking-widest font-bold mb-3">{item.title}</h4>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performers */}
      <section className="py-24 px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-4xl font-bold">TOP PERFORMERS</h3>
            <Link href="/leaderboard">
              <button className="border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                VIEW ALL
              </button>
            </Link>
          </div>

          <div className="border-2 border-black">
            <div className="hidden md:grid md:grid-cols-4 gap-4 p-6 border-b-2 border-black bg-gray-200">
              <p className="font-bold text-xs tracking-widest">RANK</p>
              <p className="font-bold text-xs tracking-widest">NAME</p>
              <p className="font-bold text-xs tracking-widest">SCORE</p>
              <p className="font-bold text-xs tracking-widest">PROJECTS</p>
            </div>

            {leaderboard.map((entry, idx) => (
              <div key={idx} className={`grid md:grid-cols-4 gap-4 p-6 ${idx !== leaderboard.length - 1 ? 'border-b-2 border-black' : ''}`}>
                <p className="font-bold">{entry.rank}</p>
                <p className="font-mono text-sm">{entry.name}</p>
                <p className="font-bold">{entry.score}%</p>
                <p className="font-bold">{entry.projects}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-16 tracking-tight">FEATURES</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'CRYPTOGRAPHICALLY SIGNED', desc: 'ECDSA proofs ensure authenticity' },
              { title: 'CROSS-PLATFORM', desc: 'Credentials work everywhere' },
              { title: 'INSTANT DISCOUNTS', desc: '15-20% typical savings' },
              { title: 'TRANSPARENT SCORING', desc: 'See exactly how your score works' },
              { title: 'PRIVACY FIRST', desc: 'Share only what you choose' },
              { title: 'PORTABLE', desc: 'Your credentials, your control' },
            ].map((feature, idx) => (
              <div key={idx} className="border-2 border-black p-6">
                <h4 className="text-xs tracking-widest font-bold mb-3">{feature.title}</h4>
                <p className="text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-black text-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-5xl font-bold mb-8 tracking-tight">
            READY TO BUILD PORTABLE REPUTATION?
          </h3>
          <p className="text-lg mb-12">Start earning verified credentials immediately.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client">
              <button className="border-2 border-white px-8 py-3 text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all">
                BROWSE TALENT
              </button>
            </Link>
            <Link href="/freelancer">
              <button className="bg-white text-black border-2 border-white px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                CHECK PROFILE
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b-2 border-black">
            <div>
              <p className="text-xs tracking-widest font-bold mb-4">PRODUCT</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/"><button className="hover:underline">Home</button></Link></li>
                <li><Link href="/leaderboard"><button className="hover:underline">Leaderboard</button></Link></li>
                <li><Link href="/search"><button className="hover:underline">Search</button></Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest font-bold mb-4">DOCS</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/docs/API.md" className="hover:underline">API Reference</a></li>
                <li><a href="/docs/ARCHITECTURE.md" className="hover:underline">Architecture</a></li>
                <li><a href="/docs/STATUS.md" className="hover:underline">Status</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest font-bold mb-4">NETWORK</p>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:underline">Polygon Amoy</button></li>
                <li><button className="hover:underline">Contracts</button></li>
                <li><button className="hover:underline">Block Explorer</button></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest font-bold mb-4">SOCIAL</p>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:underline">Twitter</button></li>
                <li><button className="hover:underline">Discord</button></li>
                <li><button className="hover:underline">GitHub</button></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs tracking-widest">
            <p>SKILLBOND © 2026 — REPUTATION-BACKED ESCROW PROTOCOL</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
