'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EscrowVisualizer } from '../components/EscrowVisualizer';
import { ReputationRatingVisualizer } from '../components/ReputationRatingVisualizer';
import { TimelineVisualizer } from '../components/TimelineVisualizer';
import { CertificateGenerator } from '../components/CertificateGenerator';
import { BlockchainVerification } from '../components/BlockchainVerification';
import { DisputeResolutionSimulator } from '../components/DisputeResolutionSimulator';
import { DEMO_SCENARIOS, formatAddress, getReputationColor, getReputationLabel } from '../utils/demoData';

interface EscrowData {
  baseAmount: number;
  escrowCost: number;
  finalAmount: number;
  breakdown: {
    clientDiscount: number;
    freelancerDiscount: number;
    totalDiscount: number;
  };
  percentages: {
    escrowCostPercent: string;
    discountApplied: string;
    clientRepPercent: string;
    freelancerRepPercent: string;
  };
}

interface ReputationImpactData {
  outcome: string;
  reason: string;
  changes: {
    clientRepChange: number;
    freelancerRepChange: number;
  };
  before: {
    clientReputation: number;
    freelancerReputation: number;
  };
  after: {
    clientReputation: number;
    freelancerReputation: number;
  };
  percentageChange: {
    clientChangePercent: string;
    freelancerChangePercent: string;
  };
}

interface RatingImpactData {
  before: {
    avgRating: string;
    totalProjects: number;
  };
  after: {
    avgRating: string;
    totalProjects: number;
  };
  change: {
    difference: string;
    percentChange: string;
  };
  impact: string;
}

type Step = 'select' | 'review' | 'create' | 'fund' | 'deliver' | 'approve' | 'complete';

const API_BASE = 'http://localhost:3001/api';

const WORKFLOW_STEPS: Record<Step, { label: string; number: number }> = {
  select: { label: 'Select Scenario', number: 1 },
  review: { label: 'Review Project', number: 2 },
  create: { label: 'Create Work Order', number: 3 },
  fund: { label: 'Fund Project', number: 4 },
  deliver: { label: 'Deliver Work', number: 5 },
  approve: { label: 'Approve & Complete', number: 6 },
  complete: { label: 'View Certificate', number: 7 },
};

const STEP_ORDER: Step[] = ['select', 'review', 'create', 'fund', 'deliver', 'approve', 'complete'];

export default function SimulatePage() {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof DEMO_SCENARIOS>('alice_bob');
  const [outcome, setOutcome] = useState<'completed' | 'disputed_favorable' | 'disputed_unfavorable' | 'refunded'>('completed');
  const [clientRating, setClientRating] = useState(5);
  const [activeTab, setActiveTab] = useState<'certificate' | 'reputation' | 'timeline' | 'blockchain'>('certificate');
  const [showDisputeSimulator, setShowDisputeSimulator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const [reputationImpact, setReputationImpact] = useState<ReputationImpactData | null>(null);
  const [ratingImpact, setRatingImpact] = useState<RatingImpactData | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [certificateData, setCertificateData] = useState<Record<string, unknown> | null>(null);

  const scenario = DEMO_SCENARIOS[selectedScenario];

  const goToStep = (step: Step) => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const targetIndex = STEP_ORDER.indexOf(step);
    if (targetIndex <= currentIndex) {
      setCurrentStep(step);
      setError(null);
    }
  };

  const nextStep = async () => {
    setError(null);
    if (currentStep === 'select') setCurrentStep('review');
    else if (currentStep === 'review') setCurrentStep('create');
    else if (currentStep === 'create') await calculateEscrow();
    else if (currentStep === 'fund') setCurrentStep('deliver');
    else if (currentStep === 'deliver') setCurrentStep('approve');
    else if (currentStep === 'approve') await runFullSimulation();
  };

  const calculateEscrow = async () => {
    setLoading(true);
    try {
      const amount = Math.floor(Number(scenario.project.amount) * 1e18);
      try {
        const response = await axios.post(`${API_BASE}/simulate/calculate-escrow`, {
          baseAmount: amount,
          clientReputation: scenario.client.reputation,
          freelancerReputation: scenario.freelancer.reputation,
        });
        setEscrowData(response.data.data);
      } catch {
        // Fallback: calculate locally when backend is offline
        const clientRep = scenario.client.reputation;
        const freelancerRep = scenario.freelancer.reputation;
        const combinedRep = (clientRep + freelancerRep) / 2;
        const discountBps = Math.floor(combinedRep / 333); // 0-30% discount based on reputation
        const escrowCost = Math.floor(amount * discountBps / 100);
        const finalAmount = amount - escrowCost;
        setEscrowData({
          baseAmount: amount,
          escrowCost,
          finalAmount,
          breakdown: {
            clientDiscount: Math.floor(clientRep / 333),
            freelancerDiscount: Math.floor(freelancerRep / 333),
            totalDiscount: discountBps,
          },
          percentages: {
            escrowCostPercent: (escrowCost / amount * 100).toFixed(2),
            discountApplied: (discountBps).toFixed(2),
            clientRepPercent: (clientRep / 100).toFixed(1),
            freelancerRepPercent: (freelancerRep / 100).toFixed(1),
          },
        });
      }
      setCurrentStep('fund');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error || err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const runFullSimulation = async () => {
    setLoading(true);
    try {
      const amount = Math.floor(Number(scenario.project.amount) * 1e18);

      // Reputation impact
      let repData: ReputationImpactData;
      try {
        const repResponse = await axios.post(`${API_BASE}/simulate/reputation-impact`, {
          clientReputation: scenario.client.reputation,
          freelancerReputation: scenario.freelancer.reputation,
          projectAmount: amount,
          outcome,
        });
        repData = repResponse.data.data;
      } catch {
        // Fallback: mock reputation impact
        const clientRep = scenario.client.reputation;
        const freelancerRep = scenario.freelancer.reputation;
        const isGood = outcome === 'completed' || outcome === 'disputed_favorable';
        const change = isGood ? 500 : -300;
        repData = {
          outcome,
          reason: isGood ? 'Project completed successfully' : 'Project had issues',
          changes: { clientRepChange: Math.floor(change * 0.8), freelancerRepChange: change },
          before: { clientReputation: clientRep, freelancerReputation: freelancerRep },
          after: {
            clientReputation: Math.min(10000, Math.max(0, clientRep + Math.floor(change * 0.8))),
            freelancerReputation: Math.min(10000, Math.max(0, freelancerRep + change)),
          },
          percentageChange: {
            clientChangePercent: ((change * 0.8) / 100).toFixed(1),
            freelancerChangePercent: (change / 100).toFixed(1),
          },
        };
      }
      setReputationImpact(repData);

      // Rating impact
      let ratingData: RatingImpactData;
      try {
        const ratingResponse = await axios.post(`${API_BASE}/simulate/rating-impact`, {
          currentAvgRating: scenario.freelancer.rating,
          projectRating: clientRating,
          totalProjects: scenario.freelancer.projects,
        });
        ratingData = ratingResponse.data.data;
      } catch {
        // Fallback: mock rating impact
        const oldRating = scenario.freelancer.rating;
        const totalProjects = scenario.freelancer.projects;
        const newRating = ((oldRating * totalProjects) + clientRating) / (totalProjects + 1);
        ratingData = {
          before: { avgRating: oldRating.toFixed(2), totalProjects },
          after: { avgRating: newRating.toFixed(2), totalProjects: totalProjects + 1 },
          change: {
            difference: (newRating - oldRating).toFixed(3),
            percentChange: (((newRating - oldRating) / oldRating) * 100).toFixed(2),
          },
          impact: newRating > oldRating ? 'Positive — rating improved' : newRating < oldRating ? 'Negative — rating decreased' : 'Neutral — no change',
        };
      }
      setRatingImpact(ratingData);

      // Timeline
      try {
        const timelineResponse = await axios.post(`${API_BASE}/simulate/timeline`, {
          durationDays: scenario.project.durationDays,
        });
        setTimeline(timelineResponse.data.data);
      } catch {
        // Fallback: mock timeline
        const d = scenario.project.durationDays;
        setTimeline([
          { stage: 1, name: 'Work Order Created', description: 'Client and freelancer agree on terms', daysFromStart: 0, color: 'blue', icon: '📋' },
          { stage: 2, name: 'Funds Locked in Escrow', description: 'Client deposits funds into smart contract', daysFromStart: 0, color: 'yellow', icon: '🔒' },
          { stage: 3, name: 'Work in Progress', description: 'Freelancer begins project development', daysFromStart: 1, color: 'purple', icon: '⚡' },
          { stage: 4, name: 'Deliverables Submitted', description: 'Freelancer submits completed work', daysFromStart: d, color: 'blue', icon: '📦' },
          { stage: 5, name: 'Review Period', description: 'Client reviews and approves or disputes', daysFromStart: d, color: 'orange', icon: '🔍' },
          { stage: 6, name: 'Project Completed', description: 'Funds released and credential minted', daysFromStart: d + 2, color: 'green', icon: '✅' },
        ]);
      }

      const certId = `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const certHash = `0x${Math.random().toString(16).substr(2)}${Math.random().toString(16).substr(2)}`;
      setCertificateData({
        certificateId: certId,
        freelancerName: scenario.freelancer.name,
        freelancerAddress: scenario.freelancer.address,
        clientName: scenario.client.name,
        projectTitle: scenario.project.title,
        projectAmount: scenario.project.amount,
        issueDate: new Date().toISOString(),
        reputationBefore: scenario.freelancer.reputation,
        reputationAfter: repData.after.freelancerReputation,
        hash: certHash,
      });
      setCurrentStep('complete');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error || err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setCurrentStep('select');
    setEscrowData(null);
    setReputationImpact(null);
    setRatingImpact(null);
    setTimeline([]);
    setCertificateData(null);
    setError(null);
    setActiveTab('certificate');
  };

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="section-container py-8 flex-1">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex gap-1.5 overflow-x-auto pb-3">
            {STEP_ORDER.map((step, idx) => {
              const isActive = step === currentStep;
              const isCompleted = idx < currentIndex;
              const isDisabled = idx > currentIndex;
              return (
                <div key={step} className="flex items-center gap-1.5">
                  <button
                    onClick={() => goToStep(step)}
                    disabled={isDisabled}
                    className="flex-shrink-0 w-10 h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isActive ? 'var(--accent-blue)' : isCompleted ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)',
                      color: isActive ? 'white' : isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      border: `1px solid ${isActive ? 'var(--accent-blue)' : isCompleted ? 'rgba(16,185,129,0.3)' : 'var(--border-default)'}`,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.4 : 1,
                    }}
                  >
                    {isCompleted ? '✓' : WORKFLOW_STEPS[step].number}
                  </button>
                  {idx < STEP_ORDER.length - 1 && (
                    <div
                      className="w-6 h-0.5 rounded-full"
                      style={{ background: isCompleted ? 'var(--accent-emerald)' : 'var(--border-default)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold">{WORKFLOW_STEPS[currentStep].label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Step {WORKFLOW_STEPS[currentStep].number} of 7</p>
          </div>
        </div>

        {error && (
          <div className="solid-card p-4 mb-8" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--accent-rose)' }}>Error: {error}</p>
          </div>
        )}

        {/* Step: Select */}
        {currentStep === 'select' && (
          <div className="space-y-6 animate-fade-in">
            <div className="solid-card p-8" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
              <h2 className="text-2xl font-bold mb-2 tracking-tight">Select a Scenario</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Choose a pre-configured project to simulate different reputation levels.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(DEMO_SCENARIOS).map(([id, scen]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedScenario(id as keyof typeof DEMO_SCENARIOS)}
                    className="p-5 rounded-lg text-left transition-all duration-200"
                    style={{
                      background: selectedScenario === id ? 'rgba(59,130,246,0.1)' : 'var(--bg-elevated)',
                      border: `1px solid ${selectedScenario === id ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                      boxShadow: selectedScenario === id ? '0 0 20px var(--glow-blue)' : 'none',
                    }}
                  >
                    <p className="font-semibold mb-1">{scen.name}</p>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{scen.description}</p>
                    <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                      <p>Budget: {scen.project.amount} ETH</p>
                      <p>Duration: {scen.project.durationDays} days</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={nextStep} className="btn-primary w-full" style={{ padding: '16px' }}>Continue to Review</button>
          </div>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Client', data: scenario.client },
                { label: 'Freelancer', data: scenario.freelancer },
              ].map((party) => (
                <div key={party.label} className="solid-card p-6">
                  <p className="label" style={{ color: 'var(--text-muted)' }}>{party.label}</p>
                  <h3 className="text-xl font-bold mb-4">{party.data.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>Reputation</span>
                      <span className={`font-semibold ${getReputationColor(party.data.reputation)}`}>
                        {(party.data.reputation / 100).toFixed(1)}% ({getReputationLabel(party.data.reputation)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>Rating</span>
                      <span className="font-semibold">{party.data.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>Projects</span>
                      <span className="font-semibold">{party.data.projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>Address</span>
                      <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{formatAddress(party.data.address)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="solid-card p-6">
              <p className="label" style={{ color: 'var(--text-muted)' }}>Project</p>
              <h3 className="text-xl font-bold mb-4">{scenario.project.title}</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <p style={{ color: 'var(--text-secondary)' }}>{scenario.project.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Budget</span>
                    <span className="font-bold text-lg">{scenario.project.amount} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                    <span className="font-bold text-lg">{scenario.project.durationDays} Days</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {scenario.project.skills.map((skill) => (
                  <span key={skill} className="badge badge-blue">{skill}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setCurrentStep('select')} className="btn-secondary flex-1">Back</button>
              <button onClick={nextStep} className="btn-primary flex-1">Continue</button>
            </div>
          </div>
        )}

        {/* Step: Create */}
        {currentStep === 'create' && (
          <div className="space-y-6 animate-fade-in">
            <div className="solid-card p-8" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
              <p className="label" style={{ color: 'var(--accent-emerald)' }}>Step 3</p>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Create Work Order</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                A work order is created between {scenario.client.name} and {scenario.freelancer.name}. No funds locked yet.
              </p>
              <div className="solid-card p-4 space-y-2 text-sm" style={{ background: 'var(--bg-primary)' }}>
                <p><strong>Client:</strong> {scenario.client.name}</p>
                <p><strong>Freelancer:</strong> {scenario.freelancer.name}</p>
                <p><strong>Project:</strong> {scenario.project.title}</p>
                <p><strong>Amount:</strong> {scenario.project.amount} ETH</p>
                <p><strong>Status:</strong> <span style={{ color: 'var(--accent-amber)' }}>PENDING</span></p>
              </div>
            </div>
            <button onClick={nextStep} disabled={loading} className="btn-primary w-full" style={{ padding: '16px' }}>
              {loading ? 'Calculating Escrow...' : 'Proceed to Funding'}
            </button>
          </div>
        )}

        {/* Step: Fund */}
        {currentStep === 'fund' && escrowData && (
          <div className="space-y-6 animate-fade-in">
            <div className="solid-card p-8" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
              <p className="label" style={{ color: 'var(--accent-amber)' }}>Step 4</p>
              <h2 className="text-2xl font-bold mb-2 tracking-tight">Fund Project (Lock Escrow)</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Reputation scores determine escrow cost. See the breakdown below.
              </p>
            </div>
            <EscrowVisualizer calculation={escrowData} />
            <div className="flex gap-4">
              <button onClick={() => setCurrentStep('create')} className="btn-secondary flex-1">Back</button>
              <button onClick={nextStep} className="btn-primary flex-1">Funds Locked — Start Work</button>
            </div>
          </div>
        )}

        {/* Step: Deliver */}
        {currentStep === 'deliver' && (
          <div className="space-y-6 animate-fade-in">
            <div className="solid-card p-8" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
              <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Step 5</p>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Deliver Work</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {scenario.freelancer.name} completed &quot;{scenario.project.title}&quot; after {scenario.project.durationDays} days.
              </p>
              <div className="solid-card p-4 space-y-2 text-sm" style={{ background: 'var(--bg-primary)' }}>
                <p><strong>Deliverables:</strong> Project files, documentation, deployment guide</p>
                <p><strong>IPFS Hash:</strong> <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>QmXxX...xXxX</code></p>
                <p><strong>Status:</strong> <span style={{ color: 'var(--accent-blue-light)' }}>AWAITING REVIEW</span></p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setCurrentStep('fund')} className="btn-secondary flex-1">Back</button>
              <button onClick={nextStep} className="btn-primary flex-1">Proceed to Approval</button>
            </div>
          </div>
        )}

        {/* Step: Approve */}
        {currentStep === 'approve' && (
          <div className="space-y-6 animate-fade-in">
            <div className="solid-card p-8">
              <p className="label" style={{ color: 'var(--accent-amber)' }}>Step 6</p>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Approve & Complete</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {scenario.client.name} reviews and decides the outcome:
              </p>

              <div className="space-y-3">
                {[
                  { value: 'completed', label: 'Approve — Work is satisfactory', desc: 'Funds released to freelancer, credential minted' },
                  { value: 'disputed_favorable', label: 'Dispute — Freelancer wins', desc: 'Arbitration sided with freelancer' },
                  { value: 'disputed_unfavorable', label: 'Dispute — Client wins', desc: 'Work did not meet standards' },
                  { value: 'refunded', label: 'Refund — No work delivered', desc: 'Project cancelled, full refund' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200"
                    style={{
                      background: outcome === opt.value ? 'rgba(59,130,246,0.08)' : 'var(--bg-elevated)',
                      border: `1px solid ${outcome === opt.value ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value={opt.value}
                      checked={outcome === opt.value}
                      onChange={(e) => setOutcome(e.target.value as typeof outcome)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {outcome === 'completed' && (
                <div className="mt-6">
                  <label className="text-sm font-medium block mb-3">Client Rating: {clientRating}/5</label>
                  <input
                    type="range"
                    min="1" max="5" step="1"
                    value={clientRating}
                    onChange={(e) => setClientRating(Number(e.target.value))}
                    className="w-full h-2 rounded-full accent-blue-500"
                    style={{ background: 'var(--bg-elevated)' }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setCurrentStep('deliver')} className="btn-secondary flex-1">Back</button>
              <button onClick={nextStep} disabled={loading} className="btn-primary flex-1">
                {loading ? 'Processing...' : 'Complete Project'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {currentStep === 'complete' && certificateData && reputationImpact && ratingImpact && timeline.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-2" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
              {[
                { id: 'certificate' as const, label: 'Certificate' },
                { id: 'reputation' as const, label: 'Reputation Impact' },
                { id: 'timeline' as const, label: 'Timeline' },
                { id: 'blockchain' as const, label: 'Blockchain' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-5 py-2.5 text-xs font-medium rounded-lg transition-all"
                  style={{
                    background: activeTab === tab.id ? 'var(--accent-blue)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${activeTab === tab.id ? 'var(--accent-blue)' : 'var(--border-default)'}`,
                  }}
                >
                  {tab.label}
                </button>
              ))}

              {(outcome === 'disputed_favorable' || outcome === 'disputed_unfavorable') && (
                <button
                  onClick={() => setShowDisputeSimulator(true)}
                  className="ml-auto px-5 py-2.5 text-xs font-medium rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--accent-rose)' }}
                >
                  View Dispute Resolution
                </button>
              )}
            </div>

            {activeTab === 'certificate' && <CertificateGenerator data={certificateData as any} />}
            {activeTab === 'reputation' && <ReputationRatingVisualizer reputationImpact={reputationImpact} ratingImpact={ratingImpact} />}
            {activeTab === 'timeline' && <TimelineVisualizer events={timeline} durationDays={scenario.project.durationDays} />}
            {activeTab === 'blockchain' && (
              <BlockchainVerification
                certificateId={certificateData.certificateId as string}
                certificateHash={certificateData.hash as string}
                freelancerAddress={scenario.freelancer.address}
                clientAddress={scenario.client.address}
              />
            )}

            <div className="flex gap-4">
              <button onClick={resetSimulation} className="btn-secondary flex-1">Start New Simulation</button>
              <button onClick={() => (window.location.href = '/')} className="btn-primary flex-1">Return Home</button>
            </div>
          </div>
        )}
      </div>

      {showDisputeSimulator && certificateData && (
        <DisputeResolutionSimulator
          data={{
            projectId: certificateData.certificateId as string,
            clientName: scenario.client.name,
            freelancerName: scenario.freelancer.name,
            projectAmount: Number(scenario.project.amount),
            escrowAmount: escrowData?.escrowCost || 0,
            clientReputation: scenario.client.reputation,
            freelancerReputation: scenario.freelancer.reputation,
            outcome: outcome as 'disputed_favorable' | 'disputed_unfavorable' | 'completed' | 'refunded',
          }}
          onClose={() => setShowDisputeSimulator(false)}
        />
      )}

      <Footer />
    </div>
  );
}
