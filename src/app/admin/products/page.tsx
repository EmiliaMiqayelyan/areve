'use client';

import { useAdminStore } from '@/lib/adminStore';
import { modal } from '@/lib/uiStore';
import { Plus, Search, Edit, Trash2, Filter, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { pickLocalized } from '@/lib/localizedText';
import { adminProductEditPath } from '@/lib/resourceId';
import { formatPrice } from '@/lib/currency';
import AdminSelect from '@/components/admin/AdminSelect';

const FALLBACK_PRODUCT_IMAGE = '/images/prod-bag-a.png';

function resolveProductImageSrc(image?: string): string {
  const src = String(image ?? '').trim();
  if (!src || src.startsWith('blob:')) return FALLBACK_PRODUCT_IMAGE;
  if (src.startsWith('data:image/')) {
    return src;
  }
  if (src.startsWith('/uploads/')) return FALLBACK_PRODUCT_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;
  return `/${src.replace(/^\/+/, '')}`;
}

export default function AdminProductsPage() {
  const { products, deleteProduct, updateProduct, categories } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, true>>({});

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const label = `${pickLocalized(p.name, 'hy')} ${pickLocalized(p.name, 'en')}`.toLowerCase();
      const matchSearch = label.includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const categoryLabel = (id: string) => {
    const item = categories.find((c) => c.id === id);
    return item ? pickLocalized(item.name, 'hy') : id;
  };

  const categoryOptions = useMemo(
    () => [
      { id: 'All', label: 'All Categories' },
      ...categories.map((item) => ({
        id: item.id,
        label: pickLocalized(item.name, 'hy'),
      })),
    ],
    [categories]
  );

  const handleDelete = async (id: string, name: string) => {
    if (await modal.confirm(`Are you sure you want to delete "${name}"?`, 'Confirm Deletion')) {
      deleteProduct(id);
    }
  };

  const toggleStatus = (id: string, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
    updateProduct(id, { status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Products</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manage your catalog items, pricing, and availability.</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-5 py-2.5 rounded-xl font-medium text-[13px] hover:bg-[#D5B86A] transition-colors shadow-sm">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/40 transition-shadow"
          />
        </div>

        <div className="flex items-end gap-3 w-full sm:w-auto">
          <Filter size={16} className="text-[#AFAFAF] hidden sm:block mb-3" />
          <AdminSelect
            label="Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            className="w-full sm:w-[260px]"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F5F2] border-b border-[#EADFD8]">
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Product</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFD8]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#F8F5F2]/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl border border-[#EADFD8] overflow-hidden relative bg-[#F8F5F2] shrink-0">
                        {String(product.image ?? '').startsWith('data:image/') ? (
                          <img
                            src={brokenImageIds[product.id] ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
                            alt={pickLocalized(product.name, 'hy')}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            className="group-hover:scale-105"
                            onError={() => {
                              setBrokenImageIds((prev) => ({ ...prev, [product.id]: true }));
                            }}
                          />
                        ) : (
                          <Image
                            src={brokenImageIds[product.id] ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
                            alt={pickLocalized(product.name, 'hy')}
                            fill
                            className="object-cover"
                            onError={() => {
                              setBrokenImageIds((prev) => ({ ...prev, [product.id]: true }));
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#2B2B2B] flex items-center gap-1.5">
                          {pickLocalized(product.name, 'hy')}
                          {product.isFavorite ? (
                            <Heart size={12} className="text-[#E6C97A] fill-[#E6C97A]" aria-label="Favorite" />
                          ) : null}
                        </p>
                        <p className="text-[11px] text-[#AFAFAF]">{pickLocalized(product.name, 'en')}</p>
                        <p className="text-[12px] text-[#AFAFAF] mt-0.5">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex text-[12px] font-medium bg-[#F8F5F2] text-[#5a4a1e] px-3 py-1.5 rounded-full border border-[#EADFD8]">
                      {categoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[#2B2B2B]">{formatPrice(product.price)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      type="button"
                      onClick={() => toggleStatus(product.id, product.status)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        product.status === 'inactive'
                          ? 'bg-[#F8F5F2] text-[#AFAFAF] border border-[#EADFD8] hover:border-[#D6C3B3]'
                          : 'bg-[#E8F5EC] text-[#166534] border border-[#BBF7D0] hover:bg-[#DCFCE7]'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          product.status === 'inactive' ? 'bg-[#D6C3B3]' : 'bg-[#22c55e]'
                        }`}
                      />
                      {product.status === 'inactive' ? 'Inactive' : 'Active'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link href={adminProductEditPath(product.id)} className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-[#F8F5F2] rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, pickLocalized(product.name, 'hy'))}
                        className="p-2 text-[#AFAFAF] hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#AFAFAF] text-[14px]">
                    No products found. Include a broader search term.
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
