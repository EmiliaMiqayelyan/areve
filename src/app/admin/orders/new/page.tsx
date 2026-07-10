'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';
import AdminSelect from '@/components/admin/AdminSelect';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import { pickLocalized } from '@/lib/localizedText';
import { formatPrice } from '@/lib/currency';

type LineItem = {
  key: string;
  productId: string;
  name: string;
  quantity: string;
  price: string;
  unitCost: string;
};

function sanitizeIntegerInput(value: string) {
  return value.replace(/\D/g, '');
}

function sanitizeDecimalInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join('')}`;
}

function parseQuantity(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function parseAmount(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function newLineItem(): LineItem {
  return {
    key: crypto.randomUUID(),
    productId: '',
    name: '',
    quantity: '1',
    price: '',
    unitCost: '',
  };
}

export default function NewOrderPage() {
  const router = useRouter();
  const { products, createOrder } = useAdminStore();

  const [customerName, setCustomerName] = useState('');
  const [delivery, setDelivery] = useState('');
  const [packaging, setPackaging] = useState('');
  const [soldAt, setSoldAt] = useState(() => toDatetimeLocalValue(new Date()));
  const [items, setItems] = useState<LineItem[]>([newLineItem()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const productOptions = useMemo(
    () => [
      { value: '', label: 'Select product or type manually' },
      ...products.map((p) => ({
        value: p.id,
        label: pickLocalized(p.name, 'hy') || pickLocalized(p.name, 'en') || p.id,
      })),
    ],
    [products]
  );

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const qty = parseQuantity(item.quantity);
        const price = parseAmount(item.price);
        const cost = parseAmount(item.unitCost);
        acc.revenue += price * qty;
        acc.cost += cost * qty;
        return acc;
      },
      { revenue: 0, cost: 0 }
    );
  }, [items]);

  const updateItem = (key: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const handleProductSelect = (key: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      updateItem(key, { productId: '', name: '' });
      return;
    }
    const name = pickLocalized(product.name, 'hy') || pickLocalized(product.name, 'en') || product.id;
    updateItem(key, {
      productId,
      name,
      price: String(Number(product.price) || ''),
      unitCost: String(Number(product.cost ?? 0) || ''),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    const validItems = items.filter((item) => item.name.trim() && parseQuantity(item.quantity) > 0);
    if (validItems.length === 0) {
      setError('Add at least one product line.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createOrder({
        customerName: customerName.trim(),
        delivery: delivery.trim(),
        packaging: packaging.trim(),
        soldAt: new Date(soldAt).toISOString(),
        items: validItems.map((item) => ({
          id: item.productId || `manual-${item.key}`,
          name: item.name.trim(),
          quantity: parseQuantity(item.quantity),
          price: parseAmount(item.price),
          unitCost: parseAmount(item.unitCost),
        })),
      });
      router.push('/admin/orders/report');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">New Sale</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">
            Record a sale manually — customer, date, price, and cost.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-[13px]">{error}</div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
          <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">Sale Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="Օր.՝ Անի Մարտիրոսյան"
                className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                Առաքում
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={delivery}
                onChange={(e) => setDelivery(sanitizeDecimalInput(e.target.value))}
                placeholder="Օր.՝ 1500"
                className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                Փաթեթավորում
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={packaging}
                onChange={(e) => setPackaging(sanitizeDecimalInput(e.target.value))}
                placeholder="Օր.՝ 500"
                className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                Sale Date *
              </label>
              <input
                type="datetime-local"
                value={soldAt}
                onChange={(e) => setSoldAt(e.target.value)}
                required
                className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#EADFD8] pb-4">
            <h3 className="text-[15px] font-bold text-[#2B2B2B]">Products</h3>
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, newLineItem()])}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-[#5a4a1e] hover:text-[#2B2B2B] transition-colors"
            >
              <Plus size={16} /> Add line
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.key} className="p-4 rounded-xl border border-[#EADFD8] bg-[#FDFCFB] space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#AFAFAF] uppercase tracking-wider">Line {index + 1}</p>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((row) => row.key !== item.key))}
                      className="p-1.5 text-[#AFAFAF] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove line"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <AdminSelect
                  label="Product"
                  value={item.productId}
                  onChange={(v) => handleProductSelect(item.key, v)}
                  options={productOptions}
                  menuAlign="left"
                />

                <div>
                  <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.key, { name: e.target.value })}
                    required
                    placeholder="Product name"
                    className="w-full bg-white border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                      Qty
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.key, { quantity: sanitizeIntegerInput(e.target.value) })}
                      onBlur={() => {
                        if (!parseQuantity(item.quantity)) {
                          updateItem(item.key, { quantity: '1' });
                        }
                      }}
                      placeholder="1"
                      className="w-full bg-white border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                      Sale Price ($)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.price}
                      onChange={(e) => updateItem(item.key, { price: sanitizeDecimalInput(e.target.value) })}
                      placeholder="0"
                      className="w-full bg-white border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider mb-2">
                      Cost ($)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.unitCost}
                      onChange={(e) => updateItem(item.key, { unitCost: sanitizeDecimalInput(e.target.value) })}
                      placeholder="0"
                      className="w-full bg-white border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Total Sale</p>
              <p className="text-xl font-serif font-bold text-[#2B2B2B] mt-1">{formatPrice(totals.revenue)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Total Cost</p>
              <p className="text-xl font-serif font-bold text-[#2B2B2B] mt-1">{formatPrice(totals.cost)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFAFAF]">Profit</p>
              <p className={`text-xl font-serif font-bold mt-1 ${totals.revenue - totals.cost >= 0 ? 'text-[#166534]' : 'text-red-600'}`}>
                {formatPrice(totals.revenue - totals.cost)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/admin/orders" className="btn-outline text-center px-6 py-3">
            Cancel
          </Link>
          <AdminSaveButton loading={saving} loadingLabel="Saving..." className="btn-primary px-8 py-3">
            Save Sale
          </AdminSaveButton>
        </div>
      </form>
    </div>
  );
}
