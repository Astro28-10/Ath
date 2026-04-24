'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
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
  breakdown: Record<string, unknown>;
  percentages: Record<string, string>;
}

interface ReputationImpactData {
  outcome: string;
  reason: string;
  changes: Record<string, number>;
  before: Record<string, number>;
  after: Record<string, number>;
  percentageChange: Record<string, string>;
}

interface RatingImpactData {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  change: Record<string, string>;
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
  const [outcome, setOutcome] = useState<'completed' | 'disputed_favorable' | 'disputed_unfavorable' | 'refunded'>(
    'completed'
  );
  const [clientRating, setClientRating] = useState(5);
  const [activeTab, setActiveTab] = useState<'certificate' | 'reputation' | 'timeline' | 'blockchain'>('certificate');
  const [showDisputeSimulator, setShowDisputeSimulator] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulation results
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const [reputationImpact, setReputationImpact] = useState<ReputationImpactData | null>(null);
  const [ratingImpact, setRatingImpact] = useState<RatingImpactData | null>(null);
  const [timeline, setTimeline] = useState<Array<Record<string, unknown>>>([]);
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

    if (currentStep === 'select') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      setCurrentStep('create');
    } else if (currentStep === 'create') {
      // Run escrow calculation
      await calculateEscrow();
    } else if (currentStep === 'fund') {
      setCurrentStep('deliver');
    } else if (currentStep === 'deliver') {
      setCurrentStep('approve');
    } else if (currentStep === 'approve') {
      // Run full simulation
      await runFullSimulation();
    }
  };

  const calculateEscrow = async () => {
    setLoading(true);
    try {
      const amount = Math.floor(Number(scenario.project.amount) * 1e18);
      const response = await axios.post(`${API_BASE}/simulate/calculate-escrow`, {
        baseAmount: amount,
        clientReputation: scenario.client.reputation,
        freelancerReputation: scenario.freelancer.reputation,
      });
      setEscrowData(response.data.data);
      setCurrentStep('fund');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error || err.message : String(err);
      setError(message);
      console.error('Escrow calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const runFullSimulation = async () => {
    setLoading(true);
    try {
      const amount = Math.floor(Number(scenario.project.amount) * 1e18);

      // Reputation impact
      const repResponse = await axios.post(`${API_BASE}/simulate/reputation-impact`, {
        clientReputation: scenario.client.reputation,
        freelancerReputation: scenario.freelancer.reputation,
        projectAmount: amount,
        outcome,
      });
      setReputationImpact(repResponse.data.data);

      // Rating impact
      const ratingResponse = await axios.post(`${API_BASE}/simulate/rating-impact`, {
        currentAvgRating: scenario.freelancer.rating,
        projectRating: clientRating,
        totalProjects: scenario.freelancer.projects,
      });
      setRatingImpact(ratingResponse.data.data);

      // Timeline
      const timelineResponse = await axios.post(`${API_BASE}/simulate/timeline`, {
        durationDays: scenario.project.durationDays,
      });
      setTimeline(timelineResponse.data.data);

      // Generate certificate
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
        reputationAfter: repResponse.data.data.after.freelancerReputation,
        hash: certHash,
      });

      setCurrentStep('complete');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error || err.message : String(err);
      setError(message);
      console.error('Simulation error:', err);
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

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black hover:bg-white hover:text-black transition cursor-pointer">
                  <span className="text-white hover:text-black text-lg font-bold">SB</span>
                </div>
              </Link>
              <h1 className="text-3xl font-bold">SKILLBOND</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <button className="border-2 border-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition">
                  HOME
                </button>
              </Link>
              <Link href="/simulate">
                <button className="border-4 border-black px-4 py-2 text-xs font-bold tracking-widest bg-black text-white">
                  SIMULATOR
                </button>
              </Link>
            </div>
          </div>
          <p className="text-xs tracking-widest">WORKFLOW SIMULATOR FOR JUDGES</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Workflow Progress */}
        <div className="mb-12">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {STEP_ORDER.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <button
                  onClick={() => goToStep(step)}
                  disabled={STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf(currentStep)}
                  className={`flex-shrink-0 w-12 h-12 border-2 border-black font-bold text-sm flex items-center justify-center transition ${
                    step === currentStep
                      ? 'bg-black text-white border-4'
                      : STEP_ORDER.indexOf(step) < STEP_ORDER.indexOf(currentStep)
                        ? 'bg-green-100 border-black cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {STEP_ORDER.indexOf(step) < STEP_ORDER.indexOf(currentStep) ? 'OK' : WORKFLOW_STEPS[step as Step].number}
                </button>
                {idx < STEP_ORDER.length - 1 && (
                  <div
                    className={`w-8 h-1 ${
                      STEP_ORDER.indexOf(step) < STEP_ORDER.indexOf(currentStep)
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-sm font-bold tracking-widest">{WORKFLOW_STEPS[currentStep as Step].label}</p>
            <p className="text-xs text-gray-600">Step {WORKFLOW_STEPS[currentStep as Step].number} of 7</p>
          </div>
        </div>

        {error && (
          <div className="border-2 border-red-500 p-4 bg-red-50 mb-8">
            <p className="text-sm font-bold text-red-700">ERROR: {error}</p>
          </div>
        )}

        {/* Step: Select Scenario */}
        {currentStep === 'select' && (
          <div className="space-y-8">
            <div className="border-4 border-black p-8 bg-blue-50">
              <h2 className="text-2xl font-bold mb-2 tracking-widest">SELECT A SCENARIO</h2>
              <p className="text-sm text-gray-600 mb-6">
                Choose a pre-configured project scenario to simulate. Each demonstrates different reputation levels and project types.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(DEMO_SCENARIOS).map(([id, scen]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedScenario(id as keyof typeof DEMO_SCENARIOS)}
                    className={`border-2 border-black p-6 text-left transition ${
                      selectedScenario === id
                        ? 'bg-black text-white border-4'
                        : 'bg-white hover:bg-gray-50 border-black'
                    }`}
                  >
                    <p className="font-bold tracking-widest mb-2">{scen.name}</p>
                    <p className={`text-xs ${selectedScenario === id ? 'text-gray-200' : 'text-gray-600'} mb-3 line-clamp-2`}>
                      {scen.description}
                    </p>
                    <div className={`text-xs space-y-1 ${selectedScenario === id ? 'text-gray-100' : 'text-gray-700'}`}>
                      <p>
                        <strong>Budget:</strong> {scen.project.amount} ETH
                      </p>
                      <p>
                        <strong>Duration:</strong> {scen.project.durationDays} days
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full border-4 border-black px-8 py-4 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition"
            >
              CONTINUE TO REVIEW
            </button>
          </div>
        )}

        {/* Step: Review Project */}
        {currentStep === 'review' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client */}
              <div className="border-4 border-black p-6">
                <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">CLIENT</p>
                <h3 className="text-2xl font-bold mb-4">{scenario.client.name}</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-bold text-gray-600">Reputation</p>
                    <p className={`text-lg font-black ${getReputationColor(scenario.client.reputation)}`}>
                      {(scenario.client.reputation / 100).toFixed(1)}% ({getReputationLabel(scenario.client.reputation)})
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Average Rating</p>
                    <p className="text-lg font-black">{scenario.client.rating}/5.0</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Projects Completed</p>
                    <p className="text-lg font-black">{scenario.client.projects}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Address</p>
                    <p className="font-mono text-xs">{formatAddress(scenario.client.address)}</p>
                  </div>
                </div>
              </div>

              {/* Freelancer */}
              <div className="border-4 border-black p-6">
                <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">FREELANCER</p>
                <h3 className="text-2xl font-bold mb-4">{scenario.freelancer.name}</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-bold text-gray-600">Reputation</p>
                    <p className={`text-lg font-black ${getReputationColor(scenario.freelancer.reputation)}`}>
                      {(scenario.freelancer.reputation / 100).toFixed(1)}% ({getReputationLabel(scenario.freelancer.reputation)})
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Average Rating</p>
                    <p className="text-lg font-black">{scenario.freelancer.rating}/5.0</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Projects Completed</p>
                    <p className="text-lg font-black">{scenario.freelancer.projects}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Address</p>
                    <p className="font-mono text-xs">{formatAddress(scenario.freelancer.address)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="border-4 border-black p-6">
              <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">PROJECT</p>
              <h3 className="text-2xl font-bold mb-4">{scenario.project.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-bold text-gray-600 mb-1">Description</p>
                  <p>{scenario.project.description}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-gray-600">Budget</p>
                    <p className="text-xl font-black">{scenario.project.amount} ETH</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Duration</p>
                    <p className="text-xl font-black">{scenario.project.durationDays} Days</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="font-bold text-gray-600 mb-2">Skills Required</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.project.skills.map(skill => (
                      <span key={skill} className="border border-black px-3 py-1 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('select')}
                className="flex-1 border-2 border-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
              >
                BACK
              </button>
              <button
                onClick={nextStep}
                className="flex-1 border-4 border-black px-8 py-3 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Step: Create Work Order */}
        {currentStep === 'create' && (
          <div className="space-y-8">
            <div className="border-4 border-black p-8 bg-green-50">
              <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">STEP 3</p>
              <h2 className="text-2xl font-bold mb-4 tracking-widest">CREATE WORK ORDER</h2>

              <div className="space-y-4 text-sm">
                <p className="text-gray-700">
                  A work order is created between {scenario.client.name} and {scenario.freelancer.name}. At this stage, no funds are locked yet. Both parties need to agree on terms before the client funds the project.
                </p>

                <div className="border-2 border-black p-4 bg-white space-y-3">
                  <p>
                    <strong>Client:</strong> {scenario.client.name}
                  </p>
                  <p>
                    <strong>Freelancer:</strong> {scenario.freelancer.name}
                  </p>
                  <p>
                    <strong>Project:</strong> {scenario.project.title}
                  </p>
                  <p>
                    <strong>Amount:</strong> {scenario.project.amount} ETH
                  </p>
                  <p>
                    <strong>Duration:</strong> {scenario.project.durationDays} days
                  </p>
                  <p>
                    <strong>Status:</strong> PENDING CLIENT APPROVAL
                  </p>
                </div>

                <p className="bg-yellow-50 border border-yellow-300 p-3 text-xs">
                  Next: Client will fund the project, which locks funds in escrow. The escrow amount depends on both parties' reputation scores.
                </p>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={loading}
              className="w-full border-4 border-black px-8 py-4 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition disabled:opacity-50"
            >
              {loading ? 'CALCULATING ESCROW...' : 'PROCEED TO FUNDING'}
            </button>
          </div>
        )}

        {/* Step: Fund Project */}
        {currentStep === 'fund' && escrowData && (
          <div className="space-y-8">
            <div className="border-4 border-black p-8 bg-yellow-50">
              <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">STEP 4</p>
              <h2 className="text-2xl font-bold mb-4 tracking-widest">FUND PROJECT (LOCK ESCROW)</h2>
              <p className="text-sm text-gray-700">
                Client {scenario.client.name} is now funding the project. The escrow calculation below shows how both parties' reputation scores affect the escrow cost.
              </p>
            </div>

            <EscrowVisualizer calculation={escrowData} />

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('create')}
                className="flex-1 border-2 border-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
              >
                BACK
              </button>
              <button
                onClick={nextStep}
                className="flex-1 border-4 border-black px-8 py-3 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition"
              >
                FUNDS LOCKED - FREELANCER STARTS WORK
              </button>
            </div>
          </div>
        )}

        {/* Step: Deliver Work */}
        {currentStep === 'deliver' && (
          <div className="space-y-8">
            <div className="border-4 border-black p-8 bg-purple-50">
              <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">STEP 5</p>
              <h2 className="text-2xl font-bold mb-4 tracking-widest">DELIVER WORK</h2>

              <div className="space-y-4 text-sm">
                <p className="text-gray-700">
                  {scenario.freelancer.name} has completed the project "{scenario.project.title}" after {scenario.project.durationDays} days of work. The deliverables are now submitted for client review.
                </p>

                <div className="border-2 border-black p-4 bg-white space-y-2">
                  <p>
                    <strong>Deliverables:</strong> Project files, documentation, deployment guide
                  </p>
                  <p>
                    <strong>IPFS Hash:</strong>
                    <code className="block font-mono text-xs mt-1">QmXxX...xXxX</code>
                  </p>
                  <p>
                    <strong>Submission Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> AWAITING CLIENT REVIEW
                  </p>
                </div>

                <p className="bg-blue-50 border border-blue-300 p-3 text-xs">
                  Client has 2 days to review and either approve, request changes, or initiate a dispute.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('fund')}
                className="flex-1 border-2 border-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
              >
                BACK
              </button>
              <button
                onClick={nextStep}
                className="flex-1 border-4 border-black px-8 py-3 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition"
              >
                PROCEED TO APPROVAL
              </button>
            </div>
          </div>
        )}

        {/* Step: Approve & Complete */}
        {currentStep === 'approve' && (
          <div className="space-y-8">
            <div className="border-4 border-black p-8 bg-orange-50">
              <p className="text-xs tracking-widest font-bold text-gray-600 mb-3">STEP 6</p>
              <h2 className="text-2xl font-bold mb-4 tracking-widest">APPROVE & COMPLETE</h2>

              <div className="space-y-4 text-sm mb-6">
                <p className="text-gray-700">
                  {scenario.client.name} reviews the deliverables and decides the outcome:
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 border-2 border-black p-4 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="outcome"
                      value="completed"
                      checked={outcome === 'completed'}
                      onChange={e => setOutcome(e.target.value as typeof outcome)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-bold">Approve - Work is satisfactory</p>
                      <p className="text-xs text-gray-600">Funds released to freelancer, credential minted</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 border-2 border-black p-4 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="outcome"
                      value="disputed_favorable"
                      checked={outcome === 'disputed_favorable'}
                      onChange={e => setOutcome(e.target.value as typeof outcome)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-bold">Dispute - Resolved in Freelancer's favor</p>
                      <p className="text-xs text-gray-600">Client had issues but arbitration sided with freelancer</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 border-2 border-black p-4 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="outcome"
                      value="disputed_unfavorable"
                      checked={outcome === 'disputed_unfavorable'}
                      onChange={e => setOutcome(e.target.value as typeof outcome)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-bold">Dispute - Client Wins</p>
                      <p className="text-xs text-gray-600">Work did not meet standards, client refunded, freelancer reputation impacted</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 border-2 border-black p-4 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="outcome"
                      value="refunded"
                      checked={outcome === 'refunded'}
                      onChange={e => setOutcome(e.target.value as typeof outcome)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-bold">Refund - No Work Delivered</p>
                      <p className="text-xs text-gray-600">Project cancelled before completion, full refund</p>
                    </div>
                  </label>
                </div>

                {outcome === 'completed' && (
                  <div>
                    <label className="text-sm font-bold text-gray-600 block mb-2">
                      Client Rating for Freelancer: {clientRating}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={clientRating}
                      onChange={e => setClientRating(Number(e.target.value))}
                      className="w-full h-2 bg-gray-300 border-2 border-black rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('deliver')}
                className="flex-1 border-2 border-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
              >
                BACK
              </button>
              <button
                onClick={nextStep}
                disabled={loading}
                className="flex-1 border-4 border-black px-8 py-3 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition disabled:opacity-50"
              >
                {loading ? 'PROCESSING COMPLETION...' : 'COMPLETE PROJECT'}
              </button>
            </div>
          </div>
        )}

        {/* Step: View Certificate & Results */}
        {currentStep === 'complete' && certificateData && reputationImpact && ratingImpact && timeline.length > 0 && (
          <div className="space-y-8">
            {/* Tabs for different sections */}
            <div className="flex gap-2 border-b-4 border-black flex-wrap items-center">
              {[
                { id: 'certificate' as const, label: 'CERTIFICATE' },
                { id: 'reputation' as const, label: 'REPUTATION IMPACT' },
                { id: 'timeline' as const, label: 'TIMELINE' },
                { id: 'blockchain' as const, label: 'BLOCKCHAIN VERIFICATION' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-xs font-bold tracking-widest border-b-4 transition ${
                    activeTab === tab.id
                      ? 'border-black bg-green-100'
                      : 'border-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Dispute Simulator Button */}
              {(outcome === 'disputed_favorable' || outcome === 'disputed_unfavorable') && (
                <button
                  onClick={() => setShowDisputeSimulator(true)}
                  className="ml-auto px-6 py-3 text-xs font-bold tracking-widest border-2 border-red-600 bg-red-100 hover:bg-red-200 transition text-red-700"
                >
                  VIEW DISPUTE RESOLUTION
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'certificate' && <CertificateGenerator data={certificateData as Record<string, any>} />}
            {activeTab === 'reputation' && (
              <ReputationRatingVisualizer reputationImpact={reputationImpact} ratingImpact={ratingImpact} />
            )}
            {activeTab === 'timeline' && (
              <TimelineVisualizer events={timeline} durationDays={scenario.project.durationDays} />
            )}
            {activeTab === 'blockchain' && (
              <BlockchainVerification
                certificateId={certificateData.certificateId as string}
                certificateHash={certificateData.hash as string}
                freelancerAddress={scenario.freelancer.address}
                clientAddress={scenario.client.address}
              />
            )}

            <div className="flex gap-4">
              <button
                onClick={resetSimulation}
                className="flex-1 border-2 border-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
              >
                START NEW SIMULATION
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 border-4 border-black px-8 py-3 text-sm font-bold tracking-widest bg-black text-white hover:bg-white hover:text-black transition"
              >
                RETURN HOME
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dispute Resolution Simulator Modal */}
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
    </div>
  );
}
