'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProjectHistory() {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      freelancer: 'alice.eth',
      amount: '2.5 ETH',
      status: 'COMPLETED',
      rating: 5.0,
      duration: 14,
      fundedDate: '2024-01-15',
      completedDate: '2024-01-29',
    },
    {
      id: 2,
      title: 'Mobile App Redesign',
      freelancer: 'bob_dev.eth',
      amount: '1.8 ETH',
      status: 'COMPLETED',
      rating: 4.8,
      duration: 7,
      fundedDate: '2024-01-10',
      completedDate: '2024-01-17',
    },
    {
      id: 3,
      title: 'REST API Development',
      freelancer: 'carol.sol',
      amount: '3.2 ETH',
      status: 'ACTIVE',
      rating: null,
      duration: 21,
      fundedDate: '2024-01-05',
      completedDate: null,
    },
    {
      id: 4,
      title: 'Dashboard & Backend',
      freelancer: 'dave.web3',
      amount: '5.0 ETH',
      status: 'IN_PROGRESS',
      rating: null,
      duration: 30,
      fundedDate: '2023-12-28',
      completedDate: null,
    },
    {
      id: 5,
      title: 'UI Components Library',
      freelancer: 'eve_coder.eth',
      amount: '2.1 ETH',
      status: 'COMPLETED',
      rating: 4.9,
      duration: 10,
      fundedDate: '2023-12-15',
      completedDate: '2023-12-25',
    },
  ];

  const filtered = projects.filter(p => {
    if (activeFilter === 'active') return p.status === 'ACTIVE' || p.status === 'IN_PROGRESS';
    if (activeFilter === 'completed') return p.status === 'COMPLETED';
    return true;
  });

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    active: projects.filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS').length,
    totalSpent: '14.6 ETH',
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK</button>
          </Link>
          <h1 className="text-3xl font-bold">PROJECT HISTORY</h1>
          <p className="text-xs tracking-widest mt-2">YOUR HIRING TIMELINE</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'TOTAL PROJECTS', value: stats.total },
            { label: 'COMPLETED', value: stats.completed },
            { label: 'ACTIVE', value: stats.active },
            { label: 'TOTAL SPENT', value: stats.totalSpent },
          ].map((stat, idx) => (
            <div key={idx} className="border-2 border-black p-6">
              <p className="text-xs tracking-widest font-bold mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-12">
          <p className="text-xs tracking-widest font-bold mb-4">FILTER</p>
          <div className="flex gap-2">
            {[
              { label: 'ALL', value: 'all' },
              { label: 'ACTIVE', value: 'active' },
              { label: 'COMPLETED', value: 'completed' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 border-2 text-xs font-bold tracking-widest transition-all ${
                  activeFilter === filter.value
                    ? 'border-black bg-black text-white'
                    : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {filtered.map((project, idx) => (
            <div key={project.id} className="border-2 border-black">
              {/* Header */}
              <div className="border-b-2 border-black p-6 bg-gray-100">
                <div className="grid md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-1">PROJECT</p>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-1">FREELANCER</p>
                    <p className="font-mono text-sm">{project.freelancer}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-1">STATUS</p>
                    <p className={`font-bold text-sm ${
                      project.status === 'COMPLETED' ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {project.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-1">BUDGET</p>
                    <p className="font-bold">{project.amount}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-3 gap-6 p-6">
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">DURATION</p>
                  <p className="text-lg font-bold">{project.duration} days</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">FUNDED</p>
                  <p className="text-sm">{project.fundedDate}</p>
                </div>
                {project.status === 'COMPLETED' && project.completedDate && (
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-2">COMPLETED</p>
                    <p className="text-sm">{project.completedDate}</p>
                  </div>
                )}
                {project.rating && (
                  <div>
                    <p className="text-xs tracking-widest font-bold mb-2">YOUR RATING</p>
                    <p className="text-lg font-bold">{project.rating}★</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {project.status === 'COMPLETED' && (
                <div className="border-t-2 border-black p-6 flex gap-2">
                  <Link href={`/verify?id=${project.id}`}>
                    <button className="flex-1 border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                      VIEW CREDENTIAL
                    </button>
                  </Link>
                  <button className="flex-1 border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all">
                    SHARE
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-16 pt-16 border-t-4 border-black">
          <h2 className="text-2xl font-bold mb-8">TIMELINE</h2>
          <div className="space-y-6">
            {projects
              .sort((a, b) => new Date(b.fundedDate).getTime() - new Date(a.fundedDate).getTime())
              .slice(0, 5)
              .map((project, idx) => (
                <div key={project.id} className="pl-8 border-l-2 border-black">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-4 h-4 bg-black rounded-full ml-[-14px]" />
                    <p className="text-xs tracking-widest font-bold">{project.fundedDate}</p>
                  </div>
                  <p className="ml-2 font-bold">{project.title} • {project.amount}</p>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black mt-16 py-8 px-8 text-center">
        <p className="text-xs tracking-widest">PROJECT HISTORY</p>
      </footer>
    </div>
  );
}
