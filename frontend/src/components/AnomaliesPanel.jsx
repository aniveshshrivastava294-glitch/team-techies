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
        return 'badge-mono-dark';
      case 'high':
      case 'medium':
        return 'badge-mono';
      default:
        return 'badge-mono';
    }
  };

  const getRecommendationForItem = (anomaly, index) => {
    if (!recommendations || recommendations.length === 0) return null;
    return recommendations.find(r => r.anomalyId === anomaly.id) || recommendations[index % recommendations.length];
  };

  return (
    <div className="card-surface p-5 mb-6 font-sans shadow-2xs">
      
      {/* Header & Segmented Tab Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E6E0D2]">
        <div className="flex items-start sm:items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-[#1C1917] shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-[#1C1917] leading-snug">System Alerts & Anomalies Register</h2>
              <span className="badge-mono-dark text-[10px] shrink-0">
                {filteredAnomalies.length} Active Alerts
              </span>
            </div>
            <p className="text-xs text-[#57534E] font-medium mt-0.5">
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
              className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all rounded-md ${
                selectedCategory === cat ? 'bg-[#1C1917] text-white font-bold' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies Inbox List Rows */}
      {isLoading ? (
        <div className="py-8 text-center text-[#78716C] font-mono text-xs">
          Running Anomaly Detection & Gemini Reasoning Pipeline...
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="py-8 text-center text-[#57534E] bg-[#F0EBE1] rounded-lg border border-[#E6E0D2]">
          <CheckCircle2 className="w-6 h-6 text-[#1C1917] mx-auto mb-1.5" />
          <p className="text-xs font-bold text-[#1C1917]">All domain metrics operating within standard baseline thresholds.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E6E0D2]">
          {filteredAnomalies.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const rec = getRecommendationForItem(item, idx);

            return (
              <div key={item.id || idx} className="py-3 transition-colors hover:bg-[#F5F2EB]">
                
                {/* Horizontal List Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`${getSeverityBadge(item.severity)} shrink-0`}>
                      <span>{item.severity}</span>
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="text-xs font-bold text-[#1C1917] truncate">{item.title}</h3>
                        {item.location && (
                          <span className="text-[11px] font-mono text-[#57534E] flex items-center gap-1 shrink-0 font-semibold">
                            <MapPin className="w-3 h-3 text-[#1C1917]" />
                            {item.location}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#78716C] font-mono font-medium mt-0.5 truncate">
                        {item.metric} • Category: {item.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="btn-secondary text-xs self-start sm:self-center shrink-0"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#1C1917]" />
                    <span>View AI Recommendation</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Gemini AI Reasoning Drawer */}
                {isExpanded && (
                  <div className="mt-3 mx-2 p-3.5 bg-[#F0EBE1] rounded-lg border border-[#E6E0D2] text-xs space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E6E0D2] pb-1.5">
                      <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#1C1917]" />
                        <span>Gemini Factor-Cited Reasoning</span>
                      </span>
                      {rec?.estimatedSavingsOrSafetyGain && (
                        <span className="badge-mono-dark text-[10px]">
                          Gain: {rec.estimatedSavingsOrSafetyGain}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-[#1C1917] text-xs flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-[#1C1917]" />
                        {rec?.title || 'Actionable Operational Fix'}
                      </h4>
                      <p className="text-[#44403C] text-xs mt-0.5 pl-4 font-medium">
                        {rec?.recommendation || item.details?.description || 'Reallocate schedule to avoid operational hazard.'}
                      </p>
                    </div>

                    {/* Step Guidance */}
                    <div className="bg-[#FAF8F3] p-2.5 rounded border border-[#E6E0D2] text-[11px]">
                      <span className="font-bold text-[#1C1917] block mb-1">Recommended Action Step:</span>
                      <p className="text-[#57534E] font-medium">
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
