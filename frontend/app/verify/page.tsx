'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type VerifiedCredential = {
  valid: boolean;
  verifiedAt: string;
  credential: {
    credentialSubject?: {
      projectType?: string;
      durationDays?: number;
      outcome?: string;
      clientSatisfaction?: number;
    };
    issuanceDate: string;
    issuer?: {
      id?: string;
    };
    proof?: {
      type?: string;
      proofPurpose?: string;
    };
  };
};

export default function CredentialVerifier() {
  const [credentialId, setCredentialId] = useState('');
  const [credential, setCredential] = useState<VerifiedCredential | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialId) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/credentials/${credentialId}/verify`);
      setCredential(response.data);
    } catch {
      setError('NOT FOUND');
      setCredential(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Header */}
      <header className="border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Link href="/">
            <button className="text-xs tracking-widest font-bold hover:underline mb-4">← BACK</button>
          </Link>
          <h1 className="text-3xl font-bold">VERIFY CREDENTIAL</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Input Form */}
        {!credential && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">CHECK CREDENTIAL AUTHENTICITY</h2>

            <div className="border-2 border-black p-8">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="text-xs tracking-widest font-bold block mb-4">
                    CREDENTIAL ID
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => {
                      setCredentialId(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g., credential-12345"
                    className="w-full border-2 border-black px-4 py-3 text-sm focus:outline-none focus:bg-black focus:text-white transition font-mono"
                  />
                  <p className="text-xs tracking-widest mt-3">PASTE CREDENTIAL ID OR FULL URL</p>
                </div>

                {error && (
                  <div className="border-2 border-black p-4 bg-red-100">
                    <p className="text-sm font-bold">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!credentialId || loading}
                  className="w-full border-2 border-black bg-black text-white py-3 font-bold text-sm tracking-widest hover:bg-white hover:text-black disabled:opacity-50 transition-all"
                >
                  {loading ? 'VERIFYING...' : 'VERIFY CREDENTIAL'}
                </button>
              </form>

              <div className="border-t-2 border-black mt-8 pt-8 text-xs tracking-widest font-bold space-y-4">
                <p>WHAT THIS DOES:</p>
                <ul className="space-y-2 font-normal tracking-normal ml-4">
                  <li>✓ Checks cryptographic signature authenticity</li>
                  <li>✓ Verifies issuer identity and proof</li>
                  <li>✓ Ensures credential has not been tampered with</li>
                  <li>✓ Returns complete credential details</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Verified Result */}
        {credential && credential.valid && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="border-2 border-black p-8 text-center bg-gray-100">
              <p className="text-5xl mb-4">✓</p>
              <h2 className="text-3xl font-bold mb-2">VERIFIED</h2>
              <p className="text-sm">This credential is authentic and cryptographically valid</p>
            </div>

            {/* Project Info */}
            {credential.credential?.credentialSubject && (
              <div className="border-2 border-black p-8">
                <p className="text-xs tracking-widest font-bold mb-6 border-b-2 border-black pb-4">
                  PROJECT INFORMATION
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b-2 border-black pb-3">
                    <span>PROJECT TYPE</span>
                    <span className="font-bold">{credential.credential.credentialSubject.projectType}</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-black pb-3">
                    <span>DURATION</span>
                    <span className="font-bold">{credential.credential.credentialSubject.durationDays} DAYS</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-black pb-3">
                    <span>OUTCOME</span>
                    <span className="font-bold uppercase">{credential.credential.credentialSubject.outcome?.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLIENT SATISFACTION</span>
                    <span className="font-bold">{credential.credential.credentialSubject.clientSatisfaction}/5 ★</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-6">
                <p className="text-xs tracking-widest font-bold mb-3">ISSUED</p>
                <p className="text-2xl font-bold mb-2">
                  {new Date(credential.credential.issuanceDate).toLocaleDateString()}
                </p>
                <p className="text-xs">
                  {new Date(credential.credential.issuanceDate).toLocaleTimeString()}
                </p>
              </div>

              <div className="border-2 border-black p-6">
                <p className="text-xs tracking-widest font-bold mb-3">VERIFIED</p>
                <p className="text-2xl font-bold mb-2">
                  {new Date(credential.verifiedAt).toLocaleDateString()}
                </p>
                <p className="text-xs">
                  {new Date(credential.verifiedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Issuer */}
            <div className="border-2 border-black p-8 bg-gray-100">
              <p className="text-xs tracking-widest font-bold mb-4">ISSUED BY (DID)</p>
              <p className="font-mono text-xs break-all">{credential.credential.issuer?.id}</p>
            </div>

            {/* Proof Details */}
            <div className="border-2 border-black p-8">
              <p className="text-xs tracking-widest font-bold mb-6 border-b-2 border-black pb-4">
                CRYPTOGRAPHIC SIGNATURE
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>SIGNATURE TYPE</span>
                  <span className="font-bold">{credential.credential.proof?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>PURPOSE</span>
                  <span className="font-bold">{credential.credential.proof?.proofPurpose}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white border-2 border-black">
                <p className="text-xs tracking-widest font-bold mb-2">STATUS</p>
                <p className="text-lg font-bold text-green-700">✓ SIGNATURE VALID</p>
                <p className="text-xs mt-2">Verified using ECDSA cryptography</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="border-2 border-black p-8 bg-gray-100">
              <p className="text-xs tracking-widest font-bold mb-4">ABOUT THIS CREDENTIAL</p>
              <ul className="space-y-2 text-sm">
                <li>✓ <strong>W3C Standard</strong> - Uses W3C Verifiable Credential Data Model v2.0</li>
                <li>✓ <strong>Portable</strong> - Can be verified on any W3C-compliant platform</li>
                <li>✓ <strong>Non-Revocable</strong> - Once issued, permanently proves the claim</li>
                <li>✓ <strong>Privacy-Preserving</strong> - Only claimed information is disclosed</li>
              </ul>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setCredential(null);
                setCredentialId('');
              }}
              className="w-full border-2 border-black px-4 py-3 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all"
            >
              VERIFY ANOTHER
            </button>
          </div>
        )}

        {/* Not Found Result */}
        {credential === null && error && (
          <div className="space-y-6">
            <div className="border-2 border-black p-8 text-center bg-red-100">
              <p className="text-5xl mb-4">✗</p>
              <h2 className="text-3xl font-bold mb-2">NOT FOUND</h2>
              <p className="text-sm">{error}</p>
            </div>

            <button
              onClick={() => {
                setError('');
                setCredentialId('');
              }}
              className="w-full border-2 border-black px-4 py-3 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-16 py-8 px-8 text-center">
        <p className="text-xs tracking-widest">W3C VERIFIABLE CREDENTIAL VERIFICATION SERVICE</p>
      </footer>
    </div>
  );
}
