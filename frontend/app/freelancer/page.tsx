'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

type FreelancerReputation = {
  reputationScore: number;
  credentialCount: number;
  averageRating: number;
};

type CredentialRecord = {
  id: number;
  projectType: string;
  title: string;
  client: string;
  completedAt: string;
  durationDays: number;
  rating: number;
};

export default function FreelancerDashboard() {
  const [address, setAddress] = useState('0x1234567890123456789012345678901234567890');
  const [reputation, setReputation] = useState<FreelancerReputation | null>(null);
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const response = await axios.get(`${API_BASE}/reputation/${address}`);
        setReputation(response.data);

        const mockCreds = [
          {
            id: 1,
            projectType: 'WEB DEVELOPMENT',
            title: 'E-commerce Platform',
            client: 'Acme Corp',
            completedAt: '2024-01-15',
            durationDays: 14,
            rating: 5,
          },
          {
            id: 2,
            projectType: 'UI DESIGN',
            title: 'Mobile App Redesign',
            client: 'StartUp Inc',
            completedAt: '2024-01-10',
            durationDays: 7,
            rating: 4.8,
          },
          {
            id: 3,
            projectType: 'BACKEND API',
            title: 'REST API Development',
            client: 'Tech Solutions',
            completedAt: '2024-01-05',
            durationDays: 21,
            rating: 5,
          },
          {
            id: 4,
            projectType: 'FULL STACK',
            title: 'Dashboard & Backend',
            client: 'Finance Corp',
            completedAt: '2023-12-28',
            durationDays: 30,
            rating: 4.9,
          },
        ];
        setCredentials(mockCreds);
      } catch {
        console.error('Failed to fetch reputation');
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, [address]);

  const discount = reputation ? (100 - (reputation.reputationScore / 100)) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white font-mono text-black">
        <p className="text-xs tracking-widest font-bold">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <button className="text-xs tracking-widest font-bold hover:underline">← BACK</button>
            </Link>
            <div className="flex gap-2">
              <Link href="/portfolio">
                <button className="border-2 border-black px-3 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                  PORTFOLIO
                </button>
              </Link>
              <Link href="/history">
                <button className="border-2 border-black px-3 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                  HISTORY
                </button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">YOUR DASHBOARD</h1>
          <p className="text-xs tracking-widest mt-2">
            {address.slice(0, 10)}...{address.slice(-8)}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Hero Section with Reputation */}
        {reputation && (
          <div className="border-2 border-black p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Reputation Circle */}
              <div className="text-center">
                <p className="text-xs tracking-widest font-bold mb-8">YOUR REPUTATION</p>

                <div className="relative w-48 h-48 mx-auto mb-8">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#000" strokeWidth="3" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#000"
                      strokeWidth="3"
                      strokeDasharray={`${(reputation.reputationScore / 10000) * 282.7} 282.7`}
                      strokeLinecap="round"
                      style={{ transformOrigin: '50px 50px', transform: 'rotate(-90deg)' }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold">{(reputation.reputationScore / 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="border-2 border-black p-6">
                  <p className="text-xs tracking-widest font-bold mb-2">DISCOUNT EARNED</p>
                  <p className="text-4xl font-bold text-red-700">{discount.toFixed(0)}%</p>
                  <p className="text-xs tracking-widest mt-4">OFF ALL ESCROW</p>
                </div>
              </div>

              {/* Right - Stats */}
              <div className="space-y-6">
                <div className="border-2 border-black p-6">
                  <p className="text-xs tracking-widest font-bold mb-4">IMPACT</p>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b-2 border-black pb-2">
                      <span>Projects Completed</span>
                      <span className="font-bold text-2xl">{reputation.credentialCount}</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-black pb-2">
                      <span>Average Rating</span>
                      <span className="font-bold text-2xl">{reputation.averageRating}★</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Delivery</span>
                      <span className="font-bold text-2xl">100%</span>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-black p-6 bg-gray-100">
                  <p className="text-xs tracking-widest font-bold mb-3">PRO TIP</p>
                  <p className="text-sm leading-relaxed">
                    Your {discount.toFixed(0)}% discount applies automatically to all future projects. Share your reputation link with clients for instant trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-2">VERIFIED CREDENTIALS</h2>
          <p className="text-xs tracking-widest font-bold mb-8">W3C-CERTIFIED CREDENTIALS FROM COMPLETED PROJECTS</p>

          <div className="grid md:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div key={cred.id} className="border-2 border-black p-6">
                <div className="mb-4 pb-4 border-b-2 border-black">
                  <p className="text-xs tracking-widest font-bold text-red-700">{cred.projectType}</p>
                  <h3 className="text-xl font-bold mt-2">{cred.title}</h3>
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span>CLIENT</span>
                    <span className="font-bold">{cred.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DURATION</span>
                    <span className="font-bold">{cred.durationDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COMPLETED</span>
                    <span className="font-bold">{new Date(cred.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-1">RATING</p>
                    <p className="text-2xl font-bold">{cred.rating}★</p>
                  </div>
                  <Link href={`/verify?id=${cred.id}`}>
                    <button className="border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                      VIEW CREDENTIAL
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 border-t-2 border-black pt-16">
          {[
            { label: 'TOTAL EARNED', value: 'Ξ 24.5' },
            { label: 'ACTIVE PROJECTS', value: '3' },
            { label: 'RESPONSE TIME', value: '2 hours' },
            { label: 'REPEAT CLIENTS', value: '8' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs tracking-widest font-bold mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-16 py-8 px-8 text-center">
        <p className="text-xs tracking-widest">SKILLBOND FREELANCER PROFILE</p>
      </footer>
    </div>
  );
}
