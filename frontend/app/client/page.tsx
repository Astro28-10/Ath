'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

type FreelancerReputation = {
  reputationScore: number;
  credentialCount: number;
  averageRating: number;
};

export default function ClientCreateProject() {
  const [step, setStep] = useState(1);
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('7');
  const [description, setDescription] = useState('');
  const [reputation, setReputation] = useState<FreelancerReputation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookupReputation = async () => {
    if (!freelancerAddress) {
      setError('Address required');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const response = await axios.get(`${API_BASE}/reputation/${freelancerAddress}`);
      setReputation(response.data);
      setStep(2);
    } catch {
      setError('Not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${API_BASE}/projects`, {
        clientAddress: '0xClientAddressHere',
        freelancerAddress,
        amount,
        duration: parseInt(duration),
        description,
      });
      setStep(4);
    } catch {
      setError('Failed');
    } finally {
      setLoading(false);
    }
  };

  const reputationDiscount = reputation ? (100 - (reputation.reputationScore / 100)) : 0;
  const discountedAmount = amount ? (parseFloat(amount) * (100 - reputationDiscount) / 100).toFixed(4) : 0;

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <button className="text-xs tracking-widest font-bold hover:underline">← BACK</button>
            </Link>
            <Link href="/history">
              <button className="border-2 border-black px-3 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                YOUR PROJECTS
              </button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">CREATE PROJECT</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Step Indicator */}
        <div className="mb-16">
          <div className="flex justify-between items-end gap-4 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-2 ${step >= s ? 'bg-black' : 'bg-gray-300'} mb-2`} />
                <p className="text-xs tracking-widest font-bold">
                  {s === 1 && 'FIND'}
                  {s === 2 && 'BUDGET'}
                  {s === 3 && 'REVIEW'}
                  {s === 4 && 'DONE'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">FIND TALENT</h2>
            <div className="border-2 border-black p-8">
              <div className="mb-6">
                <label className="text-xs tracking-widest font-bold block mb-4">
                  FREELANCER ADDRESS
                </label>
                <input
                  type="text"
                  value={freelancerAddress}
                  onChange={(e) => {
                    setFreelancerAddress(e.target.value);
                    setError('');
                  }}
                  placeholder="0x1234567890123456789012345678901234567890"
                  className="w-full border-2 border-black px-4 py-3 text-sm focus:outline-none focus:bg-black focus:text-white transition"
                />
              </div>

              {error && (
                <div className="border-2 border-black p-4 mb-6 bg-red-100">
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <button
                onClick={handleLookupReputation}
                disabled={!freelancerAddress || loading}
                className="w-full border-2 border-black bg-black text-white py-3 font-bold text-sm tracking-widest hover:bg-white hover:text-black disabled:opacity-50 transition-all"
              >
                {loading ? 'CHECKING...' : 'CHECK REPUTATION'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && reputation && (
          <div>
            <h2 className="text-3xl font-bold mb-8">BUDGET & DETAILS</h2>

            {/* Reputation Box */}
            <div className="border-2 border-black p-8 mb-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">REPUTATION</p>
                  <p className="text-4xl font-bold">{(reputation.reputationScore / 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest font-bold mb-2">YOUR DISCOUNT</p>
                  <p className="text-4xl font-bold text-red-700">{reputationDiscount.toFixed(0)}%</p>
                </div>
              </div>

              <div className="border-t-2 border-black pt-8 grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-xs tracking-widest font-bold mb-1">PROJECTS</p>
                  <p className="text-2xl font-bold">{reputation.credentialCount}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest font-bold mb-1">RATING</p>
                  <p className="text-2xl font-bold">{reputation.averageRating}★</p>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="border-2 border-black p-8 mb-8">
              <div className="mb-6">
                <label className="text-xs tracking-widest font-bold block mb-4">BUDGET (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2.5"
                  className="w-full border-2 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-black focus:text-white transition"
                />
              </div>

              {amount && (
                <div className="bg-gray-100 border-2 border-black p-4 mb-6 text-sm">
                  <div className="flex justify-between mb-2">
                    <span>ORIGINAL</span>
                    <span className="font-bold">Ξ {parseFloat(amount).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between mb-2 border-t-2 border-black pt-2">
                    <span>DISCOUNT ({reputationDiscount.toFixed(0)}%)</span>
                    <span className="font-bold text-red-700">-Ξ {(parseFloat(amount) * reputationDiscount / 100).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-black pt-2 font-bold">
                    <span>YOU PAY</span>
                    <span>Ξ {discountedAmount}</span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="text-xs tracking-widest font-bold block mb-4">TIMELINE</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:bg-black focus:text-white transition"
                >
                  {[3, 5, 7, 14, 30].map(d => (
                    <option key={d} value={d}>{d} days</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label className="text-xs tracking-widest font-bold block mb-4">DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What needs to be built?"
                  rows={5}
                  className="w-full border-2 border-black px-4 py-3 focus:outline-none focus:bg-black focus:text-white transition font-mono text-sm"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-black px-4 py-3 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!amount || !description}
                  className="flex-1 border-2 border-black bg-black text-white px-4 py-3 text-xs font-bold tracking-widest hover:bg-white hover:text-black disabled:opacity-50 transition-all"
                >
                  REVIEW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && reputation && (
          <div>
            <h2 className="text-3xl font-bold mb-8">REVIEW & FUND</h2>

            <div className="border-2 border-black p-8 mb-8">
              <div className="mb-8 border-b-2 border-black pb-8">
                <p className="text-xs tracking-widest font-bold mb-2">FREELANCER</p>
                <p className="font-mono text-sm break-all mb-4">{freelancerAddress}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs tracking-widest mb-1">REPUTATION</p>
                    <p className="font-bold text-lg">{(reputation.reputationScore / 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest mb-1">PROJECTS</p>
                    <p className="font-bold text-lg">{reputation.credentialCount}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest mb-1">RATING</p>
                    <p className="font-bold text-lg">{reputation.averageRating}★</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 border-b-2 border-black pb-8">
                <p className="text-xs tracking-widest font-bold mb-4">PROJECT</p>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs tracking-widest mb-1">TIMELINE</p>
                    <p className="font-bold">{duration} days</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest mb-1">DESCRIPTION</p>
                    <p className="font-mono">{description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 border-2 border-black mb-8">
                <p className="text-xs tracking-widest font-bold mb-4">COST BREAKDOWN</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>ORIGINAL</span>
                    <span className="font-bold">Ξ {parseFloat(amount).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-red-700 font-bold">
                    <span>DISCOUNT ({reputationDiscount.toFixed(0)}%)</span>
                    <span>-Ξ {(parseFloat(amount) * reputationDiscount / 100).toFixed(4)}</span>
                  </div>
                  <div className="border-t-2 border-black pt-3 flex justify-between font-bold text-lg">
                    <span>TOTAL</span>
                    <span>Ξ {discountedAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-black px-4 py-3 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={loading}
                  className="flex-1 border-2 border-black bg-black text-white px-4 py-3 text-xs font-bold tracking-widest hover:bg-white hover:text-black disabled:opacity-50 transition-all"
                >
                  {loading ? 'FUNDING...' : 'FUND ESCROW'}
                </button>
              </div>

              {error && (
                <div className="mt-4 border-2 border-black p-4 bg-red-100">
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <div className="border-2 border-black p-8 text-center">
              <p className="text-6xl mb-6">✓</p>
              <h2 className="text-3xl font-bold mb-4">PROJECT CREATED</h2>
              <p className="text-lg mb-8">Escrow funded and freelancer notified</p>

              <div className="bg-gray-100 border-2 border-black p-6 mb-8">
                <p className="text-xs tracking-widest font-bold mb-2">AMOUNT FUNDED</p>
                <p className="text-4xl font-bold mb-2">Ξ {discountedAmount}</p>
                <p className="text-sm text-red-700 font-bold">
                  SAVED Ξ {(parseFloat(amount) * reputationDiscount / 100).toFixed(4)}
                </p>
              </div>

              <Link href="/">
                <button className="w-full border-2 border-black bg-black text-white py-3 font-bold text-sm tracking-widest hover:bg-white hover:text-black transition-all">
                  BACK TO HOME
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
