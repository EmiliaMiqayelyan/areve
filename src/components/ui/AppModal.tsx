'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/lib/uiStore';

export function AppModal() {
  const { modal, closeModal } = useUIStore();
  const { isOpen, type, title, message, onConfirm, onCancel } = modal;

  if (!isOpen && !message) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-[#2B2B2B]/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-[rgba(180,156,140,0.25)] overflow-hidden border border-[#EADFD8]"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'confirm' ? 'bg-[#E6C97A]/10 text-[#E6C97A]' : 'bg-[#F8F5F2] text-[#2B2B2B]'}`}>
                    {type === 'confirm' ? <AlertCircle size={22} /> : <Info size={22} />}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2B2B2B] leading-none">{title}</h3>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-[#F8F5F2] rounded-full transition-colors text-[#AFAFAF] hover:text-[#2B2B2B]">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-10">
                <p className="text-[15px] text-[#7A7A7A] leading-relaxed font-medium">
                  {message}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {type === 'confirm' && (
                  <button
                    onClick={() => onCancel?.()}
                    className="flex-1 py-3.5 rounded-2xl border border-[#EADFD8] text-[#7A7A7A] font-bold text-[13px] uppercase tracking-wider hover:bg-[#F8F5F2] transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => onConfirm?.()}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-[13px] uppercase tracking-wider shadow-sm transition-all transform active:scale-95 ${
                    type === 'confirm' 
                      ? 'bg-[#E6C97A] text-[#5a4a1e] hover:bg-[#D5B86A]' 
                      : 'bg-[#2B2B2B] text-white hover:bg-[#404040]'
                  }`}
                >
                  {type === 'confirm' ? 'Confirm' : 'Got it'}
                </button>
              </div>
            </div>

            {/* Decorative Edge */}
            <div className={`h-1.5 w-full ${type === 'confirm' ? 'bg-[#E6C97A]' : 'bg-[#2B2B2B]'}`} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
