import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { apiFetch } from './api';
import { adminProductApiPath, normalizeResourceId, resourceIdsMatch } from './resourceId';
import type { LocalizedText } from './localizedText';

// --- Types ---
export interface Product {
  id: string;
  name: LocalizedText | string;
  price: number | string;
  image: string;
  category: string;
  cost?: number | string;
  badge?: LocalizedText | string | null;
  description?: LocalizedText | string | null;
  status?: 'active' | 'inactive';
  isFavorite?: boolean;
  sortOrder?: number;
}

export interface CategoryItem {
  id: string;
  name: LocalizedText | string;
  sortOrder?: number;
}

export interface Review {
  id: string;
  name: string;
  location?: string;
  product: LocalizedText | string;
  rating: number;
  comment: LocalizedText | string;
  status?: 'approved' | 'pending' | 'rejected';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number | string;
  date?: string;
  createdAt?: string;
  status: 'pending' | 'shipped' | 'delivered';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    unitCost?: number;
    stoneType?: string;
    stoneMm?: string;
    bagSize?: string;
    stonePrice?: number;
    bagPrice?: number;
  }>;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: LocalizedText | string;
  cols: number;
  sortOrder?: number;
}

export interface FAQ {
  id?: string;
  question: LocalizedText | string;
  answer: LocalizedText | string;
}

interface AdminStore {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
  loading: boolean;
  login: () => void;
  loginWithApi: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrateFromApi: () => Promise<void>;
  updateAdminCredentials: (payload: {
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) => Promise<void>;

  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void> | void;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (orderedIds: string[]) => Promise<void>;

  orders: Order[];
  createOrder: (order: any) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  reviews: Review[];
  addReview: (review: Review) => Promise<void>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<void> | void;
  deleteReview: (id: string) => Promise<void>;

  gallery: GalleryImage[];
  addGalleryImage: (image: GalleryImage) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  reorderGallery: (orderedIds: string[]) => Promise<void>;

  faqs: FAQ[];
  updateFaq: (index: number, faq: FAQ) => Promise<void>;
  saveAllFaqs: (faqs: FAQ[]) => Promise<void>;

  categories: CategoryItem[];
  addCategory: (category: CategoryItem) => Promise<void>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const LEGACY_STORAGE_KEYS = ['areve-admin-storage-v2', 'areve-admin-storage'];

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(name);
    if (!raw) return null;
    try {
      JSON.parse(raw);
      return raw;
    } catch {
      window.localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch (error) {
      const isQuota =
        error instanceof DOMException &&
        (error.name === 'QuotaExceededError' || error.code === 22);
      if (!isQuota) throw error;
      // Drop legacy caches that stored full catalogs with base64 images.
      for (const key of LEGACY_STORAGE_KEYS) {
        window.localStorage.removeItem(key);
      }
      try {
        window.localStorage.setItem(name, value);
      } catch {
        // Auth/session remains in memory; catalog reloads from API on hydrate.
      }
    }
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(name);
  },
};

/** Only auth is persisted — products/gallery use data URLs and exceed localStorage quota. */
const ADMIN_STORAGE_KEY = 'areve-admin-storage-v3';
const isAuthErrorMessage = (message: string) => {
  return message.includes('Invalid or expired token') || message.includes('Missing admin token');
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      adminEmail: null,
      loading: false,
      login: () => set({ isAuthenticated: true }),
      loginWithApi: async (email, password) => {
        const result = await apiFetch<{ token: string }>(
          '/admin/auth/login',
          {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          }
        );
        set({ isAuthenticated: true, token: result.token, adminEmail: email });
        await get().hydrateFromApi();
      },
      logout: () => {
        // Clear persisted token so we don't get stuck with an expired JWT.
        if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_STORAGE_KEY);
        set({ isAuthenticated: false, token: null, adminEmail: null, loading: false });
      },
      updateAdminCredentials: async (payload) => {
        const token = get().token;
        if (!token) throw new Error('Not authenticated');
        const result = await apiFetch<{
          token: string;
          admin: { email: string };
        }>(
          '/admin/account/credentials',
          { method: 'PUT', body: JSON.stringify(payload) },
          token
        );
        set({ token: result.token, adminEmail: result.admin.email });
      },
      hydrateFromApi: async () => {
        const token = get().token;
        if (!token) return;
        set({ loading: true });
        try {
          const [products, orders, reviews, gallery, faqs, categories] = await Promise.all([
            apiFetch<Product[]>('/admin/products', {}, token),
            apiFetch<Order[]>('/admin/orders', {}, token),
            apiFetch<Review[]>('/admin/reviews', {}, token),
            apiFetch<GalleryImage[]>('/admin/gallery', {}, token),
            apiFetch<FAQ[]>('/admin/faqs', {}, token),
            apiFetch<CategoryItem[]>('/admin/categories', {}, token),
          ]);
          const normalizedProducts = products.map((p) => ({
            ...p,
            price: Number(p.price ?? 0),
            cost: Number(p.cost ?? 0),
          }));
          const normalizedOrders = orders.map((o) => ({
            ...o,
            total: Number(o.total ?? 0),
            date: o.date ?? o.createdAt ?? new Date().toISOString(),
            address: o.address ?? '',
            city: o.city ?? '',
            state: o.state ?? '',
            zipCode: o.zipCode ?? '',
            items: Array.isArray(o.items)
              ? o.items.map((item) => ({
                  ...item,
                  price: Number(item.price ?? 0),
                  quantity: Number(item.quantity ?? 0),
                  unitCost: Number(item.unitCost ?? 0),
                  stoneType: String(item.stoneType ?? ''),
                  stoneMm: String(item.stoneMm ?? ''),
                  bagSize: String(item.bagSize ?? ''),
                  stonePrice: Number(item.stonePrice ?? 0),
                  bagPrice: Number(item.bagPrice ?? 0),
                }))
              : [],
          }));
          set({ products: normalizedProducts, orders: normalizedOrders, reviews, gallery, faqs, categories, loading: false });
        } catch (err) {
          set({ loading: false });
          const message = err instanceof Error ? err.message : String(err);
          if (isAuthErrorMessage(message)) get().logout();
        }
      },

      // Products
      products: [],
      addProduct: async (product) => {
        if (get().token) {
          try {
            await apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(product) }, get().token || undefined);
            await get().hydrateFromApi();
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        } else {
          set((state) => ({ products: [product, ...state.products] }));
        }
      },
      updateProduct: async (id, updates) => {
        const normalizedId = normalizeResourceId(id);
        set((state) => ({
          products: state.products.map((p) =>
            resourceIdsMatch(p.id, normalizedId) ? { ...p, ...updates } : p
          ),
        }));
        if (get().token) {
          try {
            await apiFetch(
              adminProductApiPath(normalizedId),
              { method: 'PUT', body: JSON.stringify(updates) },
              get().token || undefined
            );
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      deleteProduct: async (id) => {
        const normalizedId = normalizeResourceId(id);
        set((state) => ({
          products: state.products.filter((p) => !resourceIdsMatch(p.id, normalizedId)),
        }));
        if (get().token) {
          try {
            await apiFetch(
              adminProductApiPath(normalizedId),
              { method: 'DELETE' },
              get().token || undefined
            );
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      reorderProducts: async (orderedIds) => {
        const previous = get().products;
        const byId = new Map(get().products.map((item) => [item.id, item]));
        const next: Product[] = [];
        for (let index = 0; index < orderedIds.length; index++) {
          const item = byId.get(orderedIds[index]);
          if (item) next.push({ ...item, sortOrder: index });
        }
        set({ products: next });
        if (get().token) {
          try {
            const rows = await apiFetch<Product[]>(
              '/admin/products/reorder',
              { method: 'PUT', body: JSON.stringify({ ids: orderedIds }) },
              get().token || undefined
            );
            set({ products: rows });
          } catch (err) {
            set({ products: previous });
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },

      // Orders
      orders: [],
      createOrder: async (orderData) => {
        if (get().token) {
          try {
            await apiFetch('/admin/orders', { method: 'POST', body: JSON.stringify(orderData) }, get().token || undefined);
            await get().hydrateFromApi();
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      updateOrder: async (id, updates) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }));
        if (get().token) {
          try {
            await apiFetch(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify(updates) }, get().token || undefined);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      updateOrderStatus: async (id, status) => {
        set((state) => ({ orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
        if (get().token) {
          await apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, get().token || undefined);
        }
      },
      deleteOrder: async (id) => {
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
        if (get().token) {
          try {
            await apiFetch(`/admin/orders/${id}`, { method: 'DELETE' }, get().token || undefined);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },

      // Reviews
      reviews: [],
      addReview: async (review) => {
        set((state) => ({ reviews: [review, ...state.reviews] }));
        if (get().token) await apiFetch('/admin/reviews', { method: 'POST', body: JSON.stringify(review) }, get().token || undefined);
      },
      updateReview: async (id, updates) => {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
        if (get().token) {
          await apiFetch(`/admin/reviews/${id}`, { method: 'PUT', body: JSON.stringify(updates) }, get().token || undefined);
        }
      },
      deleteReview: async (id) => {
        set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) }));
        if (get().token) await apiFetch(`/admin/reviews/${id}`, { method: 'DELETE' }, get().token || undefined);
      },

      // Gallery
      gallery: [],
      addGalleryImage: async (image) => {
        const previous = get().gallery;
        set((state) => ({ gallery: [image, ...state.gallery] }));
        if (get().token) {
          try {
            await apiFetch('/admin/gallery', { method: 'POST', body: JSON.stringify(image) }, get().token || undefined);
            await get().hydrateFromApi();
          } catch (err) {
            set({ gallery: previous });
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      deleteGalleryImage: async (id) => {
        const previous = get().gallery;
        set((state) => ({ gallery: state.gallery.filter((g) => g.id !== id) }));
        if (get().token) {
          try {
            await apiFetch(`/admin/gallery/${id}`, { method: 'DELETE' }, get().token || undefined);
          } catch (err) {
            set({ gallery: previous });
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      reorderGallery: async (orderedIds) => {
        const previous = get().gallery;
        const byId = new Map(get().gallery.map((item) => [item.id, item]));
        const next: GalleryImage[] = [];
        for (let index = 0; index < orderedIds.length; index++) {
          const item = byId.get(orderedIds[index]);
          if (item) next.push({ ...item, sortOrder: index });
        }
        set({ gallery: next });
        if (get().token) {
          try {
            const rows = await apiFetch<GalleryImage[]>(
              '/admin/gallery/reorder',
              { method: 'PUT', body: JSON.stringify({ ids: orderedIds }) },
              get().token || undefined
            );
            set({ gallery: rows });
          } catch (err) {
            set({ gallery: previous });
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },

      // FAQs
      faqs: [],
      updateFaq: async (index, faq) => {
        const updated = get().faqs.map((f, i) => (i === index ? faq : f));
        set({ faqs: updated });
        if (get().token) {
          await apiFetch(
            '/admin/faqs',
            {
              method: 'PUT',
              body: JSON.stringify(updated.map(({ question, answer }) => ({ question, answer }))),
            },
            get().token || undefined
          );
        }
      },
      saveAllFaqs: async (faqs) => {
        set({ faqs });
        if (!get().token) return;
        await apiFetch(
          '/admin/faqs',
          {
            method: 'PUT',
            body: JSON.stringify(faqs.map(({ question, answer }) => ({ question, answer }))),
          },
          get().token || undefined
        );
      },

      categories: [],
      addCategory: async (category) => {
        if (get().token) {
          try {
            await apiFetch('/admin/categories', { method: 'POST', body: JSON.stringify(category) }, get().token || undefined);
            await get().hydrateFromApi();
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        } else {
          set((state) => ({ categories: [...state.categories, category] }));
        }
      },
      updateCategory: async (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
        if (get().token) {
          try {
            await apiFetch(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(updates) }, get().token || undefined);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      deleteCategory: async (id) => {
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
        if (get().token) {
          try {
            await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' }, get().token || undefined);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
    }),
    {
      name: ADMIN_STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
      onRehydrateStorage: () => () => {
        if (typeof window === 'undefined') return;
        for (const key of LEGACY_STORAGE_KEYS) {
          window.localStorage.removeItem(key);
        }
        const { token, hydrateFromApi } = useAdminStore.getState();
        if (token) void hydrateFromApi();
      },
    }
  )
);
