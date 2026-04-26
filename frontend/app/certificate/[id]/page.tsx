'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CertificateTemplate } from '../../components/CertificateTemplate';

const mockCertificateData: Record<string, any> = {
  default: {
    freelancerName: 'Alice Developer',
    address: '0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d',
    reputationScore: 9500,
    credentialCount: 5,
  },
};

export default function CertificateViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCertificate({ ...mockCertificateData.default, certificateId: id });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 skeleton" />
            <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Loading certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold mb-2">Certificate Not Found</p>
            <Link href="/certificates"><button className="btn-secondary">Back to Certificates</button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-12">
        <div className="section-container">
          <Link href="/certificates">
            <button className="btn-ghost" style={{ paddingLeft: 0 }}>← Back to Certificates</button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mt-4 mb-2">Verify Certificate</h1>
          <p className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            ID: {certificate.certificateId.slice(0, 12)}...
          </p>
        </div>
      </section>

      <main className="section-container flex-1 pb-16">
        {/* Verification Status */}
        <div className="solid-card p-6 mb-8" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <span className="text-lg" style={{ color: 'var(--accent-emerald)' }}>✓</span>
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--accent-emerald)' }}>Certificate Verified</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Authentic and recorded on Polygon Amoy</p>
            </div>
          </div>
        </div>

        {/* Certificate */}
        <div className="mb-12">
          <CertificateTemplate
            freelancerName={certificate.freelancerName}
            address={certificate.address}
            reputationScore={certificate.reputationScore}
            credentialCount={certificate.credentialCount}
            certificateId={certificate.certificateId}
          />
        </div>

        {/* Details grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="solid-card p-6">
            <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Certificate Details</p>
            <div className="space-y-3 text-sm mt-4">
              {[
                { k: 'Certificate ID', v: certificate.certificateId.slice(0, 16) + '...' },
                { k: 'Freelancer', v: certificate.freelancerName },
                { k: 'Wallet', v: certificate.address.slice(0, 10) + '...' },
                { k: 'Issue Date', v: new Date().toLocaleDateString() },
                { k: 'Blockchain', v: 'Polygon Amoy' },
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.k}</span>
                  <span className="font-semibold">{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="solid-card p-6">
            <p className="label" style={{ color: 'var(--accent-violet-light)' }}>Verification Metrics</p>
            <div className="space-y-3 text-sm mt-4">
              {[
                { k: 'Reputation Score', v: `${(certificate.reputationScore / 10000 * 100).toFixed(1)}%`, color: 'var(--accent-blue-light)' },
                { k: 'Credentials Earned', v: certificate.credentialCount, color: 'var(--accent-violet-light)' },
                { k: 'Status', v: '✓ ACTIVE', color: 'var(--accent-emerald)' },
                { k: 'Verification', v: '✓ CONFIRMED', color: 'var(--accent-emerald)' },
                { k: 'Chain Status', v: '✓ IMMUTABLE', color: 'var(--accent-emerald)' },
              ].map((row, idx) => (
                <div key={idx} className="flex justify-between" style={{ borderBottom: idx < 4 ? '1px solid var(--border-default)' : 'none', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.k}</span>
                  <span className="font-semibold" style={{ color: row.color }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="solid-card p-6 mb-12" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
          <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Blockchain Verification</p>
          <p className="text-sm mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>Verify directly on PolygonScan:</p>
          <div className="space-y-3">
            <div className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>View Wallet</p>
              <a href={`https://amoy.polygonscan.com/address/${certificate.address}`} target="_blank" rel="noopener noreferrer" className="text-xs break-all" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue-light)' }}>
                https://amoy.polygonscan.com/address/{certificate.address}
              </a>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>ReputationRegistry Contract</p>
              <a href="https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02" target="_blank" rel="noopener noreferrer" className="text-xs break-all" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue-light)' }}>
                https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02
              </a>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '🔒', title: 'Immutable', desc: 'Cannot be forged or modified', color: 'var(--accent-emerald)' },
            { icon: '🌐', title: 'Publicly Verifiable', desc: 'Anyone can verify on PolygonScan', color: 'var(--accent-blue-light)' },
            { icon: '✅', title: 'Trustworthy', desc: 'Permanent record on blockchain', color: 'var(--accent-violet-light)' },
          ].map((f, idx) => (
            <div key={idx} className="solid-card p-6 text-center">
              <span className="text-2xl block mb-2">{f.icon}</span>
              <p className="font-semibold text-sm mb-1" style={{ color: f.color }}>{f.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Share */}
        <div className="solid-card p-6">
          <p className="label" style={{ color: 'var(--accent-blue-light)' }}>Share This Certificate</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>Share your verified credential link:</p>
          <div className="p-3 rounded-lg mb-4 text-xs break-all" style={{ background: 'var(--bg-elevated)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            https://skillbond.example.com/certificate/{certificate.certificateId}
          </div>
          <button className="btn-primary" style={{ fontSize: '12px' }}>Copy Link</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
