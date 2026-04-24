'use client';

import React from 'react';
import { useRef } from 'react';

interface CertificateProps {
  freelancerName: string;
  address: string;
  reputationScore: number;
  credentialCount: number;
  certificateId: string;
  issueDate?: string;
}

export const CertificateTemplate: React.FC<CertificateProps> = ({
  freelancerName,
  address,
  reputationScore,
  credentialCount,
  certificateId,
  issueDate = new Date().toLocaleDateString(),
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const scorePercent = (reputationScore / 10000 * 100).toFixed(1);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    const html2pdf = (await import('html2pdf.js')).default;
    const element = certificateRef.current;
    const options = {
      margin: 0,
      filename: `SkillBond-Certificate-${certificateId}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        style={{
          width: '100%',
          aspectRatio: '16/12',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)',
          padding: '48px',
          color: 'rgb(255, 255, 255)',
          border: '4px solid rgb(250, 204, 21)',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header with decorative elements */}
        <div style={{textAlign: 'center', borderBottom: '2px solid rgb(250, 204, 21)', paddingBottom: '24px'}}>
          <div style={{color: 'rgb(250, 204, 21)', fontSize: '36px', fontWeight: 900, marginBottom: '8px'}}>★</div>
          <h1 style={{fontSize: '48px', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '8px'}}>SKILLBOND</h1>
          <p style={{color: 'rgb(253, 224, 71)', fontSize: '18px', letterSpacing: '0.05em', fontWeight: 700}}>
            CREDENTIAL OF EXCELLENCE
          </p>
        </div>

        {/* Main content */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '24px'}}>
          <p style={{color: 'rgb(209, 213, 219)', fontSize: '14px', letterSpacing: '0.05em'}}>THIS CERTIFIES THAT</p>

          <div style={{gap: '8px', display: 'flex', flexDirection: 'column'}}>
            <h2 style={{fontSize: '36px', fontWeight: 900, color: 'rgb(253, 224, 71)', letterSpacing: '0.025em'}}>
              {freelancerName}
            </h2>
            <p style={{fontSize: '14px', fontFamily: 'monospace', color: 'rgb(156, 163, 175)'}}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          <div style={{gap: '12px', display: 'flex', flexDirection: 'column', marginTop: '24px', marginBottom: '24px'}}>
            <p style={{color: 'rgb(209, 213, 219)', fontSize: '14px'}}>HAS DEMONSTRATED EXCEPTIONAL SKILL AND DEDICATION</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '48px'}}>
              <div style={{backgroundColor: 'rgba(55, 65, 81, 0.5)', padding: '12px 24px', borderRadius: '6px', border: '1px solid rgb(250, 204, 21)'}}>
                <p style={{color: 'rgb(253, 224, 71)', fontSize: '12px', letterSpacing: '0.05em', fontWeight: 700}}>REPUTATION</p>
                <p style={{fontSize: '30px', fontWeight: 900, color: 'rgb(255, 255, 255)'}}>{scorePercent}%</p>
              </div>
              <div style={{backgroundColor: 'rgba(55, 65, 81, 0.5)', padding: '12px 24px', borderRadius: '6px', border: '1px solid rgb(250, 204, 21)'}}>
                <p style={{color: 'rgb(253, 224, 71)', fontSize: '12px', letterSpacing: '0.05em', fontWeight: 700}}>CREDENTIALS</p>
                <p style={{fontSize: '30px', fontWeight: 900, color: 'rgb(255, 255, 255)'}}>{credentialCount}</p>
              </div>
            </div>
          </div>

          <p style={{color: 'rgb(156, 163, 175)', fontSize: '12px'}}>
            Issued on the Polygon Amoy Blockchain
          </p>
        </div>

        {/* Footer */}
        <div style={{borderTop: '2px solid rgb(250, 204, 21)', paddingTop: '24px', gap: '8px', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: '12px', color: 'rgb(156, 163, 175)', marginBottom: '8px'}}>CERTIFICATE ID</p>
              <p style={{fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: 'rgb(253, 224, 71)', wordBreak: 'break-all'}}>{certificateId}</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: '12px', color: 'rgb(156, 163, 175)', marginBottom: '8px'}}>ISSUE DATE</p>
              <p style={{fontWeight: 700, color: 'rgb(253, 224, 71)'}}>{issueDate}</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: '12px', color: 'rgb(156, 163, 175)', marginBottom: '8px'}}>VERIFICATION</p>
              <p style={{fontFamily: 'monospace', fontSize: '12px', color: 'rgb(74, 222, 128)'}}>✓ VERIFIED</p>
            </div>
          </div>
          <p style={{fontSize: '12px', color: 'rgb(107, 114, 128)', textAlign: 'center', marginTop: '16px'}}>
            This certificate is permanently recorded on the Polygon Amoy blockchain at
          </p>
          <p style={{fontSize: '12px', color: 'rgb(107, 114, 128)', textAlign: 'center'}}>
            amoy.polygonscan.com/address/{address}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button
          onClick={downloadCertificate}
          style={{
            border: '2px solid rgb(0, 0, 0)',
            backgroundColor: 'rgb(0, 0, 0)',
            color: 'rgb(255, 255, 255)',
            padding: '16px 32px',
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '0.05em',
            transition: 'all 0.2s',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)';
            e.currentTarget.style.color = 'rgb(0, 0, 0)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(0, 0, 0)';
            e.currentTarget.style.color = 'rgb(255, 255, 255)';
          }}
        >
          ⬇ DOWNLOAD CERTIFICATE PDF
        </button>
      </div>

      {/* Certificate Info */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', fontSize: '12px'}}>
        <div style={{border: '2px solid rgb(209, 213, 219)', padding: '16px', borderRadius: '6px'}}>
          <p style={{fontWeight: 700, marginBottom: '8px'}}>🔒 BLOCKCHAIN VERIFIED</p>
          <p style={{color: 'rgb(75, 85, 99)'}}>
            This certificate is immutably recorded on the Polygon Amoy blockchain
          </p>
        </div>
        <div style={{border: '2px solid rgb(209, 213, 219)', padding: '16px', borderRadius: '6px'}}>
          <p style={{fontWeight: 700, marginBottom: '8px'}}>🌐 PUBLICLY VERIFIABLE</p>
          <p style={{color: 'rgb(75, 85, 99)'}}>
            Anyone can verify this credential using the certificate ID
          </p>
        </div>
        <div style={{border: '2px solid rgb(209, 213, 219)', padding: '16px', borderRadius: '6px'}}>
          <p style={{fontWeight: 700, marginBottom: '8px'}}>✅ TAMPER-PROOF</p>
          <p style={{color: 'rgb(75, 85, 99)'}}>
            Cannot be modified or forged - permanent proof of achievement
          </p>
        </div>
      </div>
    </div>
  );
};
