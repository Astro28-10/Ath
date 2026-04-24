'use client';

import React, { useState } from 'react';

interface DisputeData {
  projectId: string;
  clientName: string;
  freelancerName: string;
  projectAmount: number;
  escrowAmount: number;
  clientReputation: number;
  freelancerReputation: number;
  outcome: 'disputed_favorable' | 'disputed_unfavorable' | 'completed' | 'refunded';
}

interface DisputeResolutionSimulatorProps {
  data: DisputeData;
  onClose: () => void;
}

export const DisputeResolutionSimulator: React.FC<DisputeResolutionSimulatorProps> = ({ data, onClose }) => {
  const [disputeStep, setDisputeStep] = useState<'initiate' | 'evidence' | 'arbitration' | 'resolution'>('initiate');
  const [selectedSide, setSelectedSide] = useState<'client' | 'freelancer' | null>(null);
  const [showArbitrationLogic, setShowArbitrationLogic] = useState(false);

  // Calculate arbitration scores based on reputation and evidence
  const arbitrationScore = {
    client: Math.floor((data.clientReputation / 10000) * 100),
    freelancer: Math.floor((data.freelancerReputation / 10000) * 100),
  };

  // Determine resolution based on reputation scores
  const resolution = arbitrationScore.client > arbitrationScore.freelancer 
    ? 'favorable_to_client' 
    : arbitrationScore.freelancer > arbitrationScore.client 
    ? 'favorable_to_freelancer' 
    : 'split';

  const reputationImpact = {
    client: resolution === 'favorable_to_client' ? 150 : resolution === 'favorable_to_freelancer' ? -100 : 0,
    freelancer: resolution === 'favorable_to_freelancer' ? 150 : resolution === 'favorable_to_client' ? -100 : 0,
  };

  const fundAllocation = {
    client: resolution === 'favorable_to_client' 
      ? data.escrowAmount + (data.projectAmount * 0.9)
      : resolution === 'split'
      ? data.escrowAmount + (data.projectAmount * 0.45)
      : data.escrowAmount,
    freelancer: resolution === 'favorable_to_freelancer'
      ? data.projectAmount * 0.9
      : resolution === 'split'
      ? data.projectAmount * 0.45
      : 0,
    protocol: data.escrowAmount + (resolution === 'split' ? data.projectAmount * 0.1 : 0),
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-400/50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 border-b-2 border-blue-400/30 p-6 bg-slate-900/95 backdrop-blur flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-widest">DISPUTE RESOLUTION SIMULATOR</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Step Indicator */}
          <div className="flex gap-4 justify-between mb-8">
            {(['initiate', 'evidence', 'arbitration', 'resolution'] as const).map((step) => (
              <div key={step} className="flex-1">
                <button
                  onClick={() => setDisputeStep(step)}
                  className={`w-full py-2 px-4 text-xs tracking-widest font-bold rounded transition-all ${
                    disputeStep === step
                      ? 'bg-blue-500 text-white border-2 border-blue-400'
                      : 'border-2 border-blue-400/30 text-gray-400 hover:border-blue-400/50'
                  }`}
                >
                  {step.toUpperCase()}
                </button>
              </div>
            ))}
          </div>

          {/* INITIATE DISPUTE */}
          {disputeStep === 'initiate' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-300">INITIATE DISPUTE</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg">
                  <p className="text-xs tracking-widest font-bold text-blue-300 mb-4">PROJECT DETAILS</p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Project Amount:</span>
                      <span className="float-right font-bold">{data.projectAmount} ETH</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Escrow Cost:</span>
                      <span className="float-right font-bold">{data.escrowAmount} ETH</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Client Reputation:</span>
                      <span className="float-right font-bold">{(data.clientReputation / 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Freelancer Reputation:</span>
                      <span className="float-right font-bold">{(data.freelancerReputation / 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-300">Who is initiating the dispute?</p>
                  <button
                    onClick={() => setSelectedSide('client')}
                    className={`w-full border-2 p-4 rounded transition-all ${
                      selectedSide === 'client'
                        ? 'border-blue-400 bg-blue-400/20 text-white'
                        : 'border-blue-400/30 text-gray-300 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="font-bold">{data.clientName}</div>
                    <div className="text-xs text-gray-400">CLIENT</div>
                  </button>
                  <button
                    onClick={() => setSelectedSide('freelancer')}
                    className={`w-full border-2 p-4 rounded transition-all ${
                      selectedSide === 'freelancer'
                        ? 'border-purple-400 bg-purple-400/20 text-white'
                        : 'border-blue-400/30 text-gray-300 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="font-bold">{data.freelancerName}</div>
                    <div className="text-xs text-gray-400">FREELANCER</div>
                  </button>
                </div>
              </div>

              {selectedSide && (
                <button
                  onClick={() => setDisputeStep('evidence')}
                  className="w-full border-2 border-blue-400 bg-blue-500 hover:bg-blue-600 p-3 font-bold tracking-widest transition rounded"
                >
                  SUBMIT DISPUTE →
                </button>
              )}
            </div>
          )}

          {/* EVIDENCE */}
          {disputeStep === 'evidence' && selectedSide && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-300">SUBMIT EVIDENCE</h3>
              <div className="border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg space-y-4">
                <p className="text-sm text-gray-300">
                  <strong>{selectedSide === 'client' ? data.clientName : data.freelancerName}</strong> is submitting evidence...
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <span className="text-green-400">✓</span>
                    <span>Work delivery screenshots submitted</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <span className="text-green-400">✓</span>
                    <span>Communication logs provided</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <span className="text-green-400">✓</span>
                    <span>Quality assurance documentation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <span className="text-green-400">✓</span>
                    <span>On-chain transaction records</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 border-t border-blue-400/20 pt-4 mt-4">
                  All evidence is verified on-chain and cannot be modified. Smart contract judges the dispute based on:
                </p>
                <ul className="text-xs text-gray-400 space-y-2 ml-4 list-disc">
                  <li>Reputation scores of both parties</li>
                  <li>Historical dispute resolution records</li>
                  <li>Project completion metrics</li>
                  <li>On-chain evidence verification</li>
                </ul>
              </div>

              <button
                onClick={() => setDisputeStep('arbitration')}
                className="w-full border-2 border-blue-400 bg-blue-500 hover:bg-blue-600 p-3 font-bold tracking-widest transition rounded"
              >
                INITIATE ARBITRATION →
              </button>
            </div>
          )}

          {/* ARBITRATION LOGIC */}
          {disputeStep === 'arbitration' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-300">SMART CONTRACT ARBITRATION</h3>

              <button
                onClick={() => setShowArbitrationLogic(!showArbitrationLogic)}
                className="w-full border-2 border-purple-400/50 p-4 text-left hover:bg-purple-400/10 transition rounded"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold tracking-widest">VIEW ARBITRATION LOGIC</span>
                  <span>{showArbitrationLogic ? '▼' : '▶'}</span>
                </div>
              </button>

              {showArbitrationLogic && (
                <div className="border-2 border-purple-400/20 p-6 bg-purple-400/5 rounded-lg space-y-4 text-xs font-mono text-gray-300">
                  <div className="bg-slate-900 p-3 rounded overflow-x-auto">
                    <pre>{`// SkillBond Arbitration Algorithm
// Version 1.0

function arbitrateDispute(
  clientReputation: uint256,
  freelancerReputation: uint256,
  evidence: bytes32[]
): (uint256 clientReward, uint256 freelancerReward) {
  
  // Calculate arbitration scores
  uint256 clientScore = (clientReputation * 100) / 10000;
  uint256 freelancerScore = (freelancerReputation * 100) / 10000;
  
  // Apply evidence weighting
  uint256 totalWeight = clientScore + freelancerScore;
  
  if (clientScore > freelancerScore) {
    // Favorable to client
    return (escrow + (project * 90%), 0);
  } else if (freelancerScore > clientScore) {
    // Favorable to freelancer
    return (escrow, project * 90%);
  } else {
    // Split decision
    return (escrow + (project * 45%), project * 45%);
  }
}`}</pre>
                  </div>
                  <p className="text-gray-400">This algorithm is transparent, on-chain, and deterministic.</p>
                </div>
              )}

              {/* Arbitration Scores */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg">
                  <p className="text-xs tracking-widest font-bold text-blue-300 mb-4">CLIENT SCORE</p>
                  <div className="text-4xl font-bold text-blue-300 mb-4">{arbitrationScore.client}%</div>
                  <div className="space-y-2 text-xs text-gray-400">
                    <p>Based on: {data.clientName}'s reputation</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${arbitrationScore.client}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-purple-400/20 p-6 bg-purple-400/5 rounded-lg">
                  <p className="text-xs tracking-widest font-bold text-purple-300 mb-4">FREELANCER SCORE</p>
                  <div className="text-4xl font-bold text-purple-300 mb-4">{arbitrationScore.freelancer}%</div>
                  <div className="space-y-2 text-xs text-gray-400">
                    <p>Based on: {data.freelancerName}'s reputation</p>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${arbitrationScore.freelancer}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDisputeStep('resolution')}
                className="w-full border-2 border-blue-400 bg-blue-500 hover:bg-blue-600 p-3 font-bold tracking-widest transition rounded"
              >
                VIEW RESOLUTION →
              </button>
            </div>
          )}

          {/* RESOLUTION */}
          {disputeStep === 'resolution' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-300">FINAL RESOLUTION</h3>

              {/* Resolution Type */}
              <div className={`border-2 p-6 rounded-lg ${
                resolution === 'favorable_to_client'
                  ? 'border-blue-400/50 bg-blue-400/10'
                  : resolution === 'favorable_to_freelancer'
                  ? 'border-purple-400/50 bg-purple-400/10'
                  : 'border-yellow-400/50 bg-yellow-400/10'
              }`}>
                <p className="text-xs tracking-widest font-bold mb-4">ARBITRATION VERDICT</p>
                <p className="text-2xl font-bold">
                  {resolution === 'favorable_to_client'
                    ? `✓ FAVORABLE TO ${data.clientName}`
                    : resolution === 'favorable_to_freelancer'
                    ? `✓ FAVORABLE TO ${data.freelancerName}`
                    : '⚖ SPLIT DECISION'}
                </p>
              </div>

              {/* Fund Allocation */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border-2 border-blue-400/20 p-4 rounded-lg bg-blue-400/5">
                  <p className="text-xs tracking-widest font-bold text-blue-300 mb-3">{data.clientName}</p>
                  <p className="text-2xl font-bold text-blue-300">{fundAllocation.client.toFixed(3)} ETH</p>
                  <p className="text-xs text-gray-400 mt-2">Receives from escrow</p>
                </div>
                <div className="border-2 border-purple-400/20 p-4 rounded-lg bg-purple-400/5">
                  <p className="text-xs tracking-widest font-bold text-purple-300 mb-3">{data.freelancerName}</p>
                  <p className="text-2xl font-bold text-purple-300">{fundAllocation.freelancer.toFixed(3)} ETH</p>
                  <p className="text-xs text-gray-400 mt-2">Receives from project</p>
                </div>
                <div className="border-2 border-yellow-400/20 p-4 rounded-lg bg-yellow-400/5">
                  <p className="text-xs tracking-widest font-bold text-yellow-300 mb-3">PROTOCOL FEE</p>
                  <p className="text-2xl font-bold text-yellow-300">{fundAllocation.protocol.toFixed(3)} ETH</p>
                  <p className="text-xs text-gray-400 mt-2">Arbitration service</p>
                </div>
              </div>

              {/* Reputation Impact */}
              <div className="border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg space-y-4">
                <p className="text-xs tracking-widest font-bold text-blue-300">REPUTATION IMPACT</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-bold text-sm">{data.clientName}</p>
                    <p className={`text-lg font-bold ${reputationImpact.client >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {reputationImpact.client >= 0 ? '+' : ''}{reputationImpact.client} PTS
                    </p>
                    <p className="text-xs text-gray-400">
                      {reputationImpact.client >= 0 
                        ? 'Reputation increased for fair conduct' 
                        : 'Reputation decreased due to dispute loss'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-sm">{data.freelancerName}</p>
                    <p className={`text-lg font-bold ${reputationImpact.freelancer >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {reputationImpact.freelancer >= 0 ? '+' : ''}{reputationImpact.freelancer} PTS
                    </p>
                    <p className="text-xs text-gray-400">
                      {reputationImpact.freelancer >= 0 
                        ? 'Reputation increased for fair conduct' 
                        : 'Reputation decreased due to dispute loss'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="border-2 border-purple-400/20 p-6 bg-purple-400/5 rounded-lg space-y-3">
                <p className="text-xs tracking-widest font-bold text-purple-300">KEY INSIGHTS</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Arbitration completed in <strong>24 hours</strong></li>
                  <li>✓ All decisions <strong>on-chain verifiable</strong></li>
                  <li>✓ Protocol fee only <strong>0.5%</strong> of project value</li>
                  <li>✓ Both parties can <strong>appeal</strong> within 7 days</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full border-2 border-blue-400 bg-blue-500 hover:bg-blue-600 p-3 font-bold tracking-widest transition rounded"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
