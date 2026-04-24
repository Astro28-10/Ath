'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

type FreelancerSearchResult = {
  address: string;
  name?: string;
  reputationScore?: number;
  score?: number;
  credentialCount?: number;
  projects?: number;
  averageRating?: number;
  rating?: number;
};

type ProjectSearchResult = {
  id: number;
  title: string;
  client: string;
  budget: string;
  status: string;
  deadline: string;
};

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
        // Try to fetch reputation, otherwise return mock results
        try {
          const response = await axios.get(`${API_BASE}/reputation/${searchQuery}`);
          setResults([{ ...response.data, address: searchQuery }]);
        } catch {
          const filtered = mockFreelancers.filter(f =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.address.includes(searchQuery)
          );
          setResults(filtered);
        }
      } else {
        const filtered = mockProjects.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.client.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
      }
    } catch {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK</button>
          </Link>
          <h1 className="text-3xl font-bold">DISCOVER</h1>
          <p className="text-xs tracking-widest mt-2">SEARCH FREELANCERS & PROJECTS</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Search Form */}
        <div className="border-2 border-black p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <p className="text-xs tracking-widest font-bold mb-4">SEARCH TYPE</p>
              <div className="flex gap-4">
                {[
                  { label: 'FREELANCER', value: 'freelancer' },
                  { label: 'PROJECT', value: 'project' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSearchType(type.value)}
                    className={`px-4 py-2 border-2 text-xs font-bold tracking-widest transition-all ${
                      searchType === type.value
                        ? 'border-black bg-black text-white'
                        : 'border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest font-bold mb-4">
                {searchType === 'freelancer' ? 'FREELANCER ADDRESS OR NAME' : 'PROJECT TITLE OR CLIENT'}
              </p>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'freelancer' ? '0x... or alice.eth' : 'React Dashboard, API, etc'}
                className="w-full border-2 border-black px-4 py-3 text-sm focus:outline-none focus:bg-black focus:text-white transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!searchQuery.trim() || loading}
              className="w-full border-2 border-black bg-black text-white py-3 font-bold text-sm tracking-widest hover:bg-white hover:text-black disabled:opacity-50 transition-all"
            >
              {loading ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-2xl font-bold mb-8">
              RESULTS ({results.length})
            </h2>

            {results.length === 0 ? (
              <div className="border-2 border-black p-8 text-center">
                <p className="text-lg font-bold mb-2">NO RESULTS FOUND</p>
                <p className="text-sm">Try a different search query</p>
              </div>
            ) : (
              <div className="space-y-6">
                {searchType === 'freelancer' ? (
                  // Freelancer Results
                  (results as FreelancerSearchResult[]).map((freelancer, idx) => {
                    const score = freelancer.reputationScore ?? freelancer.score ?? 0;
                    const scorePercent = (score / 10000 * 100).toFixed(1);
                    const projects = freelancer.credentialCount ?? freelancer.projects ?? 0;
                    const rating = freelancer.averageRating ?? freelancer.rating ?? 0;

                    return (
                      <div key={idx} className="border-2 border-black p-6">
                        <div className="grid md:grid-cols-5 gap-4 items-center">
                          <div>
                            <p className="text-xs tracking-widest font-bold mb-2">NAME</p>
                            <p className="font-mono text-sm">{freelancer.name || freelancer.address.slice(0, 10) + '...'}</p>
                          </div>
                          <div>
                            <p className="text-xs tracking-widest font-bold mb-2">SCORE</p>
                            <p className="font-bold text-lg">{scorePercent}%</p>
                          </div>
                          <div>
                            <p className="text-xs tracking-widest font-bold mb-2">PROJECTS</p>
                            <p className="font-bold">{projects}</p>
                          </div>
                          <div>
                            <p className="text-xs tracking-widest font-bold mb-2">RATING</p>
                            <p className="font-bold">{rating}★</p>
                          </div>
                          <div className="md:text-right">
                            <Link href="/client">
                              <button className="w-full md:w-auto border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                                HIRE
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Project Results
                  (results as ProjectSearchResult[]).map((project, idx) => (
                    <div key={idx} className="border-2 border-black p-6">
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <p className="text-xs tracking-widest font-bold mb-2">PROJECT</p>
                          <h3 className="font-bold">{project.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">Client: {project.client}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-widest font-bold mb-2">BUDGET</p>
                          <p className="font-bold">{project.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-widest font-bold mb-2">DEADLINE</p>
                          <p className="font-bold text-sm">{project.deadline}</p>
                        </div>
                        <div className="md:text-right">
                          <button className="border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                            APPLY
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Suggested Searches */}
        {!searched && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">TRENDING FREELANCERS</h2>
              <div className="space-y-4">
                {mockFreelancers.slice(0, 3).map((freelancer, idx) => (
                  <div key={idx} className="border-2 border-black p-6 hover:bg-gray-100 transition cursor-pointer"
                       onClick={() => {
                         setSearchQuery(freelancer.name);
                         setSearchType('freelancer');
                       }}>
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <p className="font-mono text-sm">{freelancer.name}</p>
                      <p className="font-bold">{freelancer.score}%</p>
                      <p className="font-bold">{freelancer.projects}</p>
                      <p className="font-bold">{freelancer.rating}★</p>
                      <p className="text-xs text-gray-600">Click to search</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">OPEN PROJECTS</h2>
              <div className="space-y-4">
                {mockProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="border-2 border-black p-6 hover:bg-gray-100 transition cursor-pointer"
                       onClick={() => {
                         setSearchQuery(project.title);
                         setSearchType('project');
                       }}>
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm">{project.client}</p>
                      <p className="font-bold">{project.budget}</p>
                      <p className="text-xs text-gray-600">Click to search</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-black p-8 bg-gray-100">
              <p className="text-xs tracking-widest font-bold mb-4">QUICK STATS</p>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-bold text-2xl">{mockFreelancers.length}</p>
                  <p>Top Freelancers Listed</p>
                </div>
                <div>
                  <p className="font-bold text-2xl">{mockProjects.length}</p>
                  <p>Open Projects</p>
                </div>
                <div>
                  <p className="font-bold text-2xl">92%</p>
                  <p>Avg Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black mt-16 py-8 px-8 text-center">
        <p className="text-xs tracking-widest">SKILLBOND DISCOVERY</p>
      </footer>
    </div>
  );
}
