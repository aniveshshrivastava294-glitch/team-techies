import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, X, Users, ArrowRight } from 'lucide-react';

export default function BulkFacultyUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file && (!rawText || rawText.trim() === '')) {
      setError('Please select a .PDF / .XLSX file or paste raw faculty text.');
      return;
    }

    setIsUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('rawText', rawText);
    }

    try {
      const res = await fetch('/api/upload/upload-faculty', {
        method: 'POST',
        body: file ? formData : JSON.stringify({ rawText }),
        headers: file ? {} : { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.status === 'success') {
        setResult(data);
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Failed to process AI bulk document extraction');
      }
    } catch (err) {
      setError(`Upload Exception: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AI-Powered Bulk Faculty Extraction & Onboarding
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md">
                Gemini API
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload `.pdf` or `.xlsx` faculty lists. Gemini extracts names, emails, & roles into Supabase
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          /* Success Screen */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Bulk Onboarding Complete!</h4>
                <p>{result.message}</p>
              </div>
            </div>

            {/* Extracted JSON Preview Table */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 max-h-60 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Gemini Extracted User Array ({result.count} Records):
              </span>
              <div className="space-y-2 font-mono text-xs">
                {result.users?.map((u, i) => (
                  <div key={i} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">{u.full_name}</span>
                      <span className="text-slate-400 text-[11px]">{u.email}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] uppercase font-bold">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* Upload Drag & Drop Zone */
          <div className="space-y-4 text-xs">
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-8 text-center bg-slate-900/40 transition-colors"
            >
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-slate-200">
                Drag and drop your faculty `.pdf` or `.xlsx` document here
              </p>
              <p className="text-[11px] text-slate-500 mt-1">or select file from computer</p>
              
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="mt-3 inline-block px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl font-bold transition-all cursor-pointer"
              >
                Browse File
              </label>

              {file && (
                <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 inline-flex items-center space-x-2 text-xs font-mono text-purple-300">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {/* Manual Raw Text Fallback */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Manual Text Fallback (Paste Unstructured Faculty Roster):
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Dr. Alan Grant, agrant@campus.edu, Professor of Paleontology..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <span>Gemini API Parsing & Extracting Faculty Array...</span>
              ) : (
                <>
                  <span>Run AI Document Extraction & Bulk Insert</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
