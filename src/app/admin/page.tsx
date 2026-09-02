'use client';

import { useAdminStore } from '@/lib/adminStore';
import { Package, ShoppingCart, Coins, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { formatPrice } from '@/lib/currency';
import { orderNetIncome } from '@/lib/orderTotals';

export default function AdminDashboard() {
  const { products, orders } = useAdminStore();

  const metrics = useMemo(() => {
    const netIncome = orders.reduce((sum, order) => sum + orderNetIncome(order), 0);
    return { netIncome };
  }, [orders]);

  const cards = [
    { label: 'Net Income', value: formatPrice(metrics.netIncome), icon: Coins, trend: 'Profit', color: 'text-green-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, trend: 'All', color: 'text-[#AFAFAF]' },
    { label: 'Total Products', value: products.length, icon: Package, trend: 'Active', color: 'text-[#AFAFAF]' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Dashboard Overview</h1>
          <p className="text-[13px] text-[#7A7A7A] mt-1">Welcome back. Here is what is happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-4 py-2 rounded-xl font-bold text-[12px] hover:bg-[#D5B86A] transition-colors shadow-sm uppercase tracking-wide">
            <Plus size={14} />
            Add Product
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2 bg-white text-[#2B2B2B] px-4 py-2 rounded-xl border border-[#EADFD8] font-bold text-[12px] hover:bg-[#F8F5F2] transition-colors shadow-sm uppercase tracking-wide">
            View Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F5F2] flex items-center justify-center text-[#2B2B2B]">
                <c.icon size={18} strokeWidth={1.5} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 bg-[#F8F5F2] rounded-full uppercase tracking-wider ${c.color}`}>
                {c.trend}
              </span>
            </div>
            <h3 className="text-[22px] font-bold text-[#2B2B2B] font-serif leading-none">{c.value}</h3>
            <p className="text-[12px] text-[#AFAFAF] mt-2 font-bold uppercase tracking-wider">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#EADFD8] flex justify-between items-center">
          <h3 className="text-[14px] font-bold text-[#2B2B2B] tracking-wide uppercase">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[12px] text-[#E6C97A] font-bold hover:text-[#D5B86A] uppercase tracking-wider">View All</Link>
        </div>
        <div className="divide-y divide-[#EADFD8]">
          {orders.slice(0, 5).map(order => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="p-4 flex items-center justify-between hover:bg-[#F8F5F2] transition-colors group no-underline">
              <div>
                <p className="text-[13px] font-bold text-[#2B2B2B]">{order.customerName}</p>
                <p className="text-[11px] text-[#AFAFAF] mt-0.5 uppercase tracking-wide">{order.id} • {new Date(order.date || '').toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#166534]">{formatPrice(orderNetIncome(order))}</p>
                <p className="text-[11px] mt-0.5 font-bold uppercase tracking-wider" style={{ color: order.status === 'delivered' ? '#16a34a' : order.status === 'shipped' ? '#CA8A04' : '#7A7A7A' }}>
                  {order.status}
                </p>
              </div>
            </Link>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-[#AFAFAF] text-[13px]">No orders yet.</div>
          )}
        </div>
      </div>
      
    </div>
  );
}
