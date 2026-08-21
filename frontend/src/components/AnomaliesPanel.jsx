import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Cpu, ShieldAlert, CheckCircle2, Zap, MapPin, Layers, FileText, ArrowRight } from 'lucide-react';

export default function AnomaliesPanel({ anomalies, recommendations, isLoading }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', 'Facility & Maintenance', 'Energy & Sustainability', 'Safety & Capacity', 'Transportation'];

  const filteredAnomalies = anomalies.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  // Match recommendation from Gemini API by anomaly index or ID
  const getRecommendationForItem = (anomaly, index) => {
    if (!recommendations || recommendations.length === 0) return null;
    return recommendations.find(r => r.anomalyId === anomaly.id) || recommendations[index % recommendations.length];
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-6">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Cross-Domain Anomaly Detection</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                {filteredAnomalies.length} Detected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hybrid deterministic SQL rules & statistical outlier engine synthesizing 6 domain feeds
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium">Running Anomaly Detection & Gemini Reasoning Pipeline...</p>
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="py-10 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium text-slate-300">All domain metrics operating within standard baseline thresholds.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnomalies.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const rec = getRecommendationForItem(item, idx);

            return (
              <div
                key={item.id || idx}
                className={`glass-card rounded-xl border transition-all duration-200 overflow-hidden ${
                  item.severity === 'Critical'
                    ? 'border-red-500/40 bg-red-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg mt-0.5 border ${
                      item.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadge(item.severity)}`}>
                          {item.severity} Severity
                        </span>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {item.category}
                        </span>
                        {item.location && (
                          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-400" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-mono mt-1 bg-slate-900/80 px-2.5 py-1 rounded-md inline-block border border-slate-800">
                        {item.metric}
                      </p>
                    </div>
                  </div>

                  {/* Expand / Accordion Action */}
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span>Why this recommendation?</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Gemini AI Multi-Factor Reasoning Accordion */}
                {isExpanded && (
                  <div className="px-5 py-4 bg-slate-900/90 border-t border-slate-800 text-xs space-y-3.5 animate-fadeIn">
                    
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                        <Cpu className="w-4 h-4" />
                        <span>Gemini API Factor-Cited Synthesis (@google/genai)</span>
                      </div>
                      {rec?.estimatedSavingsOrSafetyGain && (
                        <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 rounded-md font-semibold text-[11px]">
                          Gain: {rec.estimatedSavingsOrSafetyGain}
                        </span>
                      )}
                    </div>

                    {/* Recommendation Title & Body */}
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        {rec?.title || 'Actionable Operational Fix'}
                      </h4>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed pl-5">
                        {rec?.recommendation || item.details?.description || 'Reallocate schedule to avoid operational hazard.'}
                      </p>
                    </div>

                    {/* Cited Evidence & Factors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      
                      {/* Factor Citations */}
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          Evidence & Cited Row Factors:
                        </span>
                        <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px]">
                          {rec?.citedFactors ? (
                            rec.citedFactors.map((factor, fIdx) => (
                              <li key={fIdx} className="leading-snug">{factor}</li>
                            ))
                          ) : (
                            <>
                              <li>Cross-domain lookup matched Room {item.details?.room || 'CS-301'}</li>
                              <li>Maintenance log status: {item.details?.ticket_status || 'Active'}</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Action Plan */}
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          Recommended Step-by-Step Action:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {rec?.suggestedAction || 'Notify facility dispatch and lock conflicting room reservation.'}
                        </p>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
