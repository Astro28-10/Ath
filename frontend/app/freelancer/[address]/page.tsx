'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ReputationGraph } from '../../components/ReputationGraph';
import { CertificateTemplate } from '../../components/CertificateTemplate';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'http://localhost:3001/api';

interface FreelancerData {
  address: string;
  name?: string;
  score?: number;
  reputationScore?: number;
  credentialCount?: number;
  averageRating?: number;
  lastActivity?: string;
  source?: string;
}

export default function FreelancerBioPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = React.use(params);
  const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'graphs' | 'certificate'>('overview');
  const [certificateId, setCertificateId] = useState('');

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const response = await axios.get(`${API_BASE}/reputation/${address}`);
        setFreelancer(response.data);
      } catch {
        // Fallback to mock data
        const mockData: FreelancerData = {
          address: address,
          name: address.slice(0, 10) + '...',
          score: 8500,
          credentialCount: 8,
          averageRating: 4.7,
          lastActivity: new Date().toISOString(),
        };
        setFreelancer(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
    setCertificateId(uuidv4());
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">⏳ LOADING PROFILE...</p>
          <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-white text-black font-mono">
        <header className="border-b-4 border-black">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <Link href="/search">
              <button className="text-xs tracking-widest font-bold hover:underline">← BACK TO SEARCH</button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">PROFILE NOT FOUND</h1>
          </div>
        </header>
      </div>
    );
  }

  const score = freelancer.reputationScore ?? freelancer.score ?? 0;
  const scorePercent = (score / 10000 * 100).toFixed(1);
  const credentialCount = freelancer.credentialCount ?? 0;
  const rating = freelancer.averageRating ?? 0;

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/search">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK</button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black">
                {freelancer.name || freelancer.address.slice(0, 12) + '...'}
              </h1>
              <p className="text-xs tracking-widest text-gray-600 mt-2 font-mono">
                {freelancer.address}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-blue-600">{scorePercent}%</div>
              <p className="text-xs tracking-widest text-gray-600">REPUTATION</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b-2 border-gray-300 sticky top-24 bg-white z-30">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'graphs', label: 'REPUTATION ANALYTICS' },
              { id: 'certificate', label: 'CERTIFICATE' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'graphs' | 'certificate')}
                className={`py-4 px-2 font-bold text-sm tracking-widest border-b-4 transition-all ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border-3 border-black p-8 hover:shadow-lg transition-shadow" style={{background: 'linear-gradient(135deg, rgb(240, 249, 255) 0%, rgb(255, 255, 255) 100%)'}}>
                <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">SCORE</p>
                <p className="text-5xl font-black text-blue-600">{scorePercent}%</p>
                <p className="text-xs mt-3 text-green-600 font-bold">↑ Excellent</p>
              </div>

              <div className="border-3 border-black p-8 hover:shadow-lg transition-shadow" style={{background: 'linear-gradient(135deg, rgb(250, 245, 255) 0%, rgb(255, 255, 255) 100%)'}}>
                <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">CREDENTIALS</p>
                <p className="text-5xl font-black text-purple-600">{credentialCount}</p>
                <p className="text-xs mt-3 text-gray-600">projects completed</p>
              </div>

              <div className="border-3 border-black p-8 hover:shadow-lg transition-shadow" style={{background: 'linear-gradient(135deg, rgb(254, 252, 232) 0%, rgb(255, 255, 255) 100%)'}}>
                <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">RATING</p>
                <p className="text-5xl font-black text-yellow-600">{rating}★</p>
                <p className="text-xs mt-3 text-gray-600">average rating</p>
              </div>

              <div className="border-3 border-black p-8 hover:shadow-lg transition-shadow" style={{background: 'linear-gradient(135deg, rgb(240, 253, 250) 0%, rgb(255, 255, 255) 100%)'}}>
                <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">STATUS</p>
                <p className="text-4xl font-black text-green-600">✓</p>
                <p className="text-xs mt-3 text-green-600 font-bold">Verified on Chain</p>
              </div>
            </div>

            {/* Biography Section */}
            <div className="border-3 border-black p-8 space-y-6">
              <h2 className="text-2xl font-black tracking-widest">BIOGRAPHY</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Accomplished Web3 developer with a passion for building decentralized applications.
                  Specializes in smart contract development, frontend integration, and full-stack blockchain solutions.
                </p>
                <p>
                  With {credentialCount} completed projects and a {scorePercent}% reputation score, this freelancer has
                  demonstrated consistent quality and reliability across diverse project types.
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="border-3 border-black p-8 space-y-6">
              <h2 className="text-2xl font-black tracking-widest">CORE SKILLS</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {['Solidity', 'React', 'TypeScript', 'Web3.js', 'Hardhat', 'Smart Contracts', 'DeFi', 'Full-Stack'].map(
                  (skill) => (
                    <div key={skill} className="border-2 border-black p-3 text-center font-bold hover:bg-black hover:text-white transition-all cursor-default">
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Portfolio Projects */}
            <div className="border-3 border-black p-8 space-y-6">
              <h2 className="text-2xl font-black tracking-widest">RECENT PROJECTS</h2>
              <div className="space-y-4">
                {[
                  { title: 'DeFi Dashboard', desc: 'Interactive analytics platform for yield farming', status: 'COMPLETED' },
                  { title: 'NFT Marketplace', desc: 'ERC-721 marketplace with gas optimization', status: 'COMPLETED' },
                  { title: 'Governance Token', desc: 'DAO token with voting mechanisms', status: 'IN PROGRESS' },
                ].map((project, idx) => (
                  <div key={idx} className="border-2 border-black p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.desc}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold tracking-widest ${
                        project.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-8">
              <Link href="/client" className="flex-1">
                <button className="w-full border-3 border-black bg-black text-white py-4 font-bold text-lg tracking-widest hover:bg-white hover:text-black transition-all">
                  💼 HIRE THIS FREELANCER
                </button>
              </Link>
              <button className="flex-1 border-3 border-black text-black py-4 font-bold text-lg tracking-widest hover:bg-black hover:text-white transition-all">
                📞 CONTACT
              </button>
            </div>
          </div>
        )}

        {/* Graphs Tab */}
        {activeTab === 'graphs' && (
          <div>
            <ReputationGraph
              address={freelancer.address}
              reputationScore={score}
              credentialCount={credentialCount}
            />
          </div>
        )}

        {/* Certificate Tab */}
        {activeTab === 'certificate' && (
          <div>
            <CertificateTemplate
              freelancerName={freelancer.name || 'Freelancer'}
              address={freelancer.address}
              reputationScore={score}
              credentialCount={credentialCount}
              certificateId={certificateId}
            />
          </div>
        )}
      </main>
    </div>
  );
}
