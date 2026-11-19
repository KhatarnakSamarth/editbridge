import Link from 'next/link';
import { Film, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-[#170B29] border border-pink-500/30 shadow-2xl shadow-pink-500/10">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/15 text-vice-pink border border-pink-500/30 flex items-center justify-center mx-auto shadow-inner">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-vice-gold">
            Error 404 • Missing Track
          </span>
          <h1 className="text-2xl font-extrabold text-white">
            Scene Not Found
          </h1>
          <p className="text-xs text-vice-muted">
            The frame or sequence you are looking for does not exist or has been moved to a different timeline milestone.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-vice-gradient hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Studio</span>
        </Link>
      </div>
    </div>
  );
}
