'use client';

import { useAdminStore, FAQ } from '@/lib/adminStore';
import { modal } from '@/lib/uiStore';
import { Plus, Edit2, Trash2, ChevronDown, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import BilingualField from '@/components/admin/BilingualField';
import { emptyLocalized, parseLocalized, pickLocalized } from '@/lib/localizedText';
import type { LocalizedText } from '@/lib/localizedText';

export default function AdminFAQPage() {
  const { faqs, saveAllFaqs } = useAdminStore();
  const [localFaqs, setLocalFaqs] = useState<FAQ[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [draft, setDraft] = useState<{ question: LocalizedText; answer: LocalizedText }>({
    question: emptyLocalized(),
    answer: emptyLocalized(),
  });

  useEffect(() => {
    setLocalFaqs(faqs);
  }, [faqs]);

  const handleSaveAll = async () => {
    try {
      await saveAllFaqs(localFaqs);
      modal.alert('FAQ Settings Saved!', 'Success');
    } catch {
      modal.alert('Failed to save FAQs. Please try again.', 'Error');
    }
  };

  const handleEdit = (i: number) => {
    const faq = localFaqs[i];
    setDraft({
      question: parseLocalized(faq.question),
      answer: parseLocalized(faq.answer),
    });
    setEditingIdx(i);
    setOpenIdx(i);
  };

  const saveEdit = (i: number) => {
    if (!draft.question.hy.trim() || !draft.answer.hy.trim()) return;
    const newFaqs = [...localFaqs];
    newFaqs[i] = {
      ...newFaqs[i],
      question: {
        hy: draft.question.hy.trim(),
        en: (draft.question.en || draft.question.hy).trim(),
      },
      answer: {
        hy: draft.answer.hy.trim(),
        en: (draft.answer.en || draft.answer.hy).trim(),
      },
    };
    setLocalFaqs(newFaqs);
    setEditingIdx(null);
  };

  const addNew = () => {
    const next: FAQ = {
      question: { hy: 'Նոր հարց?', en: 'New question?' },
      answer: { hy: 'Պատասխանի տարբերակ', en: 'Draft answer' },
    };
    setLocalFaqs([...localFaqs, next]);
    setDraft({
      question: parseLocalized(next.question),
      answer: parseLocalized(next.answer),
    });
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

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">FAQ Manager</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Add or edit FAQs in Armenian and English.</p>
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

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm sticky top-6">
             <h3 className="text-[15px] font-bold text-[#2B2B2B] pb-4 border-b border-[#EADFD8] mb-4">Edit Questions</h3>

             <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {localFaqs.map((faq, i) => (
                  <div key={i} className={`p-4 rounded-xl border transition-colors ${editingIdx === i ? 'border-[#E6C97A] bg-[#E6C97A]/5 shadow-sm' : 'border-[#EADFD8] bg-[#F8F5F2]'}`}>
                    {editingIdx === i ? (
                      <div className="space-y-4">
                        <BilingualField
                          label="Question"
                          value={draft.question}
                          onChange={(question) => setDraft((d) => ({ ...d, question }))}
                          required
                        />
                        <BilingualField
                          label="Answer"
                          value={draft.answer}
                          onChange={(answer) => setDraft((d) => ({ ...d, answer }))}
                          multiline
                          required
                        />
                        <div className="flex justify-end gap-2 pt-2 border-t border-[#EADFD8]">
                          <button onClick={() => setEditingIdx(null)} className="text-[12px] font-bold text-[#AFAFAF] hover:text-[#2B2B2B] px-3 py-1.5">Cancel</button>
                          <button onClick={() => saveEdit(i)} className="bg-[#E6C97A] text-[#5a4a1e] px-4 py-1.5 rounded-lg text-[12px] font-bold shadow-sm">Keep</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[14px] font-bold text-[#2B2B2B]">{pickLocalized(faq.question, 'hy')}</p>
                           <p className="text-[12px] text-[#AFAFAF] mt-0.5">{pickLocalized(faq.question, 'en')}</p>
                           <p className="text-[13px] text-[#7A7A7A] mt-1 line-clamp-1">{pickLocalized(faq.answer, 'hy')}</p>
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

        <div>
          <h3 className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-4 px-2">Live Accordion Preview (HY)</h3>
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
                  <span className={`text-[15px] font-bold font-serif ${openIdx === i ? 'text-[#E6C97A]' : 'text-[#2B2B2B]'}`}>{pickLocalized(faq.question, 'hy')}</span>
                  <ChevronDown className={`transition-transform duration-300 text-[#AFAFAF] ${openIdx === i ? 'rotate-180 text-[#E6C97A]' : ''}`} size={18} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: openIdx === i ? 200 : 0, opacity: openIdx === i ? 1 : 0 }}
                >
                  <p className="pb-5 text-[14px] text-[#7A7A7A] leading-relaxed">
                    {pickLocalized(faq.answer, 'hy')}
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
