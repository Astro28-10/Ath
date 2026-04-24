'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface ReputationImpact {
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

interface RatingImpact {
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

interface ReputationRatingVisualizerProps {
  reputationImpact: ReputationImpact;
  ratingImpact: RatingImpact;
}

export const ReputationRatingVisualizer: React.FC<ReputationRatingVisualizerProps> = ({
  reputationImpact,
  ratingImpact,
}) => {
  // Prepare data for reputation comparison chart
  const reputationData = [
    {
      party: 'Client',
      before: reputationImpact.before.clientReputation / 100,
      after: reputationImpact.after.clientReputation / 100,
      change: reputationImpact.changes.clientRepChange / 100,
    },
    {
      party: 'Freelancer',
      before: reputationImpact.before.freelancerReputation / 100,
      after: reputationImpact.after.freelancerReputation / 100,
      change: reputationImpact.changes.freelancerRepChange / 100,
    },
  ];

  const getOutcomeColor = (outcome: string): string => {
    switch (outcome) {
      case 'completed':
        return 'bg-green-100 border-green-400';
      case 'disputed_favorable':
        return 'bg-blue-100 border-blue-400';
      case 'disputed_unfavorable':
        return 'bg-red-100 border-red-400';
      case 'refunded':
        return 'bg-yellow-100 border-yellow-400';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  const getOutcomeIcon = (outcome: string): string => {
    switch (outcome) {
      case 'completed':
        return '✅';
      case 'disputed_favorable':
        return '⚖️';
      case 'disputed_unfavorable':
        return '❌';
      case 'refunded':
        return '💸';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-8">
      {/* Outcome Summary */}
      <div className={`border-4 border-black p-6 ${getOutcomeColor(reputationImpact.outcome)}`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{getOutcomeIcon(reputationImpact.outcome)}</span>
          <div>
            <h3 className="text-2xl font-black tracking-widest uppercase">
              {reputationImpact.outcome.replace(/_/g, ' ')}
            </h3>
            <p className="text-sm text-gray-700 mt-1">{reputationImpact.reason}</p>
          </div>
        </div>
      </div>

      {/* Reputation Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Reputation */}
        <div className="border-2 border-black p-6 bg-white">
          <h3 className="text-lg font-bold mb-6 tracking-widest">CLIENT REPUTATION</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
              <span className="text-sm font-bold text-gray-600">BEFORE</span>
              <span className="text-2xl font-black text-blue-600">
                {(reputationImpact.before.clientReputation / 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-gray-600">CHANGE</span>
              <div
                className={`text-2xl font-black ${
                  reputationImpact.changes.clientRepChange > 0
                    ? 'text-green-600'
                    : reputationImpact.changes.clientRepChange < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {reputationImpact.changes.clientRepChange > 0 ? '+' : ''}
                {(reputationImpact.changes.clientRepChange / 100).toFixed(1)}
                {' ('}
                {reputationImpact.percentageChange.clientChangePercent}%)
              </div>
            </div>

            <div className="flex justify-between items-center border-t-2 border-gray-300 pt-4">
              <span className="text-sm font-bold text-gray-600">AFTER</span>
              <span className="text-2xl font-black text-purple-600">
                {(reputationImpact.after.clientReputation / 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Freelancer Reputation */}
        <div className="border-2 border-black p-6 bg-white">
          <h3 className="text-lg font-bold mb-6 tracking-widest">FREELANCER REPUTATION</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
              <span className="text-sm font-bold text-gray-600">BEFORE</span>
              <span className="text-2xl font-black text-blue-600">
                {(reputationImpact.before.freelancerReputation / 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-gray-600">CHANGE</span>
              <div
                className={`text-2xl font-black ${
                  reputationImpact.changes.freelancerRepChange > 0
                    ? 'text-green-600'
                    : reputationImpact.changes.freelancerRepChange < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {reputationImpact.changes.freelancerRepChange > 0 ? '+' : ''}
                {(reputationImpact.changes.freelancerRepChange / 100).toFixed(1)}
                {' ('}
                {reputationImpact.percentageChange.freelancerChangePercent}%)
              </div>
            </div>

            <div className="flex justify-between items-center border-t-2 border-gray-300 pt-4">
              <span className="text-sm font-bold text-gray-600">AFTER</span>
              <span className="text-2xl font-black text-green-600">
                {(reputationImpact.after.freelancerReputation / 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reputation Comparison Chart */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">REPUTATION BEFORE & AFTER</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reputationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="party" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: 'Reputation %', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '2px solid #000',
                borderRadius: 0,
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Bar dataKey="before" fill="#94a3b8" name="Before" />
            <Bar dataKey="after" fill="#2563eb" name="After" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rating Impact */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">FREELANCER RATING IMPACT</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">BEFORE</p>
            <p className="text-4xl font-black text-yellow-600">{ratingImpact.before.avgRating}</p>
            <p className="text-xs mt-2 text-gray-500">{ratingImpact.before.totalProjects} projects</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">CHANGE</p>
            <p className="text-4xl font-black text-purple-600">
              {ratingImpact.change.difference[0] === '-' ? '' : '+'}
              {ratingImpact.change.difference}
            </p>
            <p className="text-xs mt-2 text-gray-500">{ratingImpact.impact}</p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">AFTER</p>
            <p className="text-4xl font-black text-green-600">{ratingImpact.after.avgRating}</p>
            <p className="text-xs mt-2 text-gray-500">{ratingImpact.after.totalProjects} projects</p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="border-2 border-black p-6 bg-purple-50">
        <h3 className="text-lg font-bold mb-4 tracking-widest">KEY INSIGHTS</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="font-bold text-purple-600 flex-shrink-0">→</span>
            <span>
              Both parties' reputation scores directly impact escrow costs. Higher reputation = lower costs.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-purple-600 flex-shrink-0">→</span>
            <span>
              Project outcomes significantly affect reputation. Successful completion boosts both parties.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-purple-600 flex-shrink-0">→</span>
            <span>
              Disputes have asymmetric impacts. Freelancers face greater reputation loss if unfavorable.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-purple-600 flex-shrink-0">→</span>
            <span>Individual project ratings compound into average rating over many projects.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
