'use client';

import { useAdminStore } from '@/lib/adminStore';
import { toast, modal } from '@/lib/uiStore';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';

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
  const { products, deleteProduct, updateProduct } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, true>>({});

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, categoryFilter]);

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

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EADFD8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFAFAF]" size={16} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F5F2] border-none rounded-full py-2 pl-10 pr-4 text-[13px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/30 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={16} className="text-[#AFAFAF] hidden sm:block" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F8F5F2] border-none text-[13px] text-[#7A7A7A] py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/30 w-full sm:w-auto cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Bags">Beaded Bags</option>
            <option value="Toys">Handmade Toys</option>
            <option value="Accessories">Accessories</option>
          </select>
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
                            alt={product.name}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            className="group-hover:scale-105"
                            onError={() => {
                              setBrokenImageIds((prev) => ({ ...prev, [product.id]: true }));
                            }}
                          />
                        ) : (
                          <Image
                            src={brokenImageIds[product.id] ? FALLBACK_PRODUCT_IMAGE : resolveProductImageSrc(product.image)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={() => {
                              setBrokenImageIds((prev) => ({ ...prev, [product.id]: true }));
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#2B2B2B]">{product.name}</p>
                        <p className="text-[12px] text-[#AFAFAF] mt-0.5">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[12px] font-medium bg-[#F8F5F2] text-[#7A7A7A] px-3 py-1 rounded-full uppercase tracking-wide border border-[#EADFD8]">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[14px] font-bold text-[#2B2B2B]">${Number(product.price ?? 0).toFixed(2)}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => toggleStatus(product.id, product.status)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${product.status === 'inactive' ? 'bg-[#D6C3B3]' : 'bg-[#16a34a]'}`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${product.status === 'inactive' ? 'translate-x-0' : 'translate-x-4'}`} />
                    </button>
                    <p className="text-[11px] text-[#AFAFAF] uppercase tracking-wider mt-1">{product.status === 'inactive' ? 'Inactive' : 'Active'}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-[#F8F5F2] rounded-lg transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
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
