'use client';

import { Tags } from 'lucide-react';

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Categories</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manage product categorization and collections.</p>
        </div>
      </div>
      
      <div className="bg-white p-12 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
         <div className="w-16 h-16 bg-[#F8F5F2] rounded-full flex items-center justify-center text-[#E6C97A] mb-4">
            <Tags size={28} />
         </div>
         <h3 className="text-xl font-bold text-[#2B2B2B] font-serif mb-2">Categories coming soon</h3>
         <p className="text-[#AFAFAF] text-[14px]">You can currently assign categories directly from the Add/Edit Product page.</p>
      </div>
    </div>
  );
}
