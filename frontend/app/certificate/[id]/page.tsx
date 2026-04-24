'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    // Simulate fetching certificate data
    setTimeout(() => {
      setCertificate({
        ...mockCertificateData.default,
        certificateId: id,
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">⏳ LOADING CERTIFICATE...</p>
          <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-white text-black font-mono">
        <header className="border-b-4 border-black">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <Link href="/certificates">
              <button className="text-xs tracking-widest font-bold hover:underline">← BACK</button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">CERTIFICATE NOT FOUND</h1>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/certificates">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK TO CERTIFICATES</button>
          </Link>
          <h1 className="text-3xl font-bold">VERIFY CERTIFICATE</h1>
          <p className="text-xs tracking-widest mt-2 text-gray-600">
            Certificate ID: {certificate.certificateId.slice(0, 8)}...
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Verification Status */}
        <div className="border-3 border-green-500 bg-green-50 p-6 mb-8 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">✅</span>
            <div>
              <h2 className="text-xl font-bold text-green-700">CERTIFICATE VERIFIED</h2>
              <p className="text-sm text-green-600">This certificate is authentic and recorded on the Polygon Amoy blockchain</p>
            </div>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="mb-12">
          <CertificateTemplate
            freelancerName={certificate.freelancerName}
            address={certificate.address}
            reputationScore={certificate.reputationScore}
            credentialCount={certificate.credentialCount}
            certificateId={certificate.certificateId}
          />
        </div>

        {/* Verification Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border-2 border-black p-6">
            <h3 className="font-bold text-lg mb-4 tracking-widest">CERTIFICATE DETAILS</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Certificate ID:</span>
                <span className="font-mono font-bold">{certificate.certificateId.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Freelancer:</span>
                <span className="font-bold">{certificate.freelancerName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Wallet Address:</span>
                <span className="font-mono text-xs">{certificate.address.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Issue Date:</span>
                <span className="font-bold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Blockchain:</span>
                <span className="font-bold">Polygon Amoy</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-6">
            <h3 className="font-bold text-lg mb-4 tracking-widest">VERIFICATION METRICS</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Reputation Score:</span>
                <span className="font-bold text-blue-600">{(certificate.reputationScore / 10000 * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Credentials Earned:</span>
                <span className="font-bold text-purple-600">{certificate.credentialCount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-green-600">✓ ACTIVE</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Verification:</span>
                <span className="font-bold text-green-600">✓ CONFIRMED</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-600">Chain Status:</span>
                <span className="font-bold text-green-600">✓ IMMUTABLE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="border-3 border-blue-400 p-6 bg-blue-50 rounded-lg mb-12">
          <h3 className="font-bold text-lg mb-4 tracking-widest">🔗 BLOCKCHAIN VERIFICATION</h3>
          <p className="text-sm text-gray-700 mb-4">
            You can verify this certificate directly on the Polygon Amoy blockchain using PolygonScan:
          </p>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded border-2 border-gray-300">
              <p className="text-xs text-gray-600 mb-2">View Wallet:</p>
              <a
                href={`https://amoy.polygonscan.com/address/${certificate.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-mono text-xs hover:underline break-all"
              >
                https://amoy.polygonscan.com/address/{certificate.address}
              </a>
            </div>
            <div className="bg-white p-4 rounded border-2 border-gray-300">
              <p className="text-xs text-gray-600 mb-2">View ReputationRegistry Contract:</p>
              <a
                href="https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-mono text-xs hover:underline"
              >
                https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02
              </a>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-green-500 p-4 text-center rounded-lg bg-green-50">
            <p className="text-2xl mb-2">🔒</p>
            <p className="font-bold text-sm">IMMUTABLE</p>
            <p className="text-xs text-gray-600 mt-1">Cannot be forged or modified</p>
          </div>
          <div className="border-2 border-blue-500 p-4 text-center rounded-lg bg-blue-50">
            <p className="text-2xl mb-2">🌐</p>
            <p className="font-bold text-sm">PUBLICLY VERIFIABLE</p>
            <p className="text-xs text-gray-600 mt-1">Anyone can verify on PolygonScan</p>
          </div>
          <div className="border-2 border-purple-500 p-4 text-center rounded-lg bg-purple-50">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-bold text-sm">TRUSTWORTHY</p>
            <p className="text-xs text-gray-600 mt-1">Permanent record on blockchain</p>
          </div>
        </div>

        {/* Share Certificate */}
        <div className="mt-12 border-t-4 border-black pt-8">
          <h3 className="font-bold text-lg mb-4">SHARE THIS CERTIFICATE</h3>
          <p className="text-sm text-gray-700 mb-4">
            Share your verified credential link with employers and clients:
          </p>
          <div className="bg-gray-100 p-4 rounded border-2 border-gray-300 font-mono text-xs mb-4">
            {`https://skillbond.example.com/certificate/${certificate.certificateId}`}
          </div>
          <button className="border-2 border-black bg-black text-white px-6 py-2 font-bold text-sm tracking-widest hover:bg-white hover:text-black transition-all">
            📋 COPY LINK
          </button>
        </div>
      </main>
    </div>
  );
}
