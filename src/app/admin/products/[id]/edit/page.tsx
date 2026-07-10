'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminStore, type Product } from '@/lib/adminStore';
import { apiFetch } from '@/lib/api';
import { adminProductApiPath, findByResourceId } from '@/lib/resourceId';
import { CURRENCY_SYMBOL } from '@/lib/currency';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BilingualField from '@/components/admin/BilingualField';
import AdminSelect from '@/components/admin/AdminSelect';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import { emptyLocalized, parseLocalized, pickLocalized, type LocalizedText } from '@/lib/localizedText';

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct, categories, loading, token } = useAdminStore();
  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  const [fetching, setFetching] = useState(false);
  const product = findByResourceId(products, id) ?? fetchedProduct;

  const [name, setName] = useState<LocalizedText>(emptyLocalized());
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product || !id || loading) return;
    if (!token) return;

    let cancelled = false;
    setFetching(true);
    void apiFetch<Product>(adminProductApiPath(id), {}, token)
      .then((row) => {
        if (!cancelled) setFetchedProduct(row);
      })
      .catch(() => {
        if (!cancelled) setFetchedProduct(null);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product, id, loading, token]);

  useEffect(() => {
    if (product) {
      setName(parseLocalized(product.name));
      setPrice(product.price.toString());
      setCost(String(product.cost ?? 0));
      setCategory(product.category);
      setStatus(product.status || 'active');
      setImagePreview(product.image);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !name.hy.trim() || !price || !category) return;

    try {
      setSaving(true);
      setError('');
      const nextImage = imagePreview || product.image;
      if (typeof nextImage === 'string' && nextImage.startsWith('/uploads/')) {
        setError('This product image points to `/uploads/*` but the file is missing. Please choose/upload a new image, then save again.');
        return;
      }
      await updateProduct(product.id, {
        name: { hy: name.hy.trim(), en: name.en.trim() },
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : 0,
        category,
        status,
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

  if (loading || fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#7A7A7A] text-[14px]">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold mb-4 font-serif text-[#2B2B2B]">Product not found</h2>
        <Link href="/admin/products" className="text-[#E6C97A] hover:underline">Return to Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Edit Product</h1>
          <p className="text-[13px] text-[#7A7A7A] mt-0.5">Editing {product.id}</p>
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

            <BilingualField label="Product Name *" value={name} onChange={setName} required />

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
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-[#AFAFAF] mb-3" />
                    <p className="text-[14px] font-medium text-[#2B2B2B]">Click to change image</p>
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
            <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">Publishing</h3>
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
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">Organization</h3>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Price ({CURRENCY_SYMBOL})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF] font-bold">{CURRENCY_SYMBOL}</span>
                <input
                  required
                  type="number"
                  step="1"
                  min="0"
                  value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 pl-8 pr-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
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
            </div>

            <AdminSelect
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder={categories.length === 0 ? 'No categories' : 'Select category'}
              options={
                categories.length === 0 && category
                  ? [{ value: category, label: category }]
                  : categories.map((item) => ({
                      value: item.id,
                      label: `${pickLocalized(item.name, 'hy')}${pickLocalized(item.name, 'en') ? ` / ${pickLocalized(item.name, 'en')}` : ''}`,
                    }))
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="lg:col-span-3 flex justify-end gap-3 pt-4 mb-10">
          <Link href="/admin/products" className="px-6 py-2.5 rounded-xl border border-[#EADFD8] font-bold text-[13px] text-[#7A7A7A] hover:bg-white hover:text-[#2B2B2B] transition-colors bg-[#F8F5F2]">
            Cancel
          </Link>
          <AdminSaveButton loading={saving} loadingLabel="Saving...">
            Save Changes
          </AdminSaveButton>
        </div>
      </form>

    </div>
  );
}
