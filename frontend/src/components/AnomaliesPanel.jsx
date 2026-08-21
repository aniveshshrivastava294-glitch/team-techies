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
        return 'badge-error';
      case 'high':
      case 'medium':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const getRecommendationForItem = (anomaly, index) => {
    if (!recommendations || recommendations.length === 0) return null;
    return recommendations.find(r => r.anomalyId === anomaly.id) || recommendations[index % recommendations.length];
  };

  return (
    <div className="card-enterprise p-5 mb-6 font-sans">
      
      {/* Header & Segmented Tab Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Operational Alerts & Anomalies Register</h2>
              <span className="badge-pill badge-error">
                {filteredAnomalies.length} Active Alerts
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Automated telemetry notifications for facility maintenance, energy spikes, and transit delays.
            </p>
          </div>
        </div>

        {/* Segmented Control Filter Bar */}
        <div className="flex items-center space-x-1 border-b border-[#E2E8F0] md:border-b-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                selectedCategory === cat ? 'nav-tab-active' : 'nav-tab-inactive'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies Inbox List Rows */}
      {isLoading ? (
        <div className="py-8 text-center text-slate-400">
          <p className="text-xs font-mono">Running Anomaly Detection & Gemini Reasoning Pipeline...</p>
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="py-8 text-center text-slate-500 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
          <CheckCircle2 className="w-6 h-6 text-[#16A34A] mx-auto mb-1.5" />
          <p className="text-xs font-medium text-slate-700">All domain metrics operating within standard baseline thresholds.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E2E8F0]">
          {filteredAnomalies.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const rec = getRecommendationForItem(item, idx);

            return (
              <div key={item.id || idx} className="py-3 transition-colors hover:bg-[#F8FAFC]">
                
                {/* Horizontal List Row (Linear / Email Inbox Style) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`badge-pill ${getSeverityBadge(item.severity)} shrink-0`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{item.severity}</span>
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{item.title}</h3>
                        {item.location && (
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
                            <MapPin className="w-3 h-3 text-[#2563EB]" />
                            {item.location}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        {item.metric} • Category: {item.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="btn-ghost text-xs self-start sm:self-center"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>View AI Recommendation</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Gemini AI Multi-Factor Reasoning Drawer */}
                {isExpanded && (
                  <div className="mt-3 mx-2 p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] text-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
                      <span className="font-semibold text-[#2563EB] flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Gemini Factor-Cited Synthesis</span>
                      </span>
                      {rec?.estimatedSavingsOrSafetyGain && (
                        <span className="badge-pill badge-success">
                          Gain: {rec.estimatedSavingsOrSafetyGain}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-[#2563EB]" />
                        {rec?.title || 'Actionable Operational Fix'}
                      </h4>
                      <p className="text-slate-600 text-xs mt-0.5 pl-4">
                        {rec?.recommendation || item.details?.description || 'Reallocate schedule to avoid operational hazard.'}
                      </p>
                    </div>

                    {/* Step-by-Step Guidance */}
                    <div className="bg-white p-2.5 rounded border border-[#E2E8F0] text-[11px]">
                      <span className="font-semibold text-slate-800 block mb-1">Recommended Action Step:</span>
                      <p className="text-slate-600">
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
