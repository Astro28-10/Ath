import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
      }}
    >
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Product */}
          <div>
            <p className="label mb-4" style={{ color: 'var(--text-muted)' }}>Product</p>
            <ul className="space-y-3">
              {[
                { label: 'Overview', href: '/dashboard' },
                { label: 'Interactive Demo', href: '/simulate' },
                { label: 'Learn', href: '/learn' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <p className="label mb-4" style={{ color: 'var(--text-muted)' }}>Explore</p>
            <ul className="space-y-3">
              {[
                { label: 'Discover Talent', href: '/search' },
                { label: 'Leaderboard', href: '/leaderboard' },
                { label: 'Certificates', href: '/certificates' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div>
            <p className="label mb-4" style={{ color: 'var(--text-muted)' }}>Actions</p>
            <ul className="space-y-3">
              {[
                { label: 'Create Project', href: '/client' },
                { label: 'Freelancer Dashboard', href: '/freelancer' },
                { label: 'Verify Credential', href: '/verify' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network */}
          <div>
            <p className="label mb-4" style={{ color: 'var(--text-muted)' }}>Network</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="status-dot status-dot-live" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>All Systems Live</span>
              </li>
              <li>
                <a
                  href="https://amoy.polygonscan.com/address/0x1B1C962B4A4be5B655a8A4588a06282646b7ba02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-blue-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  View on PolygonScan →
                </a>
              </li>
              <li>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Polygon Amoy Testnet</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-violet) 100%)',
              }}
            >
              <span className="text-white text-[10px] font-bold">SB</span>
            </div>
            <span className="text-xs font-semibold gradient-text">SKILLBOND</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 SkillBond Protocol · Reputation-Backed Escrow
          </p>
        </div>
      </div>
    </footer>
  );
}
