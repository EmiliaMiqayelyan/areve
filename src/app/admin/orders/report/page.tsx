'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Wallet, PiggyBank, Receipt } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

type SaleRow = {
  orderId: string;
  date: string;
  customerName: string;
  productName: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
};

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('hy-AM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SalesReportPage() {
  const { orders, products } = useAdminStore();

  const costByProductId = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      map.set(product.id, Number(product.cost ?? 0));
    }
    return map;
  }, [products]);

  const rows = useMemo<SaleRow[]>(() => {
    const list: SaleRow[] = [];
    for (const order of orders) {
      const date = order.date ?? order.createdAt ?? '';
      for (const item of order.items ?? []) {
        const unitCost = Number(item.unitCost ?? costByProductId.get(item.id) ?? 0);
        const quantity = Number(item.quantity ?? 0);
        const unitPrice = Number(item.price ?? 0);
        const revenue = unitPrice * quantity;
        const cost = unitCost * quantity;
        list.push({
          orderId: order.id,
          date,
          customerName: order.customerName,
          productName: item.name,
          quantity,
          revenue,
          cost,
          profit: revenue - cost,
        });
      }
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, costByProductId]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.revenue += row.revenue;
        acc.cost += row.cost;
        acc.profit += row.profit;
        return acc;
      },
      { revenue: 0, cost: 0, profit: 0 }
    );
  }, [rows]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Sales Report</h1>
            <p className="text-[14px] text-[#7A7A7A] mt-1">
              Track revenue, product costs, customers, and sale dates.
            </p>
          </div>
        </div>
        <Link href="/admin/orders/new" className="btn-primary flex items-center gap-2 px-6 justify-center">
          New Sale
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#EADFD8] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6C97A]/20 text-[#5a4a1e] flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Total Sales</p>
          </div>
          <p className="text-2xl font-serif font-bold text-[#2B2B2B]">{formatMoney(totals.revenue)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EADFD8] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5F2] text-[#7A7A7A] flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Total Cost</p>
          </div>
          <p className="text-2xl font-serif font-bold text-[#2B2B2B]">{formatMoney(totals.cost)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EADFD8] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#166534] flex items-center justify-center">
              <PiggyBank size={18} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Profit</p>
          </div>
          <p className={`text-2xl font-serif font-bold ${totals.profit >= 0 ? 'text-[#166534]' : 'text-red-600'}`}>
            {formatMoney(totals.profit)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EADFD8] flex items-center gap-2">
          <Receipt size={18} className="text-[#E6C97A]" />
          <h2 className="text-[15px] font-bold text-[#2B2B2B]">Sales History</h2>
        </div>

        {rows.length === 0 ? (
          <div className="py-16 text-center text-[#AFAFAF] text-[14px]">
            No sales yet.{' '}
            <Link href="/admin/orders/new" className="text-[#5a4a1e] underline">
              Record your first sale
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-[#F8F5F2] border-b border-[#EADFD8]">
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Product</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-center">Qty</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Sold</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Cost</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD8]">
                {rows.map((row, index) => (
                  <tr key={`${row.orderId}-${row.productName}-${index}`} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="py-4 px-6 text-[13px] text-[#7A7A7A] whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="py-4 px-6">
                      <p className="text-[14px] font-medium text-[#2B2B2B]">{row.customerName}</p>
                      <p className="text-[11px] text-[#AFAFAF] mt-0.5">{row.orderId}</p>
                    </td>
                    <td className="py-4 px-6 text-[14px] text-[#2B2B2B]">{row.productName}</td>
                    <td className="py-4 px-6 text-center text-[13px] text-[#7A7A7A]">{row.quantity}</td>
                    <td className="py-4 px-6 text-right text-[14px] font-semibold text-[#2B2B2B]">{formatMoney(row.revenue)}</td>
                    <td className="py-4 px-6 text-right text-[14px] text-[#7A7A7A]">{formatMoney(row.cost)}</td>
                    <td className={`py-4 px-6 text-right text-[14px] font-semibold ${row.profit >= 0 ? 'text-[#166534]' : 'text-red-600'}`}>
                      {formatMoney(row.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
