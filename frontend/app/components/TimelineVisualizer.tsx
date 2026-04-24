'use client';

import React from 'react';

interface TimelineEvent {
  stage: number;
  name: string;
  description: string;
  daysFromStart: number;
  color: string;
  icon: string;
}

interface TimelineVisualizerProps {
  events: TimelineEvent[];
  durationDays?: number;
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({
  events,
  durationDays = 7,
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-600' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-600' },
      green: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-600' },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-8">
      {/* Timeline Overview */}
      <div className="border-2 border-black p-6 bg-gray-50">
        <h3 className="text-lg font-bold mb-4 tracking-widest">PROJECT TIMELINE</h3>
        <p className="text-2xl font-black">
          Total Duration: <span className="text-blue-600">{durationDays} days</span> + 2 days review
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-8 tracking-widest">WORKFLOW STAGES</h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-black"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {events.map((event, index) => {
              const colors = getColorClasses(event.color);
              const isLast = index === events.length - 1;

              return (
                <div key={event.stage} className="relative pl-24">
                  {/* Timeline node */}
                  <div
                    className={`absolute left-4 top-2 w-10 h-10 ${colors.bg} border-4 border-black rounded-full flex items-center justify-center font-bold text-lg`}
                  >
                    {event.stage}
                  </div>

                  {/* Event card */}
                  <div className={`border-2 border-black p-6 ${colors.bg}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{event.icon}</span>
                          <h4 className="text-lg font-bold tracking-widest">{event.name}</h4>
                        </div>
                        <p className="text-sm text-gray-700">{event.description}</p>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-300 pt-3 mt-4">
                      <p className="text-xs font-bold text-gray-600">
                        📅 Day {event.daysFromStart}
                        {event.daysFromStart > 0 && event.daysFromStart !== durationDays && (
                          <span> (in {event.daysFromStart} days)</span>
                        )}
                        {event.daysFromStart === 0 && <span> (Immediate)</span>}
                        {event.daysFromStart === durationDays && <span> (Project deadline)</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Dates */}
      <div className="border-2 border-black p-6 bg-white">
        <h3 className="text-lg font-bold mb-6 tracking-widest">KEY DATES</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">PROJECT START</p>
            <p className="text-2xl font-black text-blue-600">Day 0</p>
            <p className="text-sm text-gray-600 mt-2">Work order created & funds locked</p>
          </div>

          <div className="border-l-4 border-green-600 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">WORK DEADLINE</p>
            <p className="text-2xl font-black text-green-600">Day {durationDays}</p>
            <p className="text-sm text-gray-600 mt-2">Freelancer must submit deliverables</p>
          </div>

          <div className="border-l-4 border-orange-600 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">REVIEW PERIOD</p>
            <p className="text-2xl font-black text-orange-600">Day {durationDays} - {durationDays + 2}</p>
            <p className="text-sm text-gray-600 mt-2">Client reviews and approves/disputes</p>
          </div>

          <div className="border-l-4 border-purple-600 pl-4">
            <p className="text-xs tracking-widest font-bold text-gray-600 mb-2">PROJECT COMPLETION</p>
            <p className="text-2xl font-black text-purple-600">Day {durationDays + 2}</p>
            <p className="text-sm text-gray-600 mt-2">Funds released & credential issued</p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="border-2 border-black p-6 bg-blue-50">
        <h3 className="text-lg font-bold mb-4 tracking-widest">IMPORTANT NOTES</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600 flex-shrink-0">⚡</span>
            <span>
              <strong>Work Order Created:</strong> Client and freelancer agree on terms. Money is NOT held yet.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600 flex-shrink-0">⚡</span>
            <span>
              <strong>Funds Locked:</strong> Once client funds the project, escrow amount is held securely on
              blockchain.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600 flex-shrink-0">⚡</span>
            <span>
              <strong>Review Period:</strong> Client can approve (release funds), request changes, or initiate dispute.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600 flex-shrink-0">⚡</span>
            <span>
              <strong>Credential:</strong> W3C-compliant verifiable credential is minted and stored on Polygon blockchain.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600 flex-shrink-0">⚡</span>
            <span>
              <strong>Reputation Updates:</strong> Both parties' reputation scores are updated based on outcome.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
