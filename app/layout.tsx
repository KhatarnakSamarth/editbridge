import type { Metadata } from 'next';
import './globals.css';
import { EditBridgeProvider } from '@/lib/store';
import { RetroHeader } from '@/components/RetroHeader';
import { RetroStatusBar } from '@/components/RetroStatusBar';

export const metadata: Metadata = {
  title: 'EditBridge — Creator–Editor Collaboration Platform [90s OS]',
  description:
    'One structured 90s digital workspace for content creators and video editors. Discover editors, manage briefs, timestamp reviews, revision limits, and milestone payments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#008080] antialiased flex flex-col selection:bg-[#000080] selection:text-white">
        <EditBridgeProvider>
          {/* Top Retro Navigation & Control Bar */}
          <RetroHeader />

          {/* Main App Content Area */}
          <main className="flex-1 pb-12">{children}</main>

          {/* Bottom Desktop Taskbar / Status Bar */}
          <RetroStatusBar />
        </EditBridgeProvider>
      </body>
    </html>
  );
}
