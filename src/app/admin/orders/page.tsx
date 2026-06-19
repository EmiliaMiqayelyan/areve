'use client';

import { useAdminStore } from '@/lib/adminStore';
import { Search, Filter, Eye, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Orders</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Check the status of recent transactions and manage fulfillments.</p>
        </div>
        <Link href="/admin/orders/new" className="btn-primary flex items-center gap-2 px-6">
          <Plus size={18} /> New Order
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID or customer..." 
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
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F5F2] border-b border-[#EADFD8]">
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFD8]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F8F5F2]/50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-[#2B2B2B] uppercase tracking-wide">{order.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[#2B2B2B]">{order.customerName}</p>
                    <p className="text-[12px] text-[#AFAFAF] mt-0.5">{order.customerEmail}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-medium text-[#7A7A7A]">
                      {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[#2B2B2B]">
                      ${Number(order.total ?? 0).toFixed(2)}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className={`text-[12px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border border-[#EADFD8] focus:outline-none cursor-pointer appearance-none ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                        order.status === 'shipped' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-[#F8F5F2] text-[#7A7A7A]'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/orders/${order.id}`} className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-[#F8F5F2] rounded-lg transition-colors flex items-center gap-2 text-[12px] font-medium tracking-wide">
                        <Eye size={16} /> Edit
                      </Link>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this order?')) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-2 text-[#AFAFAF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#AFAFAF] text-[14px]">
                    No orders found matching the filter.
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
