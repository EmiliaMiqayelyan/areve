'use client';

import { useAdminStore } from '@/lib/adminStore';
import { Search, Filter, Check, X, Trash2, Star } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function AdminReviewsPage() {
  const { reviews, updateReview, deleteReview } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || r.status === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Reviews</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manage customer testimonials and star ratings.</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, product or content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F5F2] border-none rounded-full py-2 pl-10 pr-4 text-[13px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/30 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={16} className="text-[#AFAFAF] hidden sm:block" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F5F2] border-none text-[13px] text-[#7A7A7A] py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/30 w-full sm:w-auto cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F5F2] border-b border-[#EADFD8]">
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider w-1/4">Customer</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider w-1/6">Rating</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider w-1/3">Comment</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider w-1/6">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFD8]">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-[#F8F5F2]/50 transition-colors group">
                  <td className="py-4 px-6 align-top">
                    <p className="text-[14px] font-bold text-[#2B2B2B]">{review.name}</p>
                    <p className="text-[12px] text-[#AFAFAF] mt-0.5">{review.product}</p>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-center gap-1 text-[#E6C97A]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1.5} className={i >= review.rating ? "text-[#D6C3B3]" : ""} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <p className="text-[14px] text-[#2B2B2B] leading-relaxed line-clamp-3 italic">"{review.comment}"</p>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <span className={`text-[12px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${
                      review.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      review.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {review.status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right align-top">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {review.status !== 'approved' && (
                        <button 
                          onClick={() => updateReview(review.id, { status: 'approved' })}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {review.status === 'pending' && (
                        <button 
                          onClick={() => updateReview(review.id, { status: 'rejected' })}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteReview(review.id)}
                        className="p-2 text-[#AFAFAF] hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#AFAFAF] text-[14px]">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
