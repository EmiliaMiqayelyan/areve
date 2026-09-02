'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Wallet, PiggyBank, Receipt } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import { formatPrice } from '@/lib/currency';

type SaleRow = {
  orderId: string;
  date: string;
  customerName: string;
  stoneType: string;
  stoneMm: string;
  bagSize: string;
  stonePrice: number;
  bagPrice: number;
  total: number;
};

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
  const { orders } = useAdminStore();

  const rows = useMemo<SaleRow[]>(() => {
    const list: SaleRow[] = [];
    for (const order of orders) {
      const date = order.date ?? order.createdAt ?? '';
      for (const item of order.items ?? []) {
        const stonePrice = Number(item.stonePrice ?? item.unitCost ?? 0);
        const bagPrice = Number(item.bagPrice ?? item.price ?? 0);
        list.push({
          orderId: order.id,
          date,
          customerName: order.customerName,
          stoneType: item.stoneType || item.name || '—',
          stoneMm: item.stoneMm || '—',
          bagSize: item.bagSize || '—',
          stonePrice,
          bagPrice,
          total: bagPrice - stonePrice,
        });
      }
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.stone += row.stonePrice;
        acc.bag += row.bagPrice;
        acc.total += row.total;
        return acc;
      },
      { stone: 0, bag: 0, total: 0 }
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
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Քարի գին</p>
          </div>
          <p className="text-2xl font-serif font-bold text-[#2B2B2B]">{formatPrice(totals.stone)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EADFD8] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5F2] text-[#7A7A7A] flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Պայուսակի գին</p>
          </div>
          <p className="text-2xl font-serif font-bold text-[#2B2B2B]">{formatPrice(totals.bag)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EADFD8] p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] text-[#166534] flex items-center justify-center">
              <PiggyBank size={18} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Մաքուր եկամուտ</p>
          </div>
          <p className={`text-2xl font-serif font-bold ${totals.total >= 0 ? 'text-[#166534]' : 'text-red-600'}`}>
            {formatPrice(totals.total)}
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
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Քարի տեսակ</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Քարի մմ</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Պայուսակի չափ</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Քարի գին</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Պայուսակի գին</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Մաքուր եկամուտ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD8]">
                {rows.map((row, index) => (
                  <tr key={`${row.orderId}-${row.stoneType}-${index}`} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="py-4 px-6 text-[13px] text-[#7A7A7A] whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="py-4 px-6">
                      <p className="text-[14px] font-medium text-[#2B2B2B]">{row.customerName}</p>
                      <p className="text-[11px] text-[#AFAFAF] mt-0.5">{row.orderId}</p>
                    </td>
                    <td className="py-4 px-6 text-[14px] text-[#2B2B2B]">{row.stoneType}</td>
                    <td className="py-4 px-6 text-[14px] text-[#7A7A7A]">{row.stoneMm}</td>
                    <td className="py-4 px-6 text-[14px] text-[#7A7A7A]">{row.bagSize}</td>
                    <td className="py-4 px-6 text-right text-[14px] text-[#2B2B2B]">{formatPrice(row.stonePrice)}</td>
                    <td className="py-4 px-6 text-right text-[14px] text-[#2B2B2B]">{formatPrice(row.bagPrice)}</td>
                    <td className={`py-4 px-6 text-right text-[14px] font-semibold ${row.total >= 0 ? 'text-[#166534]' : 'text-red-600'}`}>{formatPrice(row.total)}</td>
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
