'use client';

import { useAdminStore } from '@/lib/adminStore';
import { Search, Filter, Eye, Trash2, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import AdminSelect from '@/components/admin/AdminSelect';
import { formatPrice } from '@/lib/currency';
import { orderNetIncome } from '@/lib/orderTotals';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
];

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

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
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/admin/orders/new" className="btn-primary flex items-center gap-2 px-6 justify-center">
            <Plus size={18} /> New Sale
          </Link>
          <Link href="/admin/orders/report" className="btn-outline flex items-center gap-2 px-6 justify-center">
            <BarChart3 size={18} /> Sales Report
          </Link>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40 transition-shadow"
          />
        </div>
        <div className="flex items-end gap-3 w-full sm:w-auto">
          <Filter size={16} className="text-[#AFAFAF] hidden sm:block mb-3" />
          <AdminSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_FILTER_OPTIONS}
            className="w-full sm:w-[240px]"
            menuAlign="left"
          />
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
                      {formatPrice(orderNetIncome(order))}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <AdminSelect
                      value={order.status}
                      onChange={(next) => updateOrderStatus(order.id, next as 'pending' | 'shipped' | 'delivered')}
                      options={ORDER_STATUS_OPTIONS}
                      compact
                      menuAlign="left"
                      className="w-[148px]"
                    />
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
