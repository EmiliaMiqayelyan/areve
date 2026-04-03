'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, clearCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart}
            style={{ position: 'fixed', inset: 0, background: 'rgba(43,43,43,0.25)', backdropFilter: 'blur(4px)', zIndex: 60 }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: 400, background: '#F8F5F2', zIndex: 70, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(180,156,140,0.18)' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #EADFD8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={18} color="#E6C97A" strokeWidth={1.8} />
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#2B2B2B' }}>Your Bag</span>
                {items.length > 0 && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#AFAFAF' }}>({items.length})</span>}
              </div>
              <button onClick={toggleCart} style={{ background: '#EADFD8', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7A7A7A' }}>
                <X size={15} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, textAlign: 'center' }}>
                  <ShoppingBag size={48} color="#D6C3B3" strokeWidth={1.2} />
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#2B2B2B' }}>Your bag is empty</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#AFAFAF' }}>Discover something beautiful</p>
                  <Link href="/products" onClick={toggleCart} className="btn-primary" style={{ marginTop: 8, textDecoration: 'none' }}>
                    Shop Now
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}
                    style={{ display: 'flex', gap: 12, background: '#fff', borderRadius: 14, padding: 12, border: '1px solid #EADFD8' }}
                  >
                    <div style={{ position: 'relative', width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, color: '#2B2B2B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: '#E6C97A', marginTop: 2 }}>${item.price}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#EADFD8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7A7A' }}><Minus size={11} /></button>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#2B2B2B' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 24, height: 24, borderRadius: '50%', background: '#EADFD8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7A7A' }}><Plus size={11} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AFAFAF', padding: 4, alignSelf: 'flex-start' }}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #EADFD8', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#7A7A7A' }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#2B2B2B' }}>${total().toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', appearance: 'none' }}>Checkout</Link>
                <button onClick={clearCart} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Clear Bag</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
