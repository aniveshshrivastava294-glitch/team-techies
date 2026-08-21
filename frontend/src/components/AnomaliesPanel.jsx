import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, Cpu, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';

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
        return 'badge-rose';
      case 'high':
      case 'medium':
        return 'badge-amber';
      default:
        return 'badge-zinc';
    }
  };

  const getRecommendationForItem = (anomaly, index) => {
    if (!recommendations || recommendations.length === 0) return null;
    return recommendations.find(r => r.anomalyId === anomaly.id) || recommendations[index % recommendations.length];
  };

  return (
    <div className="card-onyx p-5 mb-6 font-sans">
      
      {/* Header & Segmented Tab Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-start sm:items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-zinc-50 leading-snug">System Alerts & Anomalies Register</h2>
              <span className="badge-amber text-[10px] shrink-0">
                {filteredAnomalies.length} Active Alerts
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automated telemetry notifications for facility maintenance, energy spikes, and transit delays.
            </p>
          </div>
        </div>

        {/* Scrollable Category Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0 whitespace-nowrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium cursor-pointer transition-all rounded-md ${
                selectedCategory === cat ? 'bg-zinc-800 text-amber-400 border border-zinc-700 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies Inbox List Rows */}
      {isLoading ? (
        <div className="py-8 text-center text-zinc-500 font-mono text-xs">
          Running Anomaly Detection & Gemini Reasoning Pipeline...
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="py-8 text-center text-zinc-400 bg-zinc-950 rounded-lg border border-zinc-800">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
          <p className="text-xs font-medium text-zinc-300">All domain metrics operating within standard baseline thresholds.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80">
          {filteredAnomalies.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const rec = getRecommendationForItem(item, idx);

            return (
              <div key={item.id || idx} className="py-3 transition-colors hover:bg-zinc-800/40">
                
                {/* Horizontal List Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`badge-pill ${getSeverityBadge(item.severity)} shrink-0`}>
                      <span>{item.severity}</span>
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="text-xs font-semibold text-zinc-100 truncate">{item.title}</h3>
                        {item.location && (
                          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 shrink-0">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {item.location}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                        {item.metric} • Category: {item.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="btn-onyx-ghost text-xs self-start sm:self-center shrink-0"
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span>View AI Recommendation</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Gemini AI Multi-Factor Reasoning Drawer */}
                {isExpanded && (
                  <div className="mt-3 mx-2 p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                      <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Gemini Factor-Cited Reasoning</span>
                      </span>
                      {rec?.estimatedSavingsOrSafetyGain && (
                        <span className="badge-emerald text-[10px]">
                          Gain: {rec.estimatedSavingsOrSafetyGain}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-zinc-100 text-xs flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                        {rec?.title || 'Actionable Operational Fix'}
                      </h4>
                      <p className="text-zinc-300 text-xs mt-0.5 pl-4">
                        {rec?.recommendation || item.details?.description || 'Reallocate schedule to avoid operational hazard.'}
                      </p>
                    </div>

                    {/* Step-by-Step Guidance */}
                    <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800 text-[11px]">
                      <span className="font-semibold text-zinc-200 block mb-1">Recommended Action Step:</span>
                      <p className="text-zinc-400">
                        {rec?.suggestedAction || 'Notify facility dispatch and lock conflicting room reservation.'}
                      </p>
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
