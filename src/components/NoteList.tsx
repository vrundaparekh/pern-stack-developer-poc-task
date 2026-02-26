'use client';
import { useEffect, useState } from 'react';
import DeleteModal from './DeleteModal';
import { Pencil, Trash2, Check, X, RotateCw, Search } from 'lucide-react';

export default function NoteList() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error("Backend Error:", data);
        setNotes([]); 
      }
    } catch (error) {
      console.error("Network Error:", error);
      setNotes([]);
    }
  };
 
const filteredNotes = Array.isArray(notes) 
  ? notes.filter((note: any) => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  const startEdit = (note: any) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id: number) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: editTitle, content: editContent }),
  });

  if (res.ok) {
    setEditingId(null);
    setEditTitle('');   
    setEditContent(''); 
    fetchNotes();
  }
};

  const openDeleteModal = (id: number) => {
    setSelectedNoteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedNoteId) {
      await fetch(`/api/notes/${selectedNoteId}`, { method: 'DELETE' });
      setIsModalOpen(false);
      fetchNotes();
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <div className="mt-10 space-y-6">
      {/* Search Input Section */}
      <div className="relative group">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
    <Search size={18} />
  </div>
  <input
    type="text"
    placeholder="Search notes by title or content..."
    className="w-full p-4 pl-12 rounded-2xl outline-none transition-all 
                   bg-white border border-slate-200 text-slate-900 
                   dark:bg-[#0f172a] dark:border-slate-800 dark:text-white
                   shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>

      <div className="flex justify-between items-center">
<h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Notes</h2>
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredNotes.length} Results
          </span>
          <button onClick={fetchNotes} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <RotateCw size={18} className="text-slate-500" />
        </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note: any) => (
             <div key={note.id} className="p-6 transition-all duration-300
                          bg-white border border-slate-200 rounded-2xl shadow-sm
                          dark:bg-[#0f172a] dark:border-slate-800 hover:shadow-md">
             
          {editingId === note.id ? (
            <div className="space-y-3">
              <input 
                     className="w-full p-2 border rounded-lg font-bold bg-transparent dark:text-white text-slate-900"
                value={editTitle}   
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea 
                     className="w-full p-2 border rounded-lg bg-transparent  text-slate-600 dark:text-slate-400"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                     <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X size={20}/></button>
                <button onClick={() => handleUpdate(note.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Check size={20}/></button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start group">
                   <div className="flex-1 space-y-3">
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white">{note.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">{note.content}</p>
              </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4 ">
                     <button onClick={() => startEdit(note)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><Pencil size={18} /></button>
                     <button onClick={() => openDeleteModal(note.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          )}
        </div>
          ))
        ) : (
         <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50">
          <p className="text-slate-400 italic">No notes found matching your search.</p>
        </div>
        )}
      </div>

      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}