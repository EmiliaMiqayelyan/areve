'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/adminStore';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import StoreImage from '@/components/ui/StoreImage';
import BilingualField from '@/components/admin/BilingualField';
import AdminSelect from '@/components/admin/AdminSelect';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import { emptyLocalized, pickLocalized, type LocalizedText } from '@/lib/localizedText';
import { createProductId } from '@/lib/resourceId';
import { CURRENCY_SYMBOL } from '@/lib/currency';

async function fileToDataUrl(file: File): Promise<string> {
  if (file.size > 1.5 * 1024 * 1024 && file.type.startsWith('image/')) {
    try {
      const bitmap = await createImageBitmap(file);
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      return canvas.toDataURL('image/jpeg', 0.82);
    } catch {
      // fall through
    }
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, categories } = useAdminStore();

  const [name, setName] = useState<LocalizedText>(emptyLocalized());
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.hy.trim() || !price || !category) return;

    try {
      setSaving(true);
      setError('');
      const nextImage = imagePreview || '/images/prod-bag-a.png';
      await addProduct({
        id: createProductId(name),
        name: { hy: name.hy.trim(), en: name.en.trim() },
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : 0,
        category,
        description: null,
        status,
        isFavorite,
        image: nextImage,
      });

      router.push('/admin/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void fileToDataUrl(file).then(setImagePreview).catch(() => setImagePreview(null));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Add New Product</h1>
          <p className="text-[13px] text-[#7A7A7A] mt-0.5">Create a product in Armenian and English.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-[13px]">
              {error}
            </div>
          )}
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">Basic Information</h3>

            <BilingualField
              label="Product Name *"
              value={name}
              onChange={setName}
              required
              hyPlaceholder="Օր.՝ Ուլունքագործ պայուսակ"
              enPlaceholder="e.g., Beaded bag"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">Media</h3>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Product Images</label>
              <div
                className="border-2 border-dashed border-[#EADFD8] bg-[#F8F5F2] rounded-xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-[#EADFD8]/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {imagePreview ? (
                  <div className="absolute inset-2 rounded-lg overflow-hidden border border-[#EADFD8]">
                    <StoreImage src={imagePreview} alt="Preview" fill />
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-[#AFAFAF] mb-3" />
                    <p className="text-[14px] font-medium text-[#2B2B2B]">Click to upload or drag and drop</p>
                    <p className="text-[12px] text-[#AFAFAF] mt-1">SVG, PNG, JPG or WEBP</p>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-[#EADFD8] pb-4">
              <h3 className="text-[15px] font-bold text-[#2B2B2B]">Publishing</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-[#2B2B2B]">Status</p>
                <p className="text-[11px] text-[#AFAFAF]">Visible to customers</p>
              </div>
              <button
                type="button"
                onClick={() => setStatus(s => s === 'active' ? 'inactive' : 'active')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E6C97A] focus:ring-offset-2 ${status === 'active' ? 'bg-[#16a34a]' : 'bg-[#D6C3B3]'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-[#2B2B2B]">Favorite</p>
                <p className="text-[11px] text-[#AFAFAF]">Show on homepage featured</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFavorite((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E6C97A] focus:ring-offset-2 ${isFavorite ? 'bg-[#E6C97A]' : 'bg-[#D6C3B3]'}`}
                aria-pressed={isFavorite}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isFavorite ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">Organization</h3>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Price ({CURRENCY_SYMBOL}) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF] font-bold">{CURRENCY_SYMBOL}</span>
                <input
                  required
                  type="number"
                  step="1"
                  min="0"
                  value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 pl-8 pr-4 text-[14px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Product Cost ({CURRENCY_SYMBOL})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF] font-bold">{CURRENCY_SYMBOL}</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 pl-8 pr-4 text-[14px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                />
              </div>
              <p className="text-[11px] text-[#AFAFAF]">Materials and labor cost per item for sales reporting.</p>
            </div>

            <AdminSelect
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder={categories.length === 0 ? 'Create a category first' : 'Select category'}
              options={categories.map((item) => ({
                value: item.id,
                label: `${pickLocalized(item.name, 'hy')}${pickLocalized(item.name, 'en') ? ` / ${pickLocalized(item.name, 'en')}` : ''}`,
              }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="lg:col-span-3 flex justify-end gap-3 pt-4 mb-10">
          <Link href="/admin/products" className="px-6 py-2.5 rounded-xl border border-[#EADFD8] font-bold text-[13px] text-[#7A7A7A] hover:bg-white hover:text-[#2B2B2B] transition-colors bg-[#F8F5F2]">
            Cancel
          </Link>
          <AdminSaveButton loading={saving} loadingLabel="Saving...">
            Save Product
          </AdminSaveButton>
        </div>
      </form>

    </div>
  );
}
