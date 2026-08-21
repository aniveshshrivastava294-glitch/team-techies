import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiOverview from './components/KpiOverview';
import AnomaliesPanel from './components/AnomaliesPanel';
import ChatWidget from './components/ChatWidget';
import Visualizers from './components/Visualizers';
import DomainDataTables from './components/DomainDataTables';

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [datasource, setDatasource] = useState('Local Synthetic Store');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [health, setHealth] = useState(null);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch KPIs
      const kpiRes = await fetch('/api/kpis');
      const kpiData = await kpiRes.json();
      if (kpiData.status === 'success') {
        setKpis(kpiData.kpis);
        setDatasource(kpiData.datasource);
      }

      // 2. Fetch Anomalies
      const anomRes = await fetch('/api/anomalies');
      const anomData = await anomRes.json();
      if (anomData.status === 'success') {
        setAnomalies(anomData.anomalies || []);
      }

      // 3. Fetch Recommendations
      const recRes = await fetch('/api/recommendations');
      const recData = await recRes.json();
      if (recData.status === 'success') {
        setRecommendations(recData.recommendations || []);
      }

      // 4. Health Check
      const healthRes = await fetch('/api/health');
      const healthData = await healthRes.json();
      setHealth(healthData);

    } catch (err) {
      console.error('Error fetching dashboard payload:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Sticky Header */}
      <Header
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        datasource={datasource}
        health={health}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 mb-12">
        
        {/* Executive KPI Overview */}
        <KpiOverview kpis={kpis} />

        {/* Top Grid Layout: Anomalies Panel & NL Chat Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-7">
            <AnomaliesPanel
              anomalies={anomalies}
              recommendations={recommendations}
              isLoading={isRefreshing}
            />
          </div>

          <div className="lg:col-span-5">
            <ChatWidget />
          </div>
        </div>

        {/* Interactive Visualizers Section */}
        <Visualizers kpis={kpis} anomalies={anomalies} />

        {/* Siloed Domain Raw Data Table Inspector */}
        <DomainDataTables />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Campus Intelligence Dashboard (Problem SW-01-P) &bull; Production Prototype</span>
          <span className="text-slate-400">Powered by Groq Text-to-SQL + Gemini 2.5 Multi-Factor Synthesis</span>
        </div>
      </footer>

    </div>
  );
}
