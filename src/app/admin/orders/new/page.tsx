'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import { formatPrice } from '@/lib/currency';

type LineItem = {
  key: string;
  stoneType: string;
  stoneMm: string;
  bagWidth: string;
  bagHeight: string;
  bagDepth: string;
  stonePrice: string;
  bagPrice: string;
};

const inputClass =
  'w-full min-h-11 bg-white border border-[#EADFD8] rounded-xl py-2.5 px-3 sm:px-4 text-base sm:text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40';

const labelClass = 'block text-[13px] font-semibold text-[#7A7A7A] mb-1.5 sm:text-[12px] sm:font-bold sm:uppercase sm:tracking-wider sm:mb-2';

function DimensionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#EADFD8] bg-white px-3 py-2 sm:block sm:border-0 sm:bg-transparent sm:p-0">
      <label className="shrink-0 text-[13px] font-medium text-[#5a4a1e] sm:mb-1.5 sm:block sm:text-[11px] sm:font-normal sm:text-[#AFAFAF]">
        {label}
      </label>
      <div className="relative w-[42%] min-w-[96px] sm:w-full">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(sanitizeDecimalInput(e.target.value))}
          placeholder="0"
          className={`${inputClass} pr-9`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#AFAFAF]">
          սմ
        </span>
      </div>
    </div>
  );
}

function sanitizeDecimalInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join('')}`;
}

function parseAmount(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBagSize(width: string, height: string, depth: string) {
  const parts = [width.trim(), height.trim(), depth.trim()].filter(Boolean);
  if (parts.length === 0) return '';
  return `${parts.join(' × ')} սմ`;
}

function composeItemName(stoneType: string, stoneMm: string, bagSize: string) {
  const parts = [
    stoneType.trim(),
    stoneMm.trim() ? `${stoneMm.trim()}մմ` : '',
    bagSize.trim(),
  ].filter(Boolean);
  return parts.join(' · ') || 'Պատվեր';
}

function newLineItem(): LineItem {
  return {
    key: crypto.randomUUID(),
    stoneType: '',
    stoneMm: '',
    bagWidth: '',
    bagHeight: '',
    bagDepth: '',
    stonePrice: '',
    bagPrice: '',
  };
}

export default function NewOrderPage() {
  const router = useRouter();
  const { createOrder } = useAdminStore();

  const [items, setItems] = useState<LineItem[]>([newLineItem()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.stone += parseAmount(item.stonePrice);
        acc.bag += parseAmount(item.bagPrice);
        return acc;
      },
      { stone: 0, bag: 0 }
    );
  }, [items]);

  const updateItem = (key: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter(
      (item) =>
        item.stoneType.trim() ||
        item.stoneMm.trim() ||
        item.bagWidth.trim() ||
        item.bagHeight.trim() ||
        item.bagDepth.trim() ||
        parseAmount(item.stonePrice) > 0 ||
        parseAmount(item.bagPrice) > 0
    );
    if (validItems.length === 0) {
      setError('Ավելացրեք առնվազն մեկ տող։');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createOrder({
        items: validItems.map((item) => {
          const stonePrice = parseAmount(item.stonePrice);
          const bagPrice = parseAmount(item.bagPrice);
          const bagSize = formatBagSize(item.bagWidth, item.bagHeight, item.bagDepth);
          return {
            id: `manual-${item.key}`,
            name: composeItemName(item.stoneType, item.stoneMm, bagSize),
            quantity: 1,
            price: bagPrice,
            unitCost: stonePrice,
            stoneType: item.stoneType.trim(),
            stoneMm: item.stoneMm.trim(),
            bagSize,
            stonePrice,
            bagPrice,
          };
        }),
      });
      router.push('/admin/orders/report');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const netIncome = totals.bag - totals.stone;

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/admin/orders" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-serif font-bold text-[#2B2B2B] sm:text-2xl">New Sale</h1>
          <p className="mt-0.5 text-[13px] text-[#7A7A7A] sm:text-[14px]">
            Ավելացրեք քարի և պայուսակի տվյալները։
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-28 sm:space-y-6 sm:pb-0">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-[13px] sm:p-4">{error}</div>
        )}

        <div className="space-y-4 rounded-2xl border border-[#EADFD8] bg-white p-4 shadow-sm sm:space-y-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[#EADFD8] pb-3 sm:pb-4">
            <h3 className="text-[15px] font-bold text-[#2B2B2B]">Products</h3>
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, newLineItem()])}
              className="hidden items-center gap-1.5 text-[13px] font-semibold text-[#5a4a1e] hover:text-[#2B2B2B] transition-colors sm:flex"
            >
              <Plus size={16} /> Add line
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.key} className="space-y-4 rounded-xl border border-[#EADFD8] bg-[#FDFCFB] p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#AFAFAF] uppercase tracking-wider">Line {index + 1}</p>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((row) => row.key !== item.key))}
                      className="flex min-h-11 min-w-11 items-center justify-center text-[#AFAFAF] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove line"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Քարի տեսակ</label>
                    <input
                      type="text"
                      value={item.stoneType}
                      onChange={(e) => updateItem(item.key, { stoneType: e.target.value })}
                      placeholder="Օր.՝ մարգարիտ"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Քարի մմ</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.stoneMm}
                      onChange={(e) => updateItem(item.key, { stoneMm: sanitizeDecimalInput(e.target.value) })}
                      placeholder="Օր.՝ 8"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <p className={labelClass}>Պայուսակի չափ</p>
                  <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0">
                    <DimensionField
                      label="Լայնություն"
                      value={item.bagWidth}
                      onChange={(value) => updateItem(item.key, { bagWidth: value })}
                    />
                    <DimensionField
                      label="Բարձրություն"
                      value={item.bagHeight}
                      onChange={(value) => updateItem(item.key, { bagHeight: value })}
                    />
                    <DimensionField
                      label="Խորություն"
                      value={item.bagDepth}
                      onChange={(value) => updateItem(item.key, { bagDepth: value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Քարի գին</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.stonePrice}
                      onChange={(e) => updateItem(item.key, { stonePrice: sanitizeDecimalInput(e.target.value) })}
                      placeholder="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Պայուսակի գին</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.bagPrice}
                      onChange={(e) => updateItem(item.key, { bagPrice: sanitizeDecimalInput(e.target.value) })}
                      placeholder="0"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, newLineItem()])}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#EADFD8] text-[13px] font-semibold text-[#5a4a1e] sm:hidden"
          >
            <Plus size={16} /> Ավելացնել տող
          </button>
        </div>

        <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 shadow-sm sm:p-6">
          <div className="space-y-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:text-center">
            <div className="flex items-center justify-between sm:block">
              <p className="text-[12px] font-semibold text-[#7A7A7A] sm:text-[11px] sm:font-bold sm:uppercase sm:tracking-wider sm:text-[#AFAFAF]">Քարի գին</p>
              <p className="font-serif text-lg font-bold text-[#2B2B2B] sm:mt-1 sm:text-xl">{formatPrice(totals.stone)}</p>
            </div>
            <div className="flex items-center justify-between sm:block">
              <p className="text-[12px] font-semibold text-[#7A7A7A] sm:text-[11px] sm:font-bold sm:uppercase sm:tracking-wider sm:text-[#AFAFAF]">Պայուսակի գին</p>
              <p className="font-serif text-lg font-bold text-[#2B2B2B] sm:mt-1 sm:text-xl">{formatPrice(totals.bag)}</p>
            </div>
            <div className="flex items-center justify-between border-t border-[#EADFD8] pt-3 sm:block sm:border-0 sm:pt-0">
              <p className="text-[12px] font-semibold text-[#7A7A7A] sm:text-[11px] sm:font-bold sm:uppercase sm:tracking-wider sm:text-[#AFAFAF]">Մաքուր եկամուտ</p>
              <p className={`font-serif text-lg font-bold sm:mt-1 sm:text-xl ${netIncome >= 0 ? 'text-[#166534]' : 'text-red-600'}`}>
                {formatPrice(netIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#EADFD8] bg-[#F8F5F2]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
          <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Link href="/admin/orders" className="btn-outline min-h-11 justify-center px-6 py-3 text-center">
              Cancel
            </Link>
            <AdminSaveButton loading={saving} loadingLabel="Saving..." className="btn-primary min-h-11 w-full px-8 py-3 sm:w-auto">
              Save Sale
            </AdminSaveButton>
          </div>
        </div>
      </form>
    </div>
  );
}
