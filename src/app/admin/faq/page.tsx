'use client';

import { useAdminStore, FAQ } from '@/lib/adminStore';
import { toast, modal } from '@/lib/uiStore';
import { Plus, Edit2, Trash2, ChevronDown, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AdminFAQPage() {
  const { faqs, updateFaq } = useAdminStore();
  const [localFaqs, setLocalFaqs] = useState<FAQ[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const qRef = useRef<HTMLInputElement>(null);
  const aRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalFaqs(faqs);
  }, [faqs]);

  const handleSaveAll = () => {
    // In a real app we would dispatch an update array to the store
    // For now we assume local state is enough, but we should sync it
    localFaqs.forEach((faq, i) => updateFaq(i, faq));
    modal.alert('FAQ Settings Saved!', 'Success');
  };

  const handleEdit = (i: number) => {
    setEditingIdx(i);
    setOpenIdx(i);
  };

  const saveEdit = (i: number) => {
    if (!qRef.current?.value || !aRef.current?.value) return;
    const newFaqs = [...localFaqs];
    newFaqs[i] = { question: qRef.current.value, answer: aRef.current.value };
    setLocalFaqs(newFaqs);
    setEditingIdx(null);
  };

  const addNew = () => {
    setLocalFaqs([...localFaqs, { question: 'New Question?', answer: 'Draft Answer' }]);
    setEditingIdx(localFaqs.length);
    setOpenIdx(localFaqs.length);
  };

  const removeFaq = async (i: number) => {
    if (await modal.confirm('Delete this question?', 'Confirm Deletion')) {
      setLocalFaqs(localFaqs.filter((_, idx) => idx !== i));
      if (openIdx === i) setOpenIdx(null);
    }
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">FAQ Manager</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Add or edit frequently asked questions shown to customers.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addNew} className="flex items-center gap-2 bg-white text-[#2B2B2B] px-5 py-2.5 border border-[#EADFD8] rounded-xl font-medium text-[13px] hover:bg-[#F8F5F2] transition-colors shadow-sm">
            <Plus size={16} /> Add FAQ
          </button>
          <button onClick={handleSaveAll} className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-6 py-2.5 rounded-xl font-medium text-[13px] hover:bg-[#D5B86A] transition-colors shadow-sm">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Area */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm sticky top-6">
             <h3 className="text-[15px] font-bold text-[#2B2B2B] pb-4 border-b border-[#EADFD8] mb-4">Edit Questions</h3>
             
             <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {localFaqs.map((faq, i) => (
                  <div key={i} className={`p-4 rounded-xl border transition-colors ${editingIdx === i ? 'border-[#E6C97A] bg-[#E6C97A]/5 shadow-sm' : 'border-[#EADFD8] bg-[#F8F5F2]'}`}>
                    {editingIdx === i ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#7A7A7A] uppercase tracking-wider">Question</label>
                          <input type="text" ref={qRef} defaultValue={faq.question} className="w-full bg-white border border-[#EADFD8] rounded-lg py-2 px-3 text-[13px]" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#7A7A7A] uppercase tracking-wider">Answer</label>
                          <textarea ref={aRef} defaultValue={faq.answer} rows={3} className="w-full bg-white border border-[#EADFD8] rounded-lg py-2 px-3 text-[13px] resize-none" />
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-[#EADFD8]">
                          <button onClick={() => setEditingIdx(null)} className="text-[12px] font-bold text-[#AFAFAF] hover:text-[#2B2B2B] px-3 py-1.5">Cancel</button>
                          <button onClick={() => saveEdit(i)} className="bg-[#E6C97A] text-[#5a4a1e] px-4 py-1.5 rounded-lg text-[12px] font-bold shadow-sm">Keep</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[14px] font-bold text-[#2B2B2B]">{faq.question}</p>
                           <p className="text-[13px] text-[#7A7A7A] mt-1 line-clamp-1">{faq.answer}</p>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-4">
                          <button onClick={() => handleEdit(i)} className="p-1.5 text-[#AFAFAF] hover:text-[#E6C97A] hover:bg-white rounded-md"><Edit2 size={14} /></button>
                          <button onClick={() => removeFaq(i)} className="p-1.5 text-[#AFAFAF] hover:text-red-500 hover:bg-white rounded-md"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Public Preview */}
        <div>
          <h3 className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-4 px-2">Live Accordion Preview</h3>
          <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm p-8 space-y-2">
            
            <div className="text-center mb-10">
              <span className="text-[20px]">☀️</span>
              <h2 className="font-serif text-xl font-bold text-[#2B2B2B] mt-2 tracking-wide">Help & Answers</h2>
            </div>

            {localFaqs.map((faq, i) => (
              <div key={i} className="border-b border-[#EADFD8] last:border-0">
                <button 
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full py-4 flex justify-between items-center text-left"
                >
                  <span className={`text-[15px] font-bold font-serif ${openIdx === i ? 'text-[#E6C97A]' : 'text-[#2B2B2B]'}`}>{faq.question}</span>
                  <ChevronDown className={`transition-transform duration-300 text-[#AFAFAF] ${openIdx === i ? 'rotate-180 text-[#E6C97A]' : ''}`} size={18} />
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: openIdx === i ? 200 : 0, opacity: openIdx === i ? 1 : 0 }}
                >
                  <p className="pb-5 text-[14px] text-[#7A7A7A] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
