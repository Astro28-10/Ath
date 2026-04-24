'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<'calculation' | 'onchain' | 'credentials' | 'system'>('calculation');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white font-mono">
      {/* Header */}
      <header className="border-b-2 border-blue-500/30 sticky top-0 bg-slate-900/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center border-2 border-blue-400 rounded-lg">
                  <span className="text-white text-sm font-bold">SB</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SKILLBOND</span>
              </div>
            </Link>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <button className="border-2 border-blue-400/50 px-4 py-2 text-xs font-bold tracking-widest hover:border-blue-400 hover:bg-blue-400/10 transition">
                  DASHBOARD
                </button>
              </Link>
              <Link href="/simulate">
                <button className="border-2 border-blue-400 px-4 py-2 text-xs font-bold tracking-widest bg-blue-400/20 hover:bg-blue-400/30 transition">
                  DEMO
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block border-2 border-purple-400/50 px-4 py-2 text-xs tracking-widest font-bold mb-8 bg-purple-400/10">
            LEARN THE SYSTEM
          </span>
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Why Reputation Matters
          </h1>
          <p className="text-lg leading-relaxed mb-8 text-gray-300 max-w-3xl">
            Reputation isn't just a number on SkillBond—it's cryptographic proof of your professional track record. It unlocks discounts, enables portability across platforms, and powers fair arbitration.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 px-8 border-b-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { id: 'calculation', label: 'HOW REPUTATION IS CALCULATED' },
              { id: 'onchain', label: 'WHY ON-CHAIN' },
              { id: 'credentials', label: 'W3C CREDENTIALS' },
              { id: 'system', label: 'THE FULL SYSTEM' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 text-xs tracking-widest font-bold rounded transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white border-2 border-blue-400'
                    : 'border-2 border-blue-400/30 text-gray-400 hover:border-blue-400/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: CALCULATION */}
          {activeTab === 'calculation' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-blue-300">How Reputation is Calculated</h2>
                <p className="text-gray-300 mb-8">
                  Reputation on SkillBond is a transparent, on-chain metric derived from your project history, ratings, and dispute outcomes.
                </p>
              </div>

              {/* Factors */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'PROJECT COMPLETION',
                    factor: 50,
                    desc: 'Each successfully completed project adds 10-50 points. Failed/disputed projects subtract points.',
                    example: 'Complete 10 projects: +500 points'
                  },
                  {
                    title: 'CLIENT RATINGS',
                    factor: 30,
                    desc: '5-star ratings boost reputation most. 1-star ratings cause significant penalties.',
                    example: '4.9 average rating: +30% bonus'
                  },
                  {
                    title: 'DISPUTE HISTORY',
                    factor: 20,
                    desc: 'Clean history builds trust. Each dispute loss reduces reputation.',
                    example: 'Zero disputes in 50 projects: +20% bonus'
                  }
                ].map((factor, idx) => (
                  <div key={idx} className="border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg">
                    <p className="text-xs tracking-widest font-bold text-blue-300 mb-2">{factor.title}</p>
                    <div className="text-3xl font-bold text-blue-300 mb-4">{factor.factor}%</div>
                    <p className="text-sm text-gray-300 mb-4">{factor.desc}</p>
                    <div className="border-t border-blue-400/20 pt-4">
                      <p className="text-xs text-purple-300">{factor.example}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formula */}
              <div className="border-2 border-purple-400/20 p-8 bg-purple-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-purple-300 mb-4">REPUTATION FORMULA</p>
                <div className="bg-slate-900 p-6 rounded-lg overflow-x-auto font-mono text-sm text-gray-300 mb-4">
                  <pre>{`reputation_score = (
  (completed_projects × 10) +
  (average_rating × 5) +
  (on_time_deliveries × 2) -
  (failed_projects × 15) -
  (disputed_losses × 20)
) / max_possible × 10000`}</pre>
                </div>
                <p className="text-xs text-gray-400">
                  The final score is stored on-chain as an immutable record, verified by the ReputationRegistry smart contract.
                </p>
              </div>

              {/* Example Progression */}
              <div className="border-2 border-blue-400/20 p-8 bg-blue-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-blue-300 mb-6">REPUTATION PROGRESSION EXAMPLE</p>
                <div className="space-y-3">
                  {[
                    { milestone: 'Day 1', events: 'First project completed', score: 150, label: 'Beginner' },
                    { milestone: 'Week 2', events: '5 projects, 4.8★ avg', score: 800, label: 'Emerging' },
                    { milestone: 'Month 1', events: '20 projects, 1 dispute (won)', score: 1500, label: 'Trusted' },
                    { milestone: 'Month 6', events: '100 projects, 4.9★ avg', score: 7200, label: 'Established' },
                    { milestone: 'Year 1', events: '250+ projects, 0 losses', score: 9500, label: 'Elite' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-4 bg-slate-800 rounded-lg">
                      <div className="w-24">
                        <p className="text-xs tracking-widest font-bold text-gray-400">{item.milestone}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{item.events}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-300">{item.score}</p>
                        <p className="text-xs text-purple-300">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHY ON-CHAIN */}
          {activeTab === 'onchain' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-blue-300">Why Reputation Must Be On-Chain</h2>
                <p className="text-gray-300 mb-8">
                  Storing reputation on the blockchain (Polygon) ensures it's immutable, verifiable, and portable—not controlled by any single platform.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'IMMUTABILITY',
                    desc: 'Once recorded on blockchain, reputation history cannot be altered, faked, or deleted by SkillBond or any actor.',
                    benefit: 'Your track record is permanent proof'
                  },
                  {
                    title: 'TRANSPARENCY',
                    desc: 'All reputation changes are auditable. Anyone can verify your score, see why it changed, and trace the history.',
                    benefit: 'No hidden algorithms or manipulation'
                  },
                  {
                    title: 'PORTABILITY',
                    desc: 'Your reputation lives in your wallet, not locked in a platform. It can be used by any app that reads the ReputationRegistry contract.',
                    benefit: 'Your reputation is YOUR asset'
                  },
                  {
                    title: 'DECENTRALIZATION',
                    desc: 'No single entity controls reputation. The smart contract rules are permanent and cannot be changed arbitrarily.',
                    benefit: 'Fair, unbiased, forever'
                  }
                ].map((benefit, idx) => (
                  <div key={idx} className="border-2 border-purple-400/20 p-6 bg-purple-400/5 rounded-lg">
                    <h3 className="text-sm tracking-widest font-bold text-purple-300 mb-3">{benefit.title}</h3>
                    <p className="text-sm text-gray-300 mb-4">{benefit.desc}</p>
                    <div className="border-t border-purple-400/20 pt-4">
                      <p className="text-xs font-bold text-blue-300">{benefit.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Network Details */}
              <div className="border-2 border-blue-400/20 p-8 bg-blue-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-blue-300 mb-6">BLOCKCHAIN TECHNICAL DETAILS</p>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-bold text-blue-300 mb-3">Network: Polygon Amoy (Testnet)</p>
                    <ul className="space-y-2 text-xs text-gray-400 list-disc ml-4">
                      <li>Fast: Block finality in ~2 seconds</li>
                      <li>Low cost: ~$0.001 per transaction</li>
                      <li>Scalable: Handles 1000s of txn/sec</li>
                      <li>EVM Compatible: Uses standard Solidity contracts</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-blue-300 mb-3">Smart Contracts</p>
                    <ul className="space-y-2 text-xs text-gray-400 list-disc ml-4">
                      <li>ReputationRegistry: Core scoring logic</li>
                      <li>EscrowContract: Fund management</li>
                      <li>Open source: Auditable by anyone</li>
                      <li>Upgradeable: Can fix bugs safely</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verification Link */}
              <div className="border-2 border-yellow-400/20 p-6 bg-yellow-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-yellow-300 mb-4">VERIFY YOURSELF</p>
                <p className="text-sm text-gray-300 mb-4">
                  You can check any freelancer's reputation directly on the blockchain:
                </p>
                <a
                  href="https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-yellow-400 px-6 py-2 text-xs font-bold tracking-widest hover:bg-yellow-400/20 transition rounded"
                >
                  VIEW ON POLYGONSCAN →
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: W3C CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-blue-300">W3C Verifiable Credentials</h2>
                <p className="text-gray-300 mb-8">
                  SkillBond certificates are W3C Verifiable Credentials—an international standard for digital credentials that can be cryptographically verified by anyone.
                </p>
              </div>

              {/* What are W3C Credentials */}
              <div className="border-2 border-blue-400/20 p-8 bg-blue-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-blue-300 mb-4">WHAT ARE W3C VERIFIABLE CREDENTIALS?</p>
                <p className="text-sm text-gray-300 mb-6">
                  W3C VC is a open standard (like SSL/TLS for HTTPS) that defines how to digitally sign and verify credentials. Think of it like a digital diploma that cannot be faked.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-bold text-blue-300 mb-2">ISSUED</p>
                    <p className="text-xs text-gray-400">SkillBond signs your credential with private key</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-4">
                    <p className="font-bold text-purple-300 mb-2">PRESENTED</p>
                    <p className="text-xs text-gray-400">You share it to prove your reputation</p>
                  </div>
                  <div className="border-l-4 border-pink-400 pl-4">
                    <p className="font-bold text-pink-300 mb-2">VERIFIED</p>
                    <p className="text-xs text-gray-400">Anyone can verify it's genuinely from SkillBond</p>
                  </div>
                </div>
              </div>

              {/* Credential Structure */}
              <div className="border-2 border-purple-400/20 p-8 bg-purple-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-purple-300 mb-4">TYPICAL CREDENTIAL STRUCTURE (JSON-LD)</p>
                <div className="bg-slate-900 p-6 rounded-lg overflow-x-auto font-mono text-xs text-gray-300 mb-4">
                  <pre>{`{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "SkillBondCredential"],
  "issuer": "did:polygon:0x1B1C962B4A4be5B655a8A4588a06282646b7ba02",
  "credentialSubject": {
    "id": "did:polygon:0x72f32C9b10e8669b5Fd139a00e03004eE4bd3b1D",
    "name": "Alice Dev",
    "reputation": 9500,
    "projectsCompleted": 150,
    "averageRating": 4.9,
    "credentialType": "SkillBond Freelancer Badge"
  },
  "issuanceDate": "2026-04-25T10:30:00Z",
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2026-04-25T10:30:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:polygon:0x1B1C#key-1",
    "signatureValue": "0x7a8b9c0d1e2f..."
  }
}`}</pre>
                </div>
              </div>

              {/* How to Verify */}
              <div className="border-2 border-blue-400/20 p-8 bg-blue-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-blue-300 mb-6">HOW TO VERIFY A CREDENTIAL</p>
                <div className="space-y-4">
                  {[
                    {
                      step: '1',
                      title: 'Get the Credential',
                      desc: 'Download from SkillBond or scan QR code'
                    },
                    {
                      step: '2',
                      title: 'Extract Signature',
                      desc: 'Read the proof.signatureValue field'
                    },
                    {
                      step: '3',
                      title: 'Check On-Chain',
                      desc: 'Verify signature matches issuer wallet'
                    },
                    {
                      step: '4',
                      title: 'Cross-Reference Reputation',
                      desc: 'Check ReputationRegistry for latest score'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-300 mb-1">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: '🎓', title: 'ON FREELANCE PLATFORMS', desc: 'Add to Upwork/Fiverr/Toptal profile' },
                  { icon: '💼', title: 'IN JOB APPLICATIONS', desc: 'Prove track record to employers' },
                  { icon: '🤝', title: 'WITH PARTNERS', desc: 'Share with clients for trust building' },
                  { icon: '📱', title: 'ON SOCIAL PROFILES', desc: 'Add badge to LinkedIn/Twitter' },
                ].map((use, idx) => (
                  <div key={idx} className="border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg">
                    <div className="text-3xl mb-3">{use.icon}</div>
                    <p className="font-bold text-blue-300 mb-2 text-sm">{use.title}</p>
                    <p className="text-xs text-gray-400">{use.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FULL SYSTEM */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-blue-300">The Full System</h2>
                <p className="text-gray-300 mb-8">
                  How reputation, credentials, escrow, and arbitration work together to create a fair freelance marketplace.
                </p>
              </div>

              {/* System Architecture */}
              <div className="border-2 border-blue-400/20 p-8 bg-blue-400/5 rounded-lg space-y-6">
                <p className="text-xs tracking-widest font-bold text-blue-300">SYSTEM ARCHITECTURE</p>

                {[
                  {
                    phase: 'ONBOARDING',
                    steps: [
                      'Freelancer connects wallet to SkillBond',
                      'Smart contract creates ReputationRegistry entry',
                      'Initial reputation: 5000 basis points (50%)',
                      'W3C credential issued to wallet'
                    ]
                  },
                  {
                    phase: 'PROJECT EXECUTION',
                    steps: [
                      'Client checks freelancer reputation score',
                      'Escrow cost calculated: base_amount × (1 - (combined_reputation / 20000))',
                      'Client funds escrow contract',
                      'Freelancer delivers work',
                      'Client rates freelancer (1-5 stars)',
                      'Reputation updates automatically'
                    ]
                  },
                  {
                    phase: 'DISPUTE RESOLUTION',
                    steps: [
                      'Either party can initiate dispute within 7 days',
                      'Evidence submitted on-chain (IPFS hashes)',
                      'Smart contract analyzes reputation scores',
                      'Arbitration verdict released',
                      'Funds distributed based on verdict',
                      'Reputations updated to reflect outcome'
                    ]
                  },
                  {
                    phase: 'CREDENTIAL GENERATION',
                    steps: [
                      'Project completes successfully',
                      'W3C credential issued with new reputation',
                      'Credential contains cryptographic proof',
                      'Client can download PDF certificate',
                      'QR code links to blockchain verification',
                      'Credential added to wallet history'
                    ]
                  }
                ].map((phase, idx) => (
                  <div key={idx} className="border-l-4 border-purple-400 pl-6">
                    <p className="font-bold text-purple-300 mb-3 text-sm">{idx + 1}. {phase.phase}</p>
                    <ul className="space-y-2">
                      {phase.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="text-xs text-gray-400 flex items-start gap-3">
                          <span className="text-blue-300 flex-shrink-0">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'ARBITRATION TIME', value: '24 hours', desc: 'Smart contract verdict' },
                  { label: 'PROTOCOL FEE', value: '0.5%', desc: 'Of project value' },
                  { label: 'CREDENTIAL VALIDITY', value: 'PERMANENT', desc: 'On-chain record' },
                  { label: 'MAXIMUM DISCOUNT', value: '30%', desc: 'Elite reputation' },
                ].map((metric, idx) => (
                  <div key={idx} className="border-2 border-purple-400/20 p-4 bg-purple-400/5 rounded-lg">
                    <p className="text-xs tracking-widest font-bold text-purple-300 mb-2">{metric.label}</p>
                    <p className="text-2xl font-bold text-purple-300 mb-1">{metric.value}</p>
                    <p className="text-xs text-gray-400">{metric.desc}</p>
                  </div>
                ))}
              </div>

              {/* Success Outcomes */}
              <div className="border-2 border-green-400/20 p-8 bg-green-400/5 rounded-lg">
                <p className="text-xs tracking-widest font-bold text-green-300 mb-6">WHAT THIS ENABLES</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: 'FOR FREELANCERS', benefits: ['Lower escrow costs for high reputation', 'Portable, verifiable credentials', 'Protection from disputes', 'Fair arbitration'] },
                    { title: 'FOR CLIENTS', benefits: ['Verified track records', 'Automatic risk assessment', 'Fair dispute resolution', 'Payment security'] }
                  ].map((group, idx) => (
                    <div key={idx}>
                      <p className="font-bold text-green-300 mb-3">{group.title}</p>
                      <ul className="space-y-2">
                        {group.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="text-xs text-gray-300 flex gap-2">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 border-t-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to See It In Action?</h2>
          <Link href="/simulate">
            <button className="border-2 border-blue-400 px-8 py-3 text-sm font-bold tracking-widest bg-blue-500 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/50 rounded-lg">
              TRY INTERACTIVE DEMO →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-8 border-t-2 border-blue-500/20">
        <div className="max-w-7xl mx-auto text-center text-xs tracking-widest text-gray-500">
          <p>SKILLBOND © 2026 • REPUTATION-BACKED ESCROW PROTOCOL</p>
        </div>
      </section>
    </div>
  );
}
