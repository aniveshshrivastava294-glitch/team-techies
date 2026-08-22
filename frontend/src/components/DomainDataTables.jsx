import React, { useState, useEffect } from 'react';
import { Database, Search, Building2, Calendar, Wrench, Bus, Zap, Users } from 'lucide-react';

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
    <div className="inst-card p-6 border border-[#E2DED4] bg-[#DCD7CC] shadow-xs mb-6 font-sans">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2DED4]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#3E5C76]/15 border border-[#3E5C76]/30 rounded-lg text-[#3E5C76]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1F2A38] tracking-tight">Domain Datasets Inspector</h2>
            <p className="text-xs text-[#8A8578] mt-0.5">
              Inspect underlying records across the 6 campus operational domains
            </p>
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F5F4F0] p-1 rounded-lg border border-[#E2DED4]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#3E5C76] text-white shadow-xs font-semibold'
                    : 'text-[#8A8578] hover:text-[#1F2A38] hover:bg-[#DCD7CC]'
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
          <Search className="w-4 h-4 text-[#8A8578] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter ${activeTab} records...`}
            className="w-full bg-[#F5F4F0] border border-[#E2DED4] text-[#1F2A38] placeholder-[#8A8578]/60 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#3E5C76]"
          />
        </div>
        <span className="text-xs text-[#8A8578] font-medium">
          Showing {filteredData.length} of {tableData.length} records
        </span>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="py-12 text-center text-[#8A8578]">
          <div className="w-6 h-6 border-2 border-[#3E5C76] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Fetching domain records...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="py-8 text-center text-[#8A8578] text-xs bg-[#F5F4F0] rounded-xl border border-[#E2DED4]">
          No records found matching query filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E2DED4] bg-[#F5F4F0]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#DCD7CC] border-b border-[#E2DED4] text-[#1F2A38] text-xs">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold capitalize">
                    {col.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DED4] text-[#1F2A38]">
              {filteredData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#E2DED4]/30 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 max-w-[220px] truncate text-xs">
                      {row[col] === null || row[col] === undefined ? (
                        <span className="text-[#8A8578] italic">null</span>
                      ) : String(row[col]).startsWith('2026') || String(row[col]).includes('T') ? (
                        <span className="text-[#8A8578]">{new Date(row[col]).toLocaleString()}</span>
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

