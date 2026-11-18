import type { Metadata } from 'next';
import './globals.css';
import { EditBridgeProvider } from '@/lib/store';
import { RetroHeader } from '@/components/RetroHeader';
import { RetroStatusBar } from '@/components/RetroStatusBar';

export const metadata: Metadata = {
  title: 'EditBridge — Next-Gen Creator–Editor Video Collaboration Platform',
  description:
    'Modern, high-retention video production workspace with frame-accurate timestamp feedback, 30/70 milestone escrow, locked master deliveries, and verified editor roster.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased flex flex-col selection:bg-cyan-500 selection:text-white transition-colors duration-200">
        <EditBridgeProvider>
          {/* Top Modern Navigation & Control Bar */}
          <RetroHeader />

          {/* Main App Content Area */}
          <main className="flex-1 pb-16">{children}</main>

          {/* Bottom Workstation Status Bar */}
          <RetroStatusBar />
        </EditBridgeProvider>
      </body>
    </html>
  );
}
