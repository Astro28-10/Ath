'use client';

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface CertificateData {
  certificateId: string;
  freelancerName: string;
  freelancerAddress: string;
  clientName: string;
  projectTitle: string;
  projectAmount: string;
  issueDate: string;
  reputationBefore: number;
  reputationAfter: number;
  hash: string;
}

interface CertificateGeneratorProps {
  data: CertificateData;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ data }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const reputationPercent = ((data.reputationAfter / 10000) * 100).toFixed(1);
  const reputationChange = data.reputationAfter - data.reputationBefore;

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = certificateRef.current;
      const options = {
        margin: 0,
        filename: `SkillBond-Certificate-${data.certificateId}.pdf`,
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#0f172a' },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
      };

      html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to download certificate');
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `SkillBond-Verify-${data.certificateId}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        style={{
          width: '100%',
          aspectRatio: '16/9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)',
          padding: '48px',
          color: 'rgb(255, 255, 255)',
          border: '4px solid rgb(59, 130, 246)',
          fontFamily: 'monospace',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid rgb(59, 130, 246)', paddingBottom: '24px' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>SKILLBOND</div>
          <p style={{ color: 'rgb(96, 165, 250)', fontSize: '14px', letterSpacing: '0.05em', fontWeight: 700 }}>
            W3C VERIFIABLE CREDENTIAL
          </p>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgb(209, 213, 219)', fontSize: '12px', letterSpacing: '0.05em', marginBottom: '12px' }}>
              THIS CERTIFIES THAT
            </p>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'rgb(96, 165, 250)', marginBottom: '8px' }}>
              {data.freelancerName}
            </h2>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgb(156, 163, 175)' }}>
              {data.freelancerAddress.slice(0, 6)}...{data.freelancerAddress.slice(-4)}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgb(209, 213, 219)', fontSize: '12px', marginBottom: '16px' }}>
              Successfully completed the project "{data.projectTitle}" for {data.clientName}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)', padding: '12px 24px', border: '1px solid rgb(59, 130, 246)' }}>
                <p style={{ color: 'rgb(96, 165, 250)', fontSize: '10px', letterSpacing: '0.05em', fontWeight: 700 }}>
                  PROJECT VALUE
                </p>
                <p style={{ fontSize: '24px', fontWeight: 900, color: 'rgb(255, 255, 255)' }}>{data.projectAmount} ETH</p>
              </div>

              <div style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)', padding: '12px 24px', border: '1px solid rgb(59, 130, 246)' }}>
                <p style={{ color: 'rgb(96, 165, 250)', fontSize: '10px', letterSpacing: '0.05em', fontWeight: 700 }}>
                  REPUTATION
                </p>
                <p style={{ fontSize: '24px', fontWeight: 900, color: 'rgb(255, 255, 255)' }}>{reputationPercent}%</p>
              </div>

              <div style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)', padding: '12px 24px', border: '1px solid rgb(59, 130, 246)' }}>
                <p style={{ color: 'rgb(96, 165, 250)', fontSize: '10px', letterSpacing: '0.05em', fontWeight: 700 }}>
                  ISSUED DATE
                </p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(255, 255, 255)' }}>
                  {new Date(data.issueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '2px solid rgb(59, 130, 246)', paddingTop: '12px', fontSize: '10px', color: 'rgb(156, 163, 175)' }}>
          <p>Verified on Polygon Amoy Blockchain | Certificate ID: {data.certificateId}</p>
          <p style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '8px' }}>Hash: {data.hash.slice(0, 32)}...</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={downloadCertificate}
          className="border-2 border-black px-6 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
        >
          DOWNLOAD CERTIFICATE (PDF)
        </button>

        <button
          onClick={downloadQR}
          className="border-2 border-black px-6 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
        >
          DOWNLOAD QR CODE
        </button>

        <button
          onClick={() => {
            const text = `Certificate ID: ${data.certificateId}\nHash: ${data.hash}\nFreelancer: ${data.freelancerName}\nProject: ${data.projectTitle}`;
            navigator.clipboard.writeText(text);
            alert('Certificate details copied to clipboard');
          }}
          className="border-2 border-black px-6 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition"
        >
          COPY CERTIFICATE ID
        </button>
      </div>

      {/* QR Code (Hidden, for download) */}
      <div ref={qrRef} style={{ display: 'none' }}>
        <QRCodeCanvas
          value={`https://skillbond.verify/${data.certificateId}`}
          size={256}
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Certificate Info */}
      <div className="border-2 border-black p-6 bg-gray-50">
        <h3 className="text-lg font-bold mb-4 tracking-widest">CERTIFICATE DETAILS</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-bold text-gray-600 mb-2">CERTIFICATE ID</p>
            <p className="font-mono text-xs break-all">{data.certificateId}</p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">BLOCKCHAIN HASH</p>
            <p className="font-mono text-xs break-all">{data.hash}</p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">FREELANCER</p>
            <p>{data.freelancerName}</p>
            <p className="font-mono text-xs text-gray-500">{data.freelancerAddress}</p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">ISSUED BY</p>
            <p>{data.clientName}</p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">PROJECT</p>
            <p>{data.projectTitle}</p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">ISSUE DATE</p>
            <p>{new Date(data.issueDate).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">REPUTATION IMPACT</p>
            <p>
              {data.reputationBefore / 100}% → {reputationPercent}% ({reputationChange > 0 ? '+' : ''}
              {(reputationChange / 100).toFixed(1)}%)
            </p>
          </div>

          <div>
            <p className="font-bold text-gray-600 mb-2">PROJECT VALUE</p>
            <p>{data.projectAmount} ETH</p>
          </div>
        </div>
      </div>

      {/* Verification Info */}
      <div className="border-2 border-black p-6 bg-blue-50">
        <h3 className="text-lg font-bold mb-4 tracking-widest">HOW TO VERIFY</h3>
        <ol className="space-y-3 text-sm list-decimal list-inside">
          <li>Visit https://skillbond.verify/{data.certificateId}</li>
          <li>Scan the QR code with any mobile device</li>
          <li>Check the blockchain transaction on PolygonScan</li>
          <li>Verify the certificate hash matches the on-chain record</li>
          <li>View the freelancer's updated reputation score</li>
        </ol>
      </div>
    </div>
  );
};
