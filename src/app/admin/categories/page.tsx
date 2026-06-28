'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAdminStore, type CategoryItem } from '@/lib/adminStore';
import { modal } from '@/lib/uiStore';
import { makeCategorySlug } from '@/lib/categorySlug';
import BilingualField from '@/components/admin/BilingualField';
import { emptyLocalized, parseLocalized, pickLocalized } from '@/lib/localizedText';
import type { LocalizedText } from '@/lib/localizedText';
import { Plus, Save, Trash2, Edit2, Tags } from 'lucide-react';

type Draft = {
  id: string;
  name: LocalizedText;
  sortOrder: number;
};

function emptyDraft(sortOrder = 0): Draft {
  return { id: '', name: emptyLocalized(), sortOrder };
}

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft(categories.length + 1));
  const [slugTouched, setSlugTouched] = useState(false);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of products) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  useEffect(() => {
    if (editingId) return;
    setDraft(emptyDraft(categories.length + 1));
    setSlugTouched(false);
  }, [categories.length, editingId]);

  const startCreate = () => {
    setEditingId('__new__');
    setDraft(emptyDraft(categories.length + 1));
    setSlugTouched(false);
  };

  const startEdit = (category: CategoryItem) => {
    setEditingId(category.id);
    setDraft({
      id: category.id,
      name: parseLocalized(category.name),
      sortOrder: category.sortOrder ?? 0,
    });
    setSlugTouched(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft(categories.length + 1));
    setSlugTouched(false);
  };

  const handleNameChange = (name: LocalizedText) => {
    setDraft((current) => {
      const next = { ...current, name };
      if (!slugTouched && editingId === '__new__') {
        const source = name.en.trim() || name.hy.trim();
        if (source) next.id = makeCategorySlug(source);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!draft.name.hy.trim()) {
      await modal.alert('Armenian category name is required.', 'Missing name');
      return;
    }

    const payload = {
      name: { hy: draft.name.hy.trim(), en: draft.name.en.trim() },
      sortOrder: Number(draft.sortOrder) || 0,
    };

    try {
      if (editingId === '__new__') {
        const id = draft.id.trim() || makeCategorySlug(draft.name.en || draft.name.hy);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
          await modal.alert('Use a slug with lowercase letters, numbers, and hyphens only.', 'Invalid slug');
          return;
        }
        if (categories.some((c) => c.id === id)) {
          await modal.alert('A category with this slug already exists.', 'Duplicate slug');
          return;
        }
        await addCategory({ id, ...payload });
      } else if (editingId) {
        await updateCategory(editingId, payload);
      }
      cancelEdit();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save category';
      await modal.alert(message, 'Error');
    }
  };

  const handleDelete = async (category: CategoryItem) => {
    const count = productCounts[category.id] ?? 0;
    if (count > 0) {
      await modal.alert(
        `This category is used by ${count} product(s). Reassign them before deleting.`,
        'Category in use'
      );
      return;
    }
    if (await modal.confirm(`Delete "${pickLocalized(category.name, 'hy')}"?`, 'Confirm Deletion')) {
      try {
        await deleteCategory(category.id);
        if (editingId === category.id) cancelEdit();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete category';
        await modal.alert(message, 'Error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Categories</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Create and manage product categories in Armenian and English.</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-5 py-2.5 rounded-xl font-medium text-[13px] hover:bg-[#D5B86A] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {editingId && (
        <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm space-y-5">
          <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4">
            {editingId === '__new__' ? 'New Category' : `Edit Category`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BilingualField
              label="Category Name *"
              value={draft.name}
              onChange={handleNameChange}
              required
              hyPlaceholder="Օր.՝ Ձեռագործ տոպրակներ"
              enPlaceholder="e.g., Handmade Bags"
            />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Slug / ID</label>
                <input
                  type="text"
                  value={draft.id}
                  disabled={editingId !== '__new__'}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setDraft((s) => ({ ...s, id: e.target.value.toLowerCase() }));
                  }}
                  placeholder="handmade-bags"
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] placeholder-[#AFAFAF] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow disabled:opacity-60"
                />
                <p className="text-[11px] text-[#AFAFAF]">Used in URLs and product filters. Cannot be changed after creation.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider">Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={draft.sortOrder}
                  onChange={(e) => setDraft((s) => ({ ...s, sortOrder: Number(e.target.value) || 0 }))}
                  className="w-full bg-[#F8F5F2] border border-[#EADFD8] rounded-xl py-2.5 px-4 text-[14px] text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#E6C97A]/50 transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2.5 rounded-xl border border-[#EADFD8] font-bold text-[13px] text-[#7A7A7A] hover:bg-[#F8F5F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#E6C97A] text-[#5a4a1e] px-6 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#D5B86A] transition-colors shadow-sm"
            >
              <Save size={16} /> Save Category
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EADFD8] shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#F8F5F2] rounded-full flex items-center justify-center text-[#E6C97A] mx-auto mb-4">
              <Tags size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#2B2B2B] font-serif mb-2">No categories yet</h3>
            <p className="text-[#AFAFAF] text-[14px]">Create your first category to organize products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5F2] border-b border-[#EADFD8]">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Armenian</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">English</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Products</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#AFAFAF] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD8]">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="px-6 py-4 font-mono text-[13px] text-[#7A7A7A]">{category.id}</td>
                    <td className="px-6 py-4 text-[14px] text-[#2B2B2B]">{pickLocalized(category.name, 'hy')}</td>
                    <td className="px-6 py-4 text-[14px] text-[#7A7A7A]">{pickLocalized(category.name, 'en') || '—'}</td>
                    <td className="px-6 py-4 text-[14px] text-[#7A7A7A]">{productCounts[category.id] ?? 0}</td>
                    <td className="px-6 py-4 text-[14px] text-[#7A7A7A]">{category.sortOrder ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className="p-2 rounded-lg text-[#7A7A7A] hover:text-[#2B2B2B] hover:bg-[#F8F5F2] transition-colors"
                          aria-label="Edit category"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="p-2 rounded-lg text-[#7A7A7A] hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
