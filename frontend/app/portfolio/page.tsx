'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('overview');

  const freelancer = {
    name: 'alice.eth',
    address: '0x1234567890123456789012345678901234567890',
    bio: 'Full-stack developer specializing in Web3 and blockchain integration. 5+ years experience.',
    score: 98,
    projects: 156,
    rating: 4.98,
    hourlyRate: '0.05 ETH/hr',
    discount: 2,
    joined: '2023-01-15',
    responseTime: '2 hours',
    completionRate: '100%',
  };

  const portfolio = [
    {
      id: 1,
      title: 'DeFi Protocol Integration',
      description: 'Integrated Uniswap protocol with React frontend',
      category: 'WEB3',
      date: '2024-01-20',
      client: 'TechFund',
      outcome: 'SUCCESS',
    },
    {
      id: 2,
      title: 'Smart Contract Deployment',
      description: 'ERC-20 token deployment and verification',
      category: 'SOLIDITY',
      date: '2024-01-15',
      client: 'TokenLabs',
      outcome: 'SUCCESS',
    },
    {
      id: 3,
      title: 'NFT Marketplace UI',
      description: 'Full-stack NFT marketplace with wallet integration',
      category: 'FRONTEND',
      date: '2024-01-10',
      client: 'ArtDAO',
      outcome: 'SUCCESS',
    },
    {
      id: 4,
      title: 'Backend API for Web3 App',
      description: 'Node.js server with blockchain event listeners',
      category: 'BACKEND',
      date: '2024-01-05',
      client: 'Web3Labs',
      outcome: 'SUCCESS',
    },
  ];

  const skills = ['SOLIDITY', 'REACT', 'NODE.JS', 'WEB3.JS', 'ETHERS.JS', 'TYPESCRIPT', 'HARDHAT', 'MONGODB'];

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK</button>
          </Link>
          <h1 className="text-3xl font-bold">{freelancer.name}</h1>
          <p className="text-xs tracking-widest mt-2">FREELANCER PORTFOLIO</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Hero Card */}
        <div className="border-2 border-black p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Info */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <p className="text-xs tracking-widest font-bold mb-2">BIO</p>
                <p className="text-lg leading-relaxed">{freelancer.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t-2 border-black pt-8">
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">JOINED</p>
                  <p className="font-bold">{freelancer.joined}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">RESPONSE TIME</p>
                  <p className="font-bold">{freelancer.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">COMPLETION RATE</p>
                  <p className="font-bold">{freelancer.completionRate}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">HOURLY RATE</p>
                  <p className="font-bold">{freelancer.hourlyRate}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-2 border-black p-6 bg-gray-100">
              <div className="space-y-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-red-700">{freelancer.discount}%</p>
                  <p className="text-xs tracking-widest mt-2">DISCOUNT EARNED</p>
                </div>
                <div className="border-t-2 border-black pt-6">
                  <p className="text-3xl font-bold mb-2">{freelancer.score}%</p>
                  <p className="text-xs tracking-widest">REPUTATION SCORE</p>
                </div>
                <div className="border-t-2 border-black pt-6">
                  <p className="text-2xl font-bold mb-1">{freelancer.rating}★</p>
                  <p className="text-xs tracking-widest">AVG RATING</p>
                </div>
                <button className="w-full border-2 border-black bg-black text-white py-2 text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all mt-4">
                  HIRE NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-2 border-b-2 border-black pb-4 mb-8">
            {[
              { label: 'PORTFOLIO', value: 'overview' },
              { label: 'SKILLS', value: 'skills' },
              { label: 'REVIEWS', value: 'reviews' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 border-b-2 text-xs font-bold tracking-widest transition-all ${
                  activeTab === tab.value
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Portfolio Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {portfolio.map((item) => (
                <div key={item.id} className="border-2 border-black p-6">
                  <div className="grid md:grid-cols-5 gap-4 items-start mb-4">
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest font-bold mb-1">CATEGORY</p>
                      <p className="font-mono text-sm">{item.category}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest font-bold mb-1">DATE</p>
                      <p className="font-mono text-sm">{item.date}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest font-bold mb-1">CLIENT</p>
                      <p className="font-mono text-sm">{item.client}</p>
                    </div>
                  </div>
                  <div className="border-t-2 border-black pt-4 flex items-center justify-between">
                    <p className="text-xs tracking-widest">
                      <span className="font-bold text-green-700">✓ {item.outcome}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              <p className="text-xs tracking-widest font-bold mb-6">TECHNICAL EXPERTISE</p>
              <div className="grid md:grid-cols-4 gap-4">
                {skills.map((skill, idx) => (
                  <div key={idx} className="border-2 border-black p-6 text-center">
                    <p className="font-bold text-lg">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {[
                {
                  name: 'TechCorp Client',
                  rating: 5,
                  review: 'Excellent work on the DeFi integration. Very professional and responsive.',
                },
                {
                  name: 'TokenLabs',
                  rating: 4.9,
                  review: 'Smart contract deployment was flawless. Highly recommended.',
                },
                {
                  name: 'ArtDAO',
                  rating: 4.8,
                  review: 'Built exactly what we needed. Great communication throughout.',
                },
              ].map((review, idx) => (
                <div key={idx} className="border-2 border-black p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold">{review.name}</p>
                      <p className="text-xs tracking-widest text-gray-600 mt-1">VERIFIED REVIEW</p>
                    </div>
                    <p className="font-bold text-lg">{review.rating}★</p>
                  </div>
                  <p className="text-sm">{review.review}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="border-t-4 border-black pt-16 grid md:grid-cols-4 gap-6">
          {[
            { label: 'TOTAL PROJECTS', value: freelancer.projects },
            { label: 'SUCCESS RATE', value: '100%' },
            { label: 'REPEAT CLIENTS', value: '87%' },
            { label: 'EARNINGS', value: '156 ETH' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-xs tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black mt-16 py-8 px-8 text-center">
        <p className="text-xs tracking-widest">SKILLBOND PORTFOLIO</p>
      </footer>
    </div>
  );
}
