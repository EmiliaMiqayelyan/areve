import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { apiFetch } from './api';

// --- Types ---
export interface Product {
  id: string;
  name: string;
  price: number | string;
  image: string;
  category: 'bags' | 'toys' | 'accessories';
  badge?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface Review {
  id: string;
  name: string;
  location?: string;
  product: string;
  rating: number;
  comment: string;
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
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  cols: number;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
}

interface AdminStore {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: () => void;
  loginWithApi: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrateFromApi: () => Promise<void>;

  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void> | void;
  deleteProduct: (id: string) => Promise<void>;

  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;

  reviews: Review[];
  addReview: (review: Review) => Promise<void>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<void> | void;
  deleteReview: (id: string) => Promise<void>;

  gallery: GalleryImage[];
  addGalleryImage: (image: GalleryImage) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;

  faqs: FAQ[];
  updateFaq: (index: number, faq: FAQ) => Promise<void>;
}

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
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(name);
  },
};

const ADMIN_STORAGE_KEY = 'areve-admin-storage-v2';
const isAuthErrorMessage = (message: string) => {
  return message.includes('Invalid or expired token') || message.includes('Missing admin token');
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
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
        set({ isAuthenticated: true, token: result.token });
        await get().hydrateFromApi();
      },
      logout: () => {
        // Clear persisted token so we don't get stuck with an expired JWT.
        if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_STORAGE_KEY);
        set({ isAuthenticated: false, token: null, loading: false });
      },
      hydrateFromApi: async () => {
        const token = get().token;
        if (!token) return;
        set({ loading: true });
        try {
          const [products, orders, reviews, gallery, faqs] = await Promise.all([
            apiFetch<Product[]>('/admin/products', {}, token),
            apiFetch<Order[]>('/admin/orders', {}, token),
            apiFetch<Review[]>('/admin/reviews', {}, token),
            apiFetch<GalleryImage[]>('/admin/gallery', {}, token),
            apiFetch<FAQ[]>('/admin/faqs', {}, token),
          ]);
          const normalizedProducts = products.map((p) => ({
            ...p,
            price: Number(p.price ?? 0),
          }));
          const normalizedOrders = orders.map((o) => ({
            ...o,
            total: Number(o.total ?? 0),
            date: o.date ?? o.createdAt ?? new Date().toISOString(),
            items: Array.isArray(o.items) ? o.items : [],
          }));
          set({ products: normalizedProducts, orders: normalizedOrders, reviews, gallery, faqs, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      // Products
      products: [],
      addProduct: async (product) => {
        set((state) => ({ products: [product, ...state.products] }));
        if (get().token) {
          try {
            await apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(product) }, get().token || undefined);
            await get().hydrateFromApi();
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      updateProduct: async (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        if (get().token) {
          try {
            await apiFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) }, get().token || undefined);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },
      deleteProduct: async (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        if (get().token) {
          try {
            await apiFetch(`/admin/products/${id}`, { method: 'DELETE' }, get().token || undefined);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (isAuthErrorMessage(message)) get().logout();
            throw err;
          }
        }
      },

      // Orders
      orders: [],
      updateOrderStatus: async (id, status) => {
        set((state) => ({ orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
        if (get().token) {
          await apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, get().token || undefined);
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
        set((state) => ({ gallery: [image, ...state.gallery] }));
        if (get().token) await apiFetch('/admin/gallery', { method: 'POST', body: JSON.stringify(image) }, get().token || undefined);
      },
      deleteGalleryImage: async (id) => {
        set((state) => ({ gallery: state.gallery.filter((g) => g.id !== id) }));
        if (get().token) await apiFetch(`/admin/gallery/${id}`, { method: 'DELETE' }, get().token || undefined);
      },

      // FAQs
      faqs: [],
      updateFaq: async (index, faq) => {
        const updated = get().faqs.map((f, i) => (i === index ? faq : f));
        set({ faqs: updated });
        if (get().token) await apiFetch('/admin/faqs', { method: 'PUT', body: JSON.stringify(updated) }, get().token || undefined);
      },
    }),
    {
      name: ADMIN_STORAGE_KEY, // Change key to invalidate old structure
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
