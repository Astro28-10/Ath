'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState('score');
  const [filterType, setFilterType] = useState('all');

  const allUsers = [
    { rank: 1, name: 'alice.eth', score: 98, projects: 156, rating: 4.98, discount: 2 },
    { rank: 2, name: 'bob_dev.eth', score: 96, projects: 142, rating: 4.92, discount: 4 },
    { rank: 3, name: 'carol.sol', score: 95, projects: 138, rating: 4.89, discount: 5 },
    { rank: 4, name: 'dave.web3', score: 93, projects: 124, rating: 4.85, discount: 7 },
    { rank: 5, name: 'eve_coder.eth', score: 91, projects: 118, rating: 4.81, discount: 9 },
    { rank: 6, name: 'frank.design', score: 89, projects: 105, rating: 4.76, discount: 11 },
    { rank: 7, name: 'grace_build.eth', score: 87, projects: 98, rating: 4.71, discount: 13 },
    { rank: 8, name: 'henry.eth', score: 85, projects: 92, rating: 4.68, discount: 15 },
    { rank: 9, name: 'iris_dev.sol', score: 83, projects: 87, rating: 4.62, discount: 17 },
    { rank: 10, name: 'jack.web3', score: 81, projects: 78, rating: 4.55, discount: 19 },
  ];

  const sorted = [...allUsers].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'projects') return b.projects - a.projects;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-12">
        <div className="section-container">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Leaderboard</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Top performers on SkillBond</p>
        </div>
      </section>

      <main className="section-container flex-1 pb-16">
        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="label">Sort By</p>
            <div className="flex gap-2">
              {['score', 'projects', 'rating'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className="px-4 py-2 text-xs font-medium rounded-lg transition-all"
                  style={{
                    background: sortBy === opt ? 'var(--accent-blue)' : 'transparent',
                    color: sortBy === opt ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${sortBy === opt ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                  }}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Filter</p>
            <div className="flex gap-2">
              {[
                { label: 'ALL', value: 'all' },
                { label: 'TOP 5', value: 'top5' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className="px-4 py-2 text-xs font-medium rounded-lg transition-all"
                  style={{
                    background: filterType === opt.value ? 'var(--accent-blue)' : 'transparent',
                    color: filterType === opt.value ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${filterType === opt.value ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="solid-card overflow-hidden mb-16">
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3" style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
            {['Rank', 'Name', 'Score', 'Projects', 'Rating', 'Discount'].map((h) => (
              <p key={h} className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{h}</p>
            ))}
          </div>

          {sorted.slice(0, filterType === 'top5' ? 5 : 10).map((user, idx) => (
            <div
              key={user.rank}
              className="grid md:grid-cols-6 gap-4 px-6 py-4 transition-colors"
              style={{ borderBottom: idx < (filterType === 'top5' ? 4 : 9) ? '1px solid var(--border-default)' : 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold" style={{
                  background: idx < 3 ? 'rgba(59,130,246,0.15)' : 'var(--bg-elevated)',
                  color: idx < 3 ? 'var(--accent-blue-light)' : 'var(--text-muted)',
                  border: `1px solid ${idx < 3 ? 'rgba(59,130,246,0.3)' : 'var(--border-default)'}`,
                }}>{user.rank}</span>
              </div>
              <p className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{user.name}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{user.score}%</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.projects}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.rating}★</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent-emerald)' }}>{user.discount}%</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Average Score', value: '91.2%' },
            { label: 'Avg Projects', value: '113.6' },
            { label: 'Avg Rating', value: '4.79★' },
            { label: 'Avg Discount', value: '10.9%' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center solid-card p-6">
              <p className="text-2xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
