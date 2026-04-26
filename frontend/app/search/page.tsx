'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:3001/api';

type FreelancerSearchResult = { address: string; name?: string; reputationScore?: number; score?: number; credentialCount?: number; projects?: number; averageRating?: number; rating?: number };
type ProjectSearchResult = { id: number; title: string; client: string; budget: string; status: string; deadline: string };
type SearchResult = FreelancerSearchResult | ProjectSearchResult;

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('freelancer');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const mockFreelancers = [
    { address: '0x1234567890123456789012345678901234567890', name: 'alice.eth', score: 98, projects: 156, rating: 4.98 },
    { address: '0x2345678901234567890123456789012345678901', name: 'bob_dev.eth', score: 96, projects: 142, rating: 4.92 },
    { address: '0x3456789012345678901234567890123456789012', name: 'carol.sol', score: 95, projects: 138, rating: 4.89 },
    { address: '0x4567890123456789012345678901234567890123', name: 'dave.web3', score: 93, projects: 124, rating: 4.85 },
  ];

  const mockProjects = [
    { id: 1, title: 'Build React Dashboard', client: 'TechCorp', budget: '2.5 ETH', status: 'OPEN', deadline: '30 days' },
    { id: 2, title: 'Smart Contract Audit', client: 'DeFi Labs', budget: '5 ETH', status: 'OPEN', deadline: '14 days' },
    { id: 3, title: 'Mobile App Design', client: 'StartupXYZ', budget: '1.2 ETH', status: 'OPEN', deadline: '21 days' },
    { id: 4, title: 'API Integration', client: 'Enterprise Inc', budget: '3 ETH', status: 'OPEN', deadline: '10 days' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      if (searchType === 'freelancer') {
        try {
          const response = await axios.get(`${API_BASE}/reputation/${searchQuery}`);
          setResults([{ ...response.data, address: searchQuery }]);
        } catch {
          const filtered = mockFreelancers.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.address.includes(searchQuery));
          setResults(filtered);
        }
      } else {
        const filtered = mockProjects.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.client.toLowerCase().includes(searchQuery.toLowerCase()));
        setResults(filtered);
      }
    } catch {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-12">
        <div className="section-container">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Discover</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Search freelancers & projects</p>
        </div>
      </section>

      <main className="section-container flex-1 pb-16">
        {/* Search Form */}
        <div className="solid-card p-8 mb-10">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <p className="label">Search Type</p>
              <div className="flex gap-3">
                {[{ label: 'Freelancer', value: 'freelancer' }, { label: 'Project', value: 'project' }].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSearchType(type.value)}
                    className="px-5 py-2.5 text-xs font-medium rounded-lg transition-all"
                    style={{
                      background: searchType === type.value ? 'var(--accent-blue)' : 'transparent',
                      color: searchType === type.value ? 'white' : 'var(--text-secondary)',
                      border: `1px solid ${searchType === type.value ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="label">{searchType === 'freelancer' ? 'Address or Name' : 'Title or Client'}</p>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'freelancer' ? '0x... or alice.eth' : 'React Dashboard, API, etc'}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={!searchQuery.trim() || loading} className="btn-primary w-full">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6">Results ({results.length})</h2>
            {results.length === 0 ? (
              <div className="solid-card p-8 text-center">
                <p className="font-semibold mb-1">No results found</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try a different search query</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchType === 'freelancer'
                  ? (results as FreelancerSearchResult[]).map((f, idx) => {
                      const score = f.reputationScore ?? f.score ?? 0;
                      const scorePercent = ((score / 10000) * 100).toFixed(1);
                      const projects = f.credentialCount ?? f.projects ?? 0;
                      const rating = f.averageRating ?? f.rating ?? 0;
                      return (
                        <div key={idx} className="solid-card p-6">
                          <div className="grid md:grid-cols-5 gap-4 items-center">
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Name</p>
                              <p className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{f.name || f.address.slice(0, 10) + '...'}</p>
                            </div>
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Score</p>
                              <p className="font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{scorePercent}%</p>
                            </div>
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Projects</p>
                              <p className="font-semibold">{projects}</p>
                            </div>
                            <div>
                              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Rating</p>
                              <p className="font-semibold">{rating}★</p>
                            </div>
                            <div className="md:text-right">
                              <Link href={`/freelancer/${f.address}`}>
                                <button className="btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>View Profile</button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : (results as ProjectSearchResult[]).map((p, idx) => (
                      <div key={idx} className="solid-card p-6">
                        <div className="grid md:grid-cols-5 gap-4 items-center">
                          <div className="md:col-span-2">
                            <h3 className="font-semibold">{p.title}</h3>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Client: {p.client}</p>
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Budget</p>
                            <p className="font-semibold">{p.budget}</p>
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Deadline</p>
                            <p className="text-sm">{p.deadline}</p>
                          </div>
                          <div className="md:text-right">
                            <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>Apply</button>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}

        {/* Suggested */}
        {!searched && (
          <div className="space-y-10 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold mb-6">Trending Freelancers</h2>
              <div className="space-y-3">
                {mockFreelancers.slice(0, 3).map((f, idx) => (
                  <div
                    key={idx}
                    className="solid-card p-5 cursor-pointer"
                    onClick={() => { setSearchQuery(f.name); setSearchType('freelancer'); }}
                  >
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <p className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{f.name}</p>
                      <p className="font-semibold" style={{ color: 'var(--accent-blue-light)' }}>{f.score}%</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.projects} projects</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.rating}★</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to search</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-6">Open Projects</h2>
              <div className="space-y-3">
                {mockProjects.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="solid-card p-5 cursor-pointer"
                    onClick={() => { setSearchQuery(p.title); setSearchType('project'); }}
                  >
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.client}</p>
                      <p className="font-semibold">{p.budget}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to search</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
