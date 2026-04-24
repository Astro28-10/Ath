'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [reputationScore, setReputationScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reputationScore < 85) {
        setReputationScore(prev => prev + 1);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [reputationScore]);

  const stats = [
    { label: 'ACTIVE USERS', value: '12,847', change: '+23%' },
    { label: 'PROJECTS COMPLETED', value: '48,392', change: '+18%' },
    { label: 'TOTAL VOLUME', value: 'Ξ 2,847', change: '+31%' },
    { label: 'AVG DISCOUNT', value: '18%', change: '+5%' },
  ];

  const keyFeatures = [
    {
      title: 'REPUTATION-BACKED DISCOUNTS',
      desc: 'High reputation = Lower escrow costs. Instantly.',
      benefit: 'Freelancers save up to 30% on projects'
    },
    {
      title: 'ON-CHAIN VERIFICATION',
      desc: 'All credentials verified on Polygon blockchain.',
      benefit: 'Transparent, permanent, tamper-proof'
    },
    {
      title: 'PORTABLE CREDENTIALS',
      desc: 'W3C verifiable credentials follow you everywhere.',
      benefit: 'Your reputation is YOUR asset'
    },
    {
      title: 'FAIR DISPUTE RESOLUTION',
      desc: 'Smart contract arbitration with transparent logic.',
      benefit: 'No bias, automated fairness'
    }
  ];

  const workflow = [
    { step: 1, icon: '⚡', title: 'Check Reputation', desc: 'Verify track record' },
    { step: 2, icon: '💰', title: 'Lower Costs', desc: 'Automatic discount applied' },
    { step: 3, icon: '✅', title: 'Complete Work', desc: 'Fund & approve delivery' },
    { step: 4, icon: '📜', title: 'Earn Credential', desc: 'Get W3C verified proof' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white font-mono">
      {/* Header */}
      <header className="border-b-2 border-blue-500/30 sticky top-0 bg-slate-900/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-2 border-blue-400 rounded-lg">
                  <span className="text-white text-sm font-bold">SB</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SKILLBOND</span>
              </div>
            </Link>
            <div className="flex gap-2">
              <Link href="/learn">
                <button className="border-2 border-blue-400/50 px-4 py-2 text-xs font-bold tracking-widest hover:border-blue-400 hover:bg-blue-400/10 transition">
                  LEARN
                </button>
              </Link>
              <Link href="/simulate">
                <button className="border-2 border-blue-400 px-4 py-2 text-xs font-bold tracking-widest bg-blue-400/20 hover:bg-blue-400/30 transition">
                  DEMO
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero - Executive Summary */}
      <section className="py-20 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Main Message */}
            <div className="lg:col-span-2">
              <span className="inline-block border-2 border-purple-400/50 px-4 py-2 text-xs tracking-widest font-bold mb-8 bg-purple-400/10 hover:bg-purple-400/20 transition">
                EXECUTIVE SUMMARY
              </span>
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Reputation is Worth Money
              </h1>
              <p className="text-lg leading-relaxed mb-8 text-gray-300 max-w-2xl">
                SkillBond transforms how freelancers and clients interact. Your reputation isn't just a number—it's currency. High reputation unlocks instant discounts on escrow costs, portable credentials, and transparent dispute resolution.
              </p>

              <div className="space-y-3">
                <Link href="/simulate">
                  <button className="w-full lg:w-auto border-2 border-blue-400 px-8 py-3 text-sm font-bold tracking-widest bg-blue-500 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/50">
                    SEE IT IN ACTION →
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="border-2 border-blue-400/30 p-8 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-lg">
              <p className="text-xs tracking-widest font-bold mb-8 text-blue-300">THE OPPORTUNITY</p>
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-bold text-blue-300">$13.8B</p>
                  <p className="text-xs tracking-widest mt-2 text-gray-400">PROJECTED MARKET BY 2030</p>
                </div>
                <div className="border-t border-blue-400/20 pt-6">
                  <p className="text-4xl font-bold text-purple-300">58%</p>
                  <p className="text-xs tracking-widest mt-2 text-gray-400">FREELANCERS FACE NON-PAYMENT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest font-bold mb-8 text-blue-300">NETWORK METRICS</p>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="border-2 border-blue-400/20 p-6 bg-gradient-to-br from-blue-400/5 to-purple-400/5 hover:border-blue-400/50 transition-all group rounded-lg">
                <p className="text-3xl font-bold text-blue-300 mb-2 group-hover:text-blue-200">{stat.value}</p>
                <p className="text-xs tracking-widest font-bold text-gray-400 mb-3">{stat.label}</p>
                <p className="text-sm text-purple-300">↑ {stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 4 Step */}
      <section className="py-24 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((item) => (
              <div key={item.step} className="group">
                <div className="border-2 border-blue-400/20 p-8 bg-gradient-to-br from-blue-400/5 to-purple-400/5 hover:border-blue-400/50 transition-all rounded-lg h-full">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="text-sm font-bold text-blue-300 mb-2">STEP {item.step}</div>
                  <h4 className="text-sm tracking-widest font-bold mb-3">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">WHY SKILLBOND</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {keyFeatures.map((feature, idx) => (
              <div key={idx} className="border-2 border-blue-400/20 p-8 bg-gradient-to-br from-blue-400/5 to-purple-400/5 hover:border-purple-400/50 transition-all rounded-lg group">
                <h3 className="text-sm tracking-widest font-bold mb-3 text-purple-300 group-hover:text-purple-200">{feature.title}</h3>
                <p className="text-sm mb-6 text-gray-300">{feature.desc}</p>
                <div className="border-t border-blue-400/20 pt-4">
                  <p className="text-xs tracking-widest font-bold text-blue-300">BENEFIT</p>
                  <p className="text-sm mt-2 font-bold text-gray-300">{feature.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to See the Magic?</h2>
          <p className="text-lg text-gray-300 mb-12">
            Experience the full SkillBond system with our interactive demo. Choose a scenario, run through the workflow, and see reputation in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simulate">
              <button className="border-2 border-blue-400 px-8 py-3 text-sm font-bold tracking-widest bg-blue-500 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 rounded-lg">
                INTERACTIVE DEMO →
              </button>
            </Link>
            <Link href="/learn">
              <button className="border-2 border-purple-400/50 px-8 py-3 text-sm font-bold tracking-widest hover:border-purple-400 hover:bg-purple-400/10 transition-all rounded-lg">
                LEARN MORE
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-8 border-t-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto text-center text-xs tracking-widest text-gray-500">
          <p>SKILLBOND © 2026 • REPUTATION-BACKED ESCROW PROTOCOL</p>
        </div>
      </section>
    </div>
  );
}
