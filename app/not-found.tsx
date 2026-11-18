import Link from 'next/link';
import { Film, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The page you are looking for does not exist or has been moved to a different milestone.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
