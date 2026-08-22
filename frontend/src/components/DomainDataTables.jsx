import React, { useState, useEffect } from 'react';
import { Database, Search, Building2, Calendar, Wrench, Bus, Zap, Users } from 'lucide-react';

export default function DomainDataTables({ defaultDomain = 'classrooms' }) {
  const [activeTab, setActiveTab] = useState(defaultDomain);
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
    <div className="card-surface p-5 mb-6 font-sans shadow-2xs">
      
      {/* Header & Category Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E6E0D2]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-[#F0EBE1] border border-[#E6E0D2] text-[#1C1917]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1C1917]">Campus Data Inspector</h2>
            <p className="text-xs text-[#57534E] font-medium mt-0.5">
              Inspect underlying records across the 6 campus operational systems.
            </p>
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0 whitespace-nowrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'
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
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab} records...`}
            className="w-full bg-[#F0EBE1] border border-[#E6E0D2] text-[#1C1917] placeholder-[#78716C] text-xs rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#1C1917] font-bold"
          />
        </div>
        <span className="text-[11px] text-[#57534E] font-mono font-semibold">
          Showing {filteredData.length} of {tableData.length} records
        </span>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="py-8 text-center text-[#78716C]">
          <p className="text-xs font-mono font-semibold">Loading data records...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="py-6 text-center text-[#57534E] text-xs bg-[#F0EBE1] rounded-lg border border-[#E6E0D2] font-semibold">
          No records found matching search query.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#E6E0D2] rounded-md">
          <table className="table-mono">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>
                    {col.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="max-w-[200px] truncate font-mono">
                      {row[col] === null || row[col] === undefined ? (
                        <span className="text-[#78716C] italic font-semibold">null</span>
                      ) : String(row[col]).startsWith('2026') || String(row[col]).includes('T') ? (
                        <span className="text-[#57534E] font-semibold">{new Date(row[col]).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-[#1C1917] font-bold">{String(row[col])}</span>
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
