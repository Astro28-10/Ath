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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EscrowCalculation {
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

interface EscrowVisualizerProps {
  calculation: EscrowCalculation;
}

export const EscrowVisualizer: React.FC<EscrowVisualizerProps> = ({ calculation }) => {
  const baseEth = (calculation.baseAmount / 1e18).toFixed(4);
  const escrowEth = (calculation.escrowCost / 1e18).toFixed(4);
  const finalEth = (calculation.finalAmount / 1e18).toFixed(4);

  // Data for pie chart
  const pieData = [
    { name: 'Freelancer Earnings', value: calculation.finalAmount },
    { name: 'Escrow Cost', value: calculation.escrowCost },
  ];

  const COLORS = ['#2563eb', '#f59e0b'];

  // Data for bar chart
  const barData = [
    {
      name: 'Comparison',
      base: calculation.baseAmount / 1e18,
      escrow: calculation.escrowCost / 1e18,
      final: calculation.finalAmount / 1e18,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border-2 border-black p-4 bg-gray-50">
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">PROJECT COST</p>
          <p className="text-3xl font-black text-blue-600">{baseEth} ETH</p>
          <p className="text-xs mt-2 text-gray-500">Base amount</p>
        </div>

        <div className="border-2 border-black p-4 bg-yellow-50">
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">ESCROW COST</p>
          <p className="text-3xl font-black text-yellow-600">{escrowEth} ETH</p>
          <p className="text-xs mt-2 text-yellow-700">
            {calculation.percentages.escrowCostPercent}%
          </p>
        </div>

        <div className="border-2 border-black p-4 bg-green-50">
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">FREELANCER GETS</p>
          <p className="text-3xl font-black text-green-600">{finalEth} ETH</p>
          <p className="text-xs mt-2 text-green-700">
            +{calculation.percentages.discountApplied}% discount
          </p>
        </div>

        <div className="border-2 border-black p-4 bg-purple-50">
          <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">SAVINGS</p>
          <p className="text-3xl font-black text-purple-600">
            {((calculation.baseAmount - calculation.finalAmount - calculation.escrowCost) / 1e18).toFixed(4)} ETH
          </p>
          <p className="text-xs mt-2 text-purple-700">Due to reputation</p>
        </div>
      </div>

      {/* Reputation Contribution */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">DISCOUNT BREAKDOWN</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-sm font-bold text-gray-600 mb-2">CLIENT REPUTATION IMPACT</p>
            <p className="text-2xl font-black text-blue-600">
              {calculation.percentages.clientRepPercent}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Contributes {(calculation.breakdown.clientDiscount / 100).toFixed(0)}% to discount
            </p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <p className="text-sm font-bold text-gray-600 mb-2">FREELANCER REPUTATION IMPACT</p>
            <p className="text-2xl font-black text-purple-600">
              {calculation.percentages.freelancerRepPercent}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Contributes {(calculation.breakdown.freelancerDiscount / 100).toFixed(0)}% to discount
            </p>
          </div>
        </div>
      </div>

      {/* Visualization - Pie Chart */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">FUNDS DISTRIBUTION</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${(value / 1e18).toFixed(3)} Ξ`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${(value / 1e18).toFixed(4)} ETH`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '2px solid #000',
                borderRadius: 0,
              }}
              labelStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Formula Explanation */}
      <div className="border-2 border-black p-6 bg-blue-50">
        <h3 className="text-lg font-bold mb-4 tracking-widest">HOW IT WORKS</h3>
        <div className="space-y-4 font-mono text-sm">
          <div>
            <p className="font-bold text-blue-900">Base Amount:</p>
            <p className="text-gray-700">{baseEth} ETH (project cost)</p>
          </div>
          <div>
            <p className="font-bold text-blue-900">Reputation Discount:</p>
            <p className="text-gray-700">
              {calculation.percentages.discountApplied}% (based on both parties' reputation)
            </p>
          </div>
          <div>
            <p className="font-bold text-blue-900">Escrow Cost:</p>
            <p className="text-gray-700">
              {baseEth} ETH × {calculation.percentages.discountApplied}% = {escrowEth} ETH
            </p>
          </div>
          <div>
            <p className="font-bold text-blue-900">Freelancer Receives:</p>
            <p className="text-gray-700">
              {baseEth} ETH - {escrowEth} ETH = {finalEth} ETH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
