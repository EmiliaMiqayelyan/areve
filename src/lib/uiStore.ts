import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ModalState {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UIStore {
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  
  // Modal
  modal: ModalState;
  showAlert: (message: string, title?: string) => void;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Toasts logic
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Modal logic
  modal: {
    isOpen: false,
    type: 'alert',
    message: '',
  },
  showAlert: (message, title = 'Notification') => {
    set({
      modal: {
        isOpen: true,
        type: 'alert',
        title,
        message,
        onConfirm: () => get().closeModal(),
      },
    });
  },
  showConfirm: (message, title = 'Are you sure?') => {
    return new Promise((resolve) => {
      set({
        modal: {
          isOpen: true,
          type: 'confirm',
          title,
          message,
          onConfirm: () => {
            get().closeModal();
            resolve(true);
          },
          onCancel: () => {
            get().closeModal();
            resolve(false);
          },
        },
      });
    });
  },
  closeModal: () => {
    set((state) => ({
      modal: { ...state.modal, isOpen: false },
    }));
  },
}));

// Convenience helpers
export const toast = {
  success: (msg: string) => useUIStore.getState().addToast(msg, 'success'),
  error: (msg: string) => useUIStore.getState().addToast(msg, 'error'),
  info: (msg: string) => useUIStore.getState().addToast(msg, 'info'),
};

export const modal = {
  alert: (msg: string, title?: string) => useUIStore.getState().showAlert(msg, title),
  confirm: (msg: string, title?: string) => useUIStore.getState().showConfirm(msg, title),
};
