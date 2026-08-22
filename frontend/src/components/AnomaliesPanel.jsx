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
        return 'inst-badge-rust';
      case 'high':
      case 'medium':
        return 'inst-badge-ochre';
      default:
        return 'inst-badge-sage';
    }
  };

  // Match recommendation from Gemini API by anomaly index or ID
  const getRecommendationForItem = (anomaly, index) => {
    if (!recommendations || recommendations.length === 0) return null;
    return recommendations.find(r => r.anomalyId === anomaly.id) || recommendations[index % recommendations.length];
  };

  return (
    <div className="inst-card p-6 border border-[#E2DED4] bg-[#DCD7CC] shadow-xs mb-6 font-sans">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E2DED4]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#3E5C76]/15 border border-[#3E5C76]/30 rounded-lg text-[#3E5C76]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#1F2A38] tracking-tight">Smart Campus Alerts & Anomalies</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-rust">
                {filteredAnomalies.length} Alerts
              </span>
            </div>
            <p className="text-xs text-[#8A8578] mt-0.5">
              Live automated cross-domain incident detection with AI diagnostic reasoning
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F5F4F0] p-1 rounded-lg border border-[#E2DED4]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#3E5C76] text-white shadow-xs font-semibold'
                  : 'text-[#8A8578] hover:text-[#1F2A38] hover:bg-[#DCD7CC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      {isLoading ? (
        <div className="py-12 text-center text-[#8A8578] flex flex-col items-center">
          <div className="w-6 h-6 border-2 border-[#3E5C76] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-medium">Running Anomaly Detection & AI Reasoning Pipeline...</p>
        </div>
      ) : filteredAnomalies.length === 0 ? (
        <div className="py-10 text-center text-[#8A8578] bg-[#F5F4F0] rounded-xl border border-[#E2DED4]">
          <CheckCircle2 className="w-6 h-6 text-[#4E7A51] mx-auto mb-2 opacity-90" />
          <p className="text-xs font-medium text-[#1F2A38]">All domain metrics operating within standard baseline thresholds.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnomalies.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const rec = getRecommendationForItem(item, idx);

            return (
              <div
                key={item.id || idx}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  item.severity === 'Critical'
                    ? 'border-[#A6402F]/30 bg-[#A6402F]/5'
                    : 'border-[#E2DED4] bg-[#F5F4F0] hover:border-[#3E5C76]/30'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg mt-0.5 border ${
                      item.severity === 'Critical' ? 'bg-[#A6402F]/15 text-[#A6402F] border-[#A6402F]/30' : 'bg-[#C48A2E]/15 text-[#C48A2E] border-[#C48A2E]/30'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                          {item.severity}
                        </span>
                        <span className="text-xs font-medium text-[#8A8578] flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#8A8578]" />
                          {item.category}
                        </span>
                        {item.location && (
                          <span className="text-xs font-medium text-[#8A8578] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#3E5C76]" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-[#1F2A38] mt-1.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#8A8578] mt-1 bg-[#DCD7CC] px-2 py-0.5 rounded-md border border-[#E2DED4] inline-block font-medium">
                        {item.metric}
                      </p>
                    </div>
                  </div>

                  {/* Expand / Accordion Action */}
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#DCD7CC] hover:bg-[#F5F4F0] text-[#1F2A38] border border-[#E2DED4] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#3E5C76]" />
                      <span>AI Recommendation</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Gemini AI Multi-Factor Reasoning Accordion */}
                {isExpanded && (
                  <div className="px-5 py-4 bg-[#DCD7CC] border-t border-[#E2DED4] text-xs space-y-3">
                    
                    <div className="flex items-center justify-between border-b border-[#E2DED4] pb-2">
                      <div className="flex items-center space-x-2 text-[#1F2A38] font-semibold">
                        <Cpu className="w-3.5 h-3.5 text-[#3E5C76]" />
                        <span>AI Diagnostic Reasoning</span>
                      </div>
                      {rec?.estimatedSavingsOrSafetyGain && (
                        <span className="px-2.5 py-0.5 bg-[#4E7A51]/15 text-[#4E7A51] border border-[#4E7A51]/30 rounded-full font-semibold text-xs">
                          Gain: {rec.estimatedSavingsOrSafetyGain}
                        </span>
                      )}
                    </div>

                    {/* Recommendation Title & Body */}
                    <div>
                      <h4 className="font-bold text-[#1F2A38] text-xs flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-[#3E5C76]" />
                        {rec?.title || 'Actionable Operational Fix'}
                      </h4>
                      <p className="text-[#8A8578] text-xs mt-1 leading-relaxed pl-4">
                        {rec?.recommendation || item.details?.description || 'Reallocate schedule to avoid operational hazard.'}
                      </p>
                    </div>

                    {/* Cited Evidence & Factors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      
                      {/* Factor Citations */}
                      <div className="bg-[#F5F4F0] p-3 rounded-lg border border-[#E2DED4]">
                        <span className="font-semibold text-[#1F2A38] flex items-center gap-1.5 mb-2">
                          <FileText className="w-3.5 h-3.5 text-[#3E5C76]" />
                          Evidence & Cited Factors:
                        </span>
                        <ul className="space-y-1 text-[#8A8578] list-disc list-inside text-xs">
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
                      <div className="bg-[#F5F4F0] p-3 rounded-lg border border-[#E2DED4]">
                        <span className="font-semibold text-[#1F2A38] flex items-center gap-1.5 mb-2">
                          <Zap className="w-3.5 h-3.5 text-[#4E7A51]" />
                          Recommended Step-by-Step Action:
                        </span>
                        <p className="text-[#8A8578] text-xs leading-relaxed">
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

