'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface Certificate {
  id: string;
  freelancer: string;
  issueDate: string;
  reputation: number;
  credentials: number;
}

const mockCertificates: Certificate[] = [
  {
    id: uuidv4(),
    freelancer: 'alice.eth',
    issueDate: '2024-04-20',
    reputation: 95,
    credentials: 5,
  },
  {
    id: uuidv4(),
    freelancer: 'bob.eth',
    issueDate: '2024-04-19',
    reputation: 72,
    credentials: 3,
  },
  {
    id: uuidv4(),
    freelancer: 'carol.eth',
    issueDate: '2024-04-18',
    reputation: 40,
    credentials: 1,
  },
];

export default function CertificatesPage() {
  const [certificates] = useState(mockCertificates);

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← HOME</button>
          </Link>
          <h1 className="text-3xl font-bold">CERTIFICATES</h1>
          <p className="text-xs tracking-widest mt-2 text-gray-600">BLOCKCHAIN-VERIFIED CREDENTIALS</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Info Box */}
        <div className="border-2 border-black p-6 mb-12" style={{background: 'linear-gradient(90deg, rgb(240, 249, 255) 0%, rgb(245, 243, 255) 100%)'}}>
          <h2 className="font-bold text-lg mb-3">📜 WHAT ARE SKILLBOND CERTIFICATES?</h2>
          <p className="text-sm text-gray-700 mb-3">
            SkillBond certificates are tamper-proof, blockchain-verified credentials that prove a freelancer's reputation and achievements.
            Each certificate is permanently recorded on the Polygon Amoy blockchain and can be publicly verified by anyone.
          </p>
          <p className="text-xs text-gray-600">
            Certificates cannot be forged or modified - they are immutable proof of work excellence.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">ISSUED CERTIFICATES ({certificates.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Link key={cert.id} href={`/certificate/${cert.id}`}>
                <div className="border-3 border-black p-6 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105" style={{background: 'linear-gradient(135deg, rgb(254, 252, 232) 0%, rgb(255, 255, 255) 100%)'}}>
                  <div className="text-3xl mb-4">📜</div>
                  <h3 className="text-lg font-bold mb-2">{cert.freelancer}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reputation:</span>
                      <span className="font-bold text-blue-600">{cert.reputation}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credentials:</span>
                      <span className="font-bold text-purple-600">{cert.credentials}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Issued:</span>
                      <span className="font-bold">{cert.issueDate}</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3">
                    <p className="text-xs text-gray-600 font-mono truncate">{cert.id}</p>
                  </div>
                  <button className="w-full mt-4 border-2 border-black py-2 font-bold text-xs tracking-widest hover:bg-black hover:text-white transition-all">
                    VIEW & VERIFY
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 border-t-4 border-black pt-12">
          <h2 className="text-2xl font-bold mb-8">WHY BLOCKCHAIN CERTIFICATES?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-black p-6">
              <p className="text-3xl mb-3">🔒</p>
              <h3 className="font-bold mb-2">IMMUTABLE</h3>
              <p className="text-sm text-gray-700">
                Once issued, certificates cannot be modified or deleted. Permanent proof of achievement.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <p className="text-3xl mb-3">🌍</p>
              <h3 className="font-bold mb-2">PUBLICLY VERIFIABLE</h3>
              <p className="text-sm text-gray-700">
                Anyone can verify certificates using PolygonScan without creating an account.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <p className="text-3xl mb-3">🎯</p>
              <h3 className="font-bold mb-2">NO SINGLE POINT OF FAILURE</h3>
              <p className="text-sm text-gray-700">
                Data is stored on decentralized blockchain, not on a single company's servers.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
