'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useUIStore, ToastType } from '@/lib/uiStore';

const toastConfig: Record<ToastType, { icon: any; color: string; bg: string; border: string }> = {
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  info: { icon: Info, color: 'text-[#E6C97A]', bg: 'bg-[#F8F5F2]', border: 'border-[#EADFD8]' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 min-w-[320px] max-w-[420px]">
      <AnimatePresence>
        {toasts.map((t) => {
          const config = toastConfig[t.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.15 } }}
              layout
              className={`flex items-start gap-4 p-4 rounded-2xl border ${config.bg} ${config.border} shadow-lg shadow-[rgba(180,156,140,0.15)] relative overflow-hidden group min-h-[72px]`}
            >
              <div className={`mt-0.5 p-1.5 rounded-xl bg-white shadow-sm ${config.color}`}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="flex-1 pr-6 pt-0.5">
                <p className="text-[13px] font-bold text-[#2B2B2B] leading-snug">{t.message}</p>
                <p className="text-[11px] text-[#7A7A7A] mt-1 font-medium uppercase tracking-wider opacity-60">System Notification</p>
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                className="absolute top-3 right-3 p-1.5 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
              
              {/* Progress Bar Animation */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-0.5 ${config.color.replace('text-', 'bg-')} opacity-30`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
