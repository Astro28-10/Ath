'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState('score');
  const [filterType, setFilterType] = useState('all');

  const allUsers = [
    { rank: 1, name: 'alice.eth', score: 98, projects: 156, rating: 4.98, discount: 2, joined: '2023-01-15' },
    { rank: 2, name: 'bob_dev.eth', score: 96, projects: 142, rating: 4.92, discount: 4, joined: '2023-02-20' },
    { rank: 3, name: 'carol.sol', score: 95, projects: 138, rating: 4.89, discount: 5, joined: '2023-03-10' },
    { rank: 4, name: 'dave.web3', score: 93, projects: 124, rating: 4.85, discount: 7, joined: '2023-04-05' },
    { rank: 5, name: 'eve_coder.eth', score: 91, projects: 118, rating: 4.81, discount: 9, joined: '2023-05-12' },
    { rank: 6, name: 'frank.design', score: 89, projects: 105, rating: 4.76, discount: 11, joined: '2023-06-22' },
    { rank: 7, name: 'grace_build.eth', score: 87, projects: 98, rating: 4.71, discount: 13, joined: '2023-07-15' },
    { rank: 8, name: 'henry.eth', score: 85, projects: 92, rating: 4.68, discount: 15, joined: '2023-08-30' },
    { rank: 9, name: 'iris_dev.sol', score: 83, projects: 87, rating: 4.62, discount: 17, joined: '2023-09-10' },
    { rank: 10, name: 'jack.web3', score: 81, projects: 78, rating: 4.55, discount: 19, joined: '2023-10-02' },
  ];

  const sorted = [...allUsers].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'projects') return b.projects - a.projects;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK</button>
          </Link>
          <h1 className="text-3xl font-bold">LEADERBOARD</h1>
          <p className="text-xs tracking-widest mt-2">TOP PERFORMERS ON SKILLBOND</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div>
            <p className="text-xs tracking-widest font-bold mb-4">SORT BY</p>
            <div className="flex gap-2">
              {[
                { label: 'SCORE', value: 'score' },
                { label: 'PROJECTS', value: 'projects' },
                { label: 'RATING', value: 'rating' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-2 border-2 text-xs font-bold tracking-widest transition-all ${
                    sortBy === opt.value
                      ? 'border-black bg-black text-white'
                      : 'border-black hover:bg-black hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-widest font-bold mb-4">FILTER</p>
            <div className="flex gap-2">
              {[
                { label: 'ALL', value: 'all' },
                { label: 'TOP 5', value: 'top5' },
                { label: 'RISING', value: 'rising' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={`px-3 py-2 border-2 text-xs font-bold tracking-widest transition-all ${
                    filterType === opt.value
                      ? 'border-black bg-black text-white'
                      : 'border-black hover:bg-black hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border-2 border-black overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid md:grid-cols-6 gap-4 p-6 border-b-2 border-black bg-gray-200">
            <p className="font-bold text-xs tracking-widest">RANK</p>
            <p className="font-bold text-xs tracking-widest">NAME</p>
            <p className="font-bold text-xs tracking-widest">SCORE</p>
            <p className="font-bold text-xs tracking-widest">PROJECTS</p>
            <p className="font-bold text-xs tracking-widest">RATING</p>
            <p className="font-bold text-xs tracking-widest">DISCOUNT</p>
          </div>

          {/* Rows */}
          {sorted.slice(0, filterType === 'top5' ? 5 : 10).map((user, idx) => (
            <div
              key={user.rank}
              className={`grid md:grid-cols-6 gap-4 p-6 ${
                idx !== (filterType === 'top5' ? 4 : 9) ? 'border-b-2 border-black' : ''
              } hover:bg-gray-100 transition`}
            >
              <div>
                <p className="md:hidden text-xs tracking-widest font-bold mb-1">RANK</p>
                <p className="font-bold text-lg">{user.rank}</p>
              </div>
              <div>
                <p className="md:hidden text-xs tracking-widest font-bold mb-1">NAME</p>
                <p className="font-mono text-sm">{user.name}</p>
              </div>
              <div>
                <p className="md:hidden text-xs tracking-widest font-bold mb-1">SCORE</p>
                <p className="font-bold">{user.score}%</p>
              </div>
              <div>
                <p className="md:hidden text-xs tracking-widest font-bold mb-1">PROJECTS</p>
                <p className="font-bold">{user.projects}</p>
              </div>
              <div>
                <p className="md:hidden text-xs tracking-widest font-bold mb-1">RATING</p>
                <p className="font-bold">{user.rating}★</p>
              </div>
              <div>
                <p className="md:hidden text-xs tracking-widest font-bold mb-1">DISCOUNT</p>
                <p className="font-bold text-red-700">{user.discount}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 pt-16 border-t-4 border-black">
          {[
            { label: 'AVERAGE SCORE', value: '91.2%' },
            { label: 'AVG PROJECTS', value: '113.6' },
            { label: 'AVG RATING', value: '4.79★' },
            { label: 'AVG DISCOUNT', value: '10.9%' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-xs tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Joiners */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">RECENT JOINERS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {allUsers.slice(-3).reverse().map((user) => (
              <div key={user.rank} className="border-2 border-black p-6">
                <p className="font-mono text-sm mb-4">{user.name}</p>
                <div className="space-y-2 text-sm border-t-2 border-black pt-4">
                  <div className="flex justify-between">
                    <span>JOINED</span>
                    <span className="font-bold">{user.joined}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>INITIAL SCORE</span>
                    <span className="font-bold">{user.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PROJECTS</span>
                    <span className="font-bold">{user.projects}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black mt-16 py-8 px-8 text-center">
        <p className="text-xs tracking-widest">SKILLBOND LEADERBOARD</p>
      </footer>
    </div>
  );
}
