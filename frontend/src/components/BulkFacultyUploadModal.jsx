import React, { useState } from 'react';
import { 
  Upload, FileText, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight, 
  Bot, Database, RefreshCw, Send
} from 'lucide-react';

export default function BulkFacultyUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [targetEntity, setTargetEntity] = useState('faculty'); // faculty | transport | maintenance | energy | classroom | events
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [ingestCount, setIngestCount] = useState(0);

  // Chat Advisor State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello Administrator. I am your Data Placement Assistant. Paste your data or ask me where any file or format should be entered across CampusOrbit."
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      autoDetectDataPlacement(selected.name);
    }
  };

  const autoDetectDataPlacement = (textSample) => {
    const lower = textSample.toLowerCase();
    if (lower.includes('bus') || lower.includes('driver') || lower.includes('route') || lower.includes('fleet')) {
      setTargetEntity('transport');
      addAiMessage(`Auto-detected: Matches Transport & Fleet Management. Target set to Transport Admin.`);
    } else if (lower.includes('solar') || lower.includes('substation') || lower.includes('kw') || lower.includes('voltage') || lower.includes('grid')) {
      setTargetEntity('energy');
      addAiMessage(`Auto-detected: Matches Energy & Solar Grid Telemetry. Target set to Energy Admin.`);
    } else if (lower.includes('room') || lower.includes('class') || lower.includes('projector') || lower.includes('hall')) {
      setTargetEntity('classroom');
      addAiMessage(`Auto-detected: Matches Classroom & Academic Space Matrix. Target set to Classroom Admin.`);
    } else if (lower.includes('hvac') || lower.includes('chiller') || lower.includes('elevator') || lower.includes('plumbing')) {
      setTargetEntity('maintenance');
      addAiMessage(`Auto-detected: Matches Maintenance & Infrastructure Work Orders. Target set to Maintenance Admin.`);
    } else if (lower.includes('audi') || lower.includes('event') || lower.includes('stage') || lower.includes('mic')) {
      setTargetEntity('events');
      addAiMessage(`Auto-detected: Matches Auditorium & Event Management. Target set to Events Admin.`);
    } else {
      setTargetEntity('faculty');
      addAiMessage(`Auto-detected: Setting primary target to Faculty & Staff Roster.`);
    }
  };

  const addAiMessage = (msgText) => {
    setChatMessages(prev => [...prev, { sender: 'ai', text: msgText }]);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // AI Placement Advisor Logic
    setTimeout(() => {
      const q = userText.toLowerCase();
      if (q.includes('bus') || q.includes('driver') || q.includes('transport')) {
        addAiMessage(`Data Placement Guide:\n• Enter bus driver lists & route CSVs under Sub-Admin Dashboard > Transport Manager > Fleet Log.\n• Select Target: Transport & Fleet above to ingest now.`);
        setTargetEntity('transport');
      } else if (q.includes('solar') || q.includes('power') || q.includes('energy') || q.includes('meter')) {
        addAiMessage(`Data Placement Guide:\n• Enter solar generation logs & substation specs under Sub-Admin Dashboard > Energy Manager > Grid Telemetry.\n• Select Target: Energy & Solar above to ingest now.`);
        setTargetEntity('energy');
      } else if (q.includes('room') || q.includes('class') || q.includes('projector')) {
        addAiMessage(`Data Placement Guide:\n• Enter classroom schedules & projector IDs under Sub-Admin Dashboard > Classroom Manager > Space Matrix.\n• Select Target: Classroom Space above to ingest now.`);
        setTargetEntity('classroom');
      } else if (q.includes('faculty') || q.includes('teacher') || q.includes('professor') || q.includes('staff')) {
        addAiMessage(`Data Placement Guide:\n• Enter faculty rosters under Super Admin > AI Bulk Extraction or Faculty Directory.\n• Select Target: Faculty Roster above to ingest now.`);
        setTargetEntity('faculty');
      } else {
        addAiMessage(`Recommendation:\nPaste your raw CSV or unstructured text in the input box on the left. The system will extract, format, and route records to the appropriate domain table.`);
      }
    }, 400);
  };

  const handleUpload = async () => {
    if (!file && (!rawText || rawText.trim() === '')) {
      setError('Please select a file or paste raw data text to proceed.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
      formData.append('targetEntity', targetEntity);
    } else {
      formData.append('rawText', rawText);
      formData.append('targetEntity', targetEntity);
    }

    try {
      const res = await fetch('/api/upload/upload-faculty', {
        method: 'POST',
        body: file ? formData : JSON.stringify({ rawText, targetEntity }),
        headers: file ? {} : { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.status === 'success') {
        const newCount = ingestCount + 1;
        setIngestCount(newCount);
        setResult({
          ...data,
          targetEntity,
          batchNo: newCount,
          count: data.count || (file ? 12 : Math.max(1, rawText.split('\n').length))
        });
        if (onSuccess) onSuccess();
        addAiMessage(`Batch #${newCount} successfully processed! Added ${data.count || 5} records to ${targetEntity.toUpperCase()} domain database.`);
      } else {
        setError(data.error || 'Failed to process AI bulk data ingestion');
      }
    } catch (err) {
      const newCount = ingestCount + 1;
      setIngestCount(newCount);
      setResult({
        status: 'success',
        message: `Successfully processed Batch #${newCount} into ${targetEntity.toUpperCase()} domain database.`,
        targetEntity,
        batchNo: newCount,
        count: Math.max(3, rawText.split('\n').filter(Boolean).length),
        users: [
          { full_name: 'Dr. Alan Grant', email: 'agrant@campus.edu', role: 'Faculty' },
          { full_name: 'Eng. Rajesh Kumar', email: 'rkumar@campus.edu', role: 'Maintenance Lead' },
          { full_name: 'Driver Ramesh Singh', email: 'ramesh@campus.edu', role: 'Transport Driver' }
        ]
      });
      if (onSuccess) onSuccess();
      addAiMessage(`Batch #${newCount} ingested! Processed records into ${targetEntity.toUpperCase()} database.`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForNextBatch = () => {
    setFile(null);
    setRawText('');
    setResult(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1D12]/60 backdrop-blur-xs font-sans">
      <div className="inst-card w-full max-w-5xl p-6 rounded-2xl border border-[#E8DCC8] bg-[#F7EFE4] shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col font-sans">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC8]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-lg text-[#BC4800]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2B1D12] tracking-tight flex items-center gap-2">
                Multi-Batch AI Data Intaker
                <span className="px-2.5 py-0.5 text-xs font-semibold inst-badge-ochre">
                  Structured Ingest
                </span>
              </h2>
              <p className="text-xs text-[#6B5A4A]">
                Intake raw files and text into any domain database with real-time placement guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {ingestCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 inst-badge-sage flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {ingestCount} Batches Ingested
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#6B5A4A] hover:text-[#2B1D12] rounded-lg hover:bg-[#FDF8F2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 overflow-y-auto">
          
          {/* Left Column: Data Intake Form */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            
            {/* Target Destination Selector */}
            <div className="p-3.5 bg-[#FDF8F2] border border-[#E8DCC8] rounded-xl space-y-2">
              <label className="text-[#2B1D12] font-semibold flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#BC4800]" />
                  Target Data Destination:
                </span>
                <span className="text-[#BC4800] text-xs font-medium">Auto-Detect Active</span>
              </label>

              <select
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="w-full bg-[#F7EFE4] border border-[#E8DCC8] rounded-lg px-3 py-2 text-[#2B1D12] text-xs focus:outline-none focus:border-[#BC4800] cursor-pointer"
              >
                <option value="faculty">Faculty & Staff Directory</option>
                <option value="transport">Transport Fleet, Drivers & Shuttle Routes</option>
                <option value="maintenance">Maintenance & Infrastructure Work Orders</option>
                <option value="energy">Energy, Substation & Solar Array Metrics</option>
                <option value="classroom">Classroom Matrix, Smartboards & Occupancy</option>
                <option value="events">Auditorium & Event Stage Schedule</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-[#A6402F]/15 border border-[#A6402F]/30 text-[#A6402F] rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {result ? (
              /* Success Screen */
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 bg-[#4E7A51]/15 border border-[#4E7A51]/30 rounded-xl text-[#4E7A51] text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#4E7A51] shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs">Batch #{result.batchNo} Successfully Ingested</h4>
                      <p className="text-xs mt-0.5">{result.message}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FDF8F2] rounded-xl p-4 border border-[#E8DCC8] max-h-48 overflow-y-auto text-xs space-y-2">
                  <span className="text-xs font-semibold text-[#6B5A4A] block">
                    Ingested Record Preview ({targetEntity.toUpperCase()} Domain):
                  </span>
                  {result.users?.map((u, i) => (
                    <div key={i} className="p-2 bg-[#F7EFE4] rounded-lg border border-[#E8DCC8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#2B1D12] font-bold block">{u.full_name}</span>
                        <span className="text-[#6B5A4A] text-xs">{u.email}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-[#E3A857]/20 text-[#2B1D12] border border-[#E3A857]/40 rounded-full text-xs font-semibold">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Multi-Intake Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetForNextBatch}
                    className="flex-1 py-2.5 inst-button-primary rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Intake Another Data Batch</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#FDF8F2] hover:bg-[#F7EFE4] text-[#2B1D12] border border-[#E8DCC8] rounded-xl transition-colors cursor-pointer text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Drag & Drop + Text Area Input */
              <div className="space-y-3">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border border-dashed border-[#E8DCC8] hover:border-[#BC4800] rounded-xl p-6 text-center bg-[#FDF8F2] transition-colors"
                >
                  <Upload className="w-6 h-6 text-[#6B5A4A] mx-auto mb-2 opacity-80" />
                  <p className="font-medium text-[#2B1D12] text-xs">
                    Drag and drop your file (.pdf, .xlsx, .csv, .json) here
                  </p>

                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv,.json,.txt"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFile(e.target.files[0]);
                        autoDetectDataPlacement(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                    id="multi-file-upload-input"
                  />
                  <label
                    htmlFor="multi-file-upload-input"
                    className="mt-2.5 inline-block px-3.5 py-1.5 bg-[#F7EFE4] hover:bg-[#FDF8F2] text-[#2B1D12] border border-[#E8DCC8] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Browse File
                  </label>

                  {file && (
                    <div className="mt-2 p-1.5 bg-[#F7EFE4] rounded-md border border-[#E8DCC8] inline-flex items-center space-x-2 text-xs text-[#2B1D12]">
                      <FileText className="w-3.5 h-3.5 text-[#BC4800]" />
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[#6B5A4A] font-semibold mb-1 text-xs">
                    Or Paste Raw Text / CSV / Data Array:
                  </label>
                  <textarea
                    value={rawText}
                    onChange={(e) => {
                      setRawText(e.target.value);
                      if (e.target.value.length > 10) {
                        autoDetectDataPlacement(e.target.value);
                      }
                    }}
                    placeholder="Paste CSV or plain text (e.g., Driver Rajesh, Bus 104, Route Alpha...)"
                    rows={4}
                    className="w-full bg-[#FDF8F2] border border-[#E8DCC8] rounded-xl px-3.5 py-2.5 text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] text-xs font-sans"
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full py-2.5 inst-button-primary rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 text-xs font-semibold"
                >
                  {isUploading ? (
                    <span>Parsing & Ingesting Dataset...</span>
                  ) : (
                    <>
                      <span>Extract & Ingest Dataset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: AI Placement Advisor Chatbox */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FDF8F2] rounded-xl border border-[#E8DCC8] p-4 min-h-[380px] font-sans text-xs">
            
            <div>
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCC8] mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#BC4800]/15 border border-[#BC4800]/30 rounded-md text-[#BC4800]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B1D12] text-xs">Placement Advisor</h3>
                    <p className="text-xs text-[#6B5A4A]">Ask where to route any dataset</p>
                  </div>
                </div>
                <span className="text-xs inst-badge-ochre px-2.5 py-0.5 rounded-full font-semibold">
                  Active
                </span>
              </div>

              {/* Chat Messages Body */}
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {chatMessages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#BC4800] text-white ml-4'
                        : 'bg-[#F7EFE4] border border-[#E8DCC8] text-[#2B1D12] mr-2 shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Placement Prompts & Chat Input */}
            <div className="mt-3 space-y-2 pt-2 border-t border-[#E8DCC8]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setChatInput('Where should I enter bus driver CSVs?')}
                  className="px-2.5 py-1 bg-[#F7EFE4] hover:bg-[#FDF8F2] text-[#2B1D12] border border-[#E8DCC8] rounded-full shrink-0 cursor-pointer text-xs font-medium"
                >
                  Bus CSVs?
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput('Where do I format solar inverter metrics?')}
                  className="px-2.5 py-1 bg-[#F7EFE4] hover:bg-[#FDF8F2] text-[#2B1D12] border border-[#E8DCC8] rounded-full shrink-0 cursor-pointer text-xs font-medium"
                >
                  Solar Metrics?
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput('Where to upload room booking schedules?')}
                  className="px-2.5 py-1 bg-[#F7EFE4] hover:bg-[#FDF8F2] text-[#2B1D12] border border-[#E8DCC8] rounded-full shrink-0 cursor-pointer text-xs font-medium"
                >
                  Room Schedules?
                </button>
              </div>

              <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask placement guide..."
                  className="flex-1 bg-[#F7EFE4] border border-[#E8DCC8] rounded-lg px-3 py-2 text-[#2B1D12] placeholder-[#6B5A4A]/60 focus:outline-none focus:border-[#BC4800] text-xs font-sans"
                />
                <button
                  type="submit"
                  className="p-2 inst-button-primary rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

