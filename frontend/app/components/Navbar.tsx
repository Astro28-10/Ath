'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/learn', label: 'Learn' },
  { href: '/simulate', label: 'Demo' },
  { href: '/search', label: 'Discover' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center" style={{ padding: '12px 16px 0' }}>
      <header
        className="w-full transition-all duration-500"
        style={{
          maxWidth: '1120px',
          background: scrolled
            ? 'rgba(255, 255, 255, 0.72)'
            : 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          borderRadius: '20px',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            : '0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        <div style={{ padding: '0 24px' }}>
          <div className="flex items-center justify-between" style={{ height: '56px' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="flex items-center justify-center transition-all duration-300"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3)',
                }}
              >
                <span className="text-white text-xs font-bold tracking-wide">SB</span>
              </div>
              <span className="text-lg font-bold hidden sm:inline" style={{ color: '#0F172A' }}>
                SKILL<span style={{ color: '#3B82F6' }}>BOND</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <button
                      className="px-4 py-2 text-[13px] font-medium transition-all duration-200"
                      style={{
                        borderRadius: '10px',
                        color: isActive ? '#3B82F6' : '#475569',
                        background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#0F172A';
                          e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#475569';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
                <span className="status-dot status-dot-live" />
                <span>Polygon Amoy</span>
              </div>

              <Link href="/simulate" className="hidden md:block">
                <button
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '12px', borderRadius: '10px' }}
                >
                  Try Demo
                </button>
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-xl"
                style={{ color: '#475569' }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {mobileOpen ? (
                    <path d="M5 5l10 10M15 5L5 15" />
                  ) : (
                    <path d="M3 5h14M3 10h14M3 15h14" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div
              className="lg:hidden pb-4 animate-fade-in"
              style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
            >
              <nav className="flex flex-col gap-1 pt-3">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                      <div
                        className="px-4 py-3 text-sm font-medium transition-all"
                        style={{
                          borderRadius: '10px',
                          color: isActive ? '#3B82F6' : '#475569',
                          background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        }}
                      >
                        {link.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
