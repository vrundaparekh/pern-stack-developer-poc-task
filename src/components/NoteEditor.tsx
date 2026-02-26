'use client';
import { useState } from 'react';
import { Sparkles, Wand2, Hash, Loader2 } from 'lucide-react';

export default function NoteEditor({ onSaveSuccess }: { onSaveSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error' | 'ai-processing'>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success') => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};
  
  const processAI = async (mode: 'summary' | 'improve' | 'tags') => {
  if (!content) return;
  setStatus('ai-processing');

  try {
    const res = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mode }),
    });
    const data = await res.json();

    if (mode === 'improve' || mode === 'summary') {
      setContent(data.output); 
    } else if (mode === 'tags') {
      setTitle((prev) => `${data.output.toUpperCase()} | ${prev}`);
    }
    
    setStatus('idle'); 

  } catch (error) {
    setStatus('error');
  }
};

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showToast("Title and content cannot be empty!", "error");
      return;
    }
    setStatus('saving');
    try {
      const res = await fetch('/api/notes', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        showToast("Note saved successfully!", "success");
        setTitle('');
        setContent('');
        onSaveSuccess();
        setStatus('idle');
      } else {
        setStatus('error');
        showToast("Failed to save note.", "error");
      }
    } catch (e) {
      setStatus('error');
      showToast("Server error. Try again.", "error");
    }
  };

 return (
  
 <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl transition-all duration-300
                bg-white border border-slate-200 shadow-sm
                dark:bg-[#0f172a] dark:border-slate-800 dark:shadow-none">
 <div className="space-y-4">
 <input 
  className="w-full text-3xl font-bold bg-transparent outline-none p-0
             text-slate-900 dark:text-white placeholder:text-slate-300"
  placeholder="Note Title..." 
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
<div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
 </div>
<textarea 
  className="min-h-[250px] w-full text-lg leading-relaxed bg-transparent outline-none p-0 resize-none
             text-slate-700 dark:text-slate-300 placeholder:text-slate-300"
  placeholder="Start writing..." 
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>
<div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800 gap-4">
  
  <div className="flex flex-wrap items-center gap-3">
    <button 
      onClick={() => processAI('improve')}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md"
    >
      <Wand2 size={16} /> AI Improve
    </button>
    <button 
        onClick={() => processAI('summary')}
        disabled={status !== 'idle'}
       className="flex items-center gap-1.5 font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm " >
        <Sparkles size={14} /> Summarize
      </button>
    <button 
        onClick={() => processAI('tags')}
        disabled={status !== 'idle'}
       className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors">
        <Hash size={14} /> Auto-Tags
      </button>
    
    <div className="text-xs font-medium ml-2">
      {status === 'saving' && <span className="text-blue-500 animate-pulse">Saving...</span>}
      {status === 'ai-processing' && <span className="text-purple-500 animate-pulse flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> processing...</span>}
      {status === 'success' && <span className="text-green-600">✓ Saved</span>}
    </div>
  </div>

  <button 
    onClick={handleSave}
    disabled={status !== 'idle' || !title.trim() || !content.trim()}
    className={`px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all
    ${(!title.trim() || !content.trim()) 
      ? 'bg-slate-300 cursor-not-allowed text-slate-500 opacity-50' 
      : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90'
    }`}
  >
    Save Note
  </button>
</div>

    {toast && (
  <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl transition-all animate-bounce z-50
    ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
    <div className="flex items-center gap-2 font-bold">
      {toast.type === 'error' ? '✕' : '✓'} {toast.message}
    </div>
  </div>
)}
  </div>
);
}