'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface GraphProps {
  address: string;
  reputationScore: number;
  credentialCount: number;
}

export const ReputationGraph: React.FC<GraphProps> = ({
  address,
  reputationScore,
  credentialCount,
}) => {
  // Generate demo historical data
  const generateHistoricalData = () => {
    const data = [];
    const now = Date.now();
    const monthInMs = 30 * 24 * 60 * 60 * 1000;

    for (let i = 11; i >= 0; i--) {
      const timestamp = now - i * monthInMs;
      const date = new Date(timestamp);
      const month = date.toLocaleDateString('en-US', { month: 'short' });

      // Simulate reputation growth
      const baseScore = reputationScore * 0.3 + Math.random() * 2000;
      const growth = (reputationScore - baseScore) * (11 - i) / 11;
      const score = Math.min(baseScore + growth, reputationScore);

      data.push({
        month,
        reputation: Math.round(score),
        credentials: Math.floor(credentialCount * (i + 1) / 12),
      });
    }
    return data;
  };

  const data = generateHistoricalData();

  // Calculate stats
  const currentScore = reputationScore / 100;
  const scorePercent = (reputationScore / 10000 * 100).toFixed(1);
  const trend = '+12%';

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-black p-6" style={{background: 'linear-gradient(135deg, rgb(240, 249, 255) 0%, rgb(255, 255, 255) 100%)'}}>
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">REPUTATION SCORE</p>
          <p className="text-4xl font-black text-blue-600">{scorePercent}%</p>
          <p className="text-xs mt-2 text-green-600 font-bold">{trend} this month</p>
        </div>

        <div className="border-2 border-black p-6" style={{background: 'linear-gradient(135deg, rgb(250, 245, 255) 0%, rgb(255, 255, 255) 100%)'}}>
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">CREDENTIALS</p>
          <p className="text-4xl font-black text-purple-600">{credentialCount}</p>
          <p className="text-xs mt-2 text-gray-600">verified on chain</p>
        </div>

        <div className="border-2 border-black p-6" style={{background: 'linear-gradient(135deg, rgb(240, 253, 250) 0%, rgb(255, 255, 255) 100%)'}}>
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">STATUS</p>
          <p className="text-3xl font-black text-green-600">✓ VERIFIED</p>
          <p className="text-xs mt-2 text-gray-600">on Polygon</p>
        </div>
      </div>

      {/* Reputation Trend Chart */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">REPUTATION GROWTH (12 MONTHS)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorReputation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '2px solid #000',
                borderRadius: 0,
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="reputation"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorReputation)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Credentials Earned Chart */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">CREDENTIALS EARNED</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '2px solid #000',
                borderRadius: 0,
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="credentials" fill="#a855f7" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
