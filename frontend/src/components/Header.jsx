import React from 'react';
import { Layers, Cpu, Zap, Database, RefreshCw, Activity, ShieldCheck } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing, datasource, health }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Title & Vector Branding */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 shadow-lg shadow-blue-500/10">
            <Layers className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Campus Intelligence Dashboard</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Problem SW-01-P
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cross-domain intelligence layer across 6 siloed campus operations
            </p>
          </div>
        </div>

        {/* System Status Indicators & Dual-AI Chips */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Groq Engine Status */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Groq Engine:</span>
            <span className="text-amber-400 font-semibold">Text-to-SQL</span>
          </div>

          {/* Gemini Synthesis Status */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-medium text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Gemini API:</span>
            <span className="text-blue-400 font-semibold">Multi-Factor Reasoning</span>
          </div>

          {/* Supabase Status */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs font-medium text-emerald-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">DB:</span>
            <span className="font-semibold">{datasource || 'Supabase'}</span>
          </div>

          {/* Refresh Action Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all duration-150 disabled:opacity-50 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Engine'}</span>
          </button>

        </div>

      </div>
    </header>
  );
}
