import React, { useState, useEffect } from 'react';
import { Database, Search, Building2, Calendar, Wrench, Bus, Zap, Users, Filter } from 'lucide-react';

export default function DomainDataTables() {
  const [activeTab, setActiveTab] = useState('classrooms');
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'classrooms', label: 'Classrooms', icon: Building2 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'transportation', label: 'Transportation', icon: Bus },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'attendance', label: 'Attendance', icon: Users }
  ];

  useEffect(() => {
    fetchDomainData(activeTab);
  }, [activeTab]);

  const fetchDomainData = async (domain) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/domains/${domain}`);
      const data = await res.json();
      if (data.status === 'success') {
        setTableData(data.records || []);
      }
    } catch (e) {
      console.error('Error fetching domain table:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = tableData.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Siloed Domain Datasets Inspector</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect underlying raw PostgreSQL records across the 6 campus operational systems
            </p>
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter ${activeTab} records...`}
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredData.length} of {tableData.length} records
        </span>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Fetching domain records from Supabase layer...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800">
          No records found matching query filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold">
                    {col.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 max-w-[220px] truncate">
                      {row[col] === null || row[col] === undefined ? (
                        <span className="text-slate-600 italic">null</span>
                      ) : String(row[col]).startsWith('2026') || String(row[col]).includes('T') ? (
                        <span className="text-slate-400">{new Date(row[col]).toLocaleString()}</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
