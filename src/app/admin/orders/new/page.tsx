'use client';

import { useAdminStore } from '@/lib/adminStore';
import { ArrowLeft, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { pickLocalized } from '@/lib/localizedText';

export default function NewOrderPage() {
  const router = useRouter();
  const { products, createOrder } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [orderItems, setOrderItems] = useState<Array<{ id: string; name: string; quantity: number; price: number }>>([]);

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = orderItems.find(item => item.id === productId);
    if (existing) {
      setOrderItems(orderItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setOrderItems([...orderItems, { 
        id: product.id, 
        name: pickLocalized(product.name, 'hy'), 
        quantity: 1, 
        price: Number(product.price) 
      }]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Please add at least one item');
      return;
    }
    setIsSubmitting(true);
    try {
      await createOrder({
        ...formData,
        items: orderItems,
      });
      router.push('/admin/orders');
    } catch (err) {
      alert('Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Create New Order</h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">Manually enter a new order into the system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Customer & Shipping */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#EADFD8] shadow-sm space-y-6">
            <h3 className="text-[16px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4 mb-2">Customer Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">First Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">Last Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">Shipping Address</label>
              <input 
                required
                type="text" 
                placeholder="Street address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">City</label>
                <input 
                  required
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">State</label>
                <input 
                  required
                  type="text" 
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-[#7A7A7A] uppercase tracking-wider ml-1">ZIP</label>
                <input 
                  required
                  type="text" 
                  value={formData.zipCode}
                  onChange={e => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#F8F5F2] border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#E6C97A]/50 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EADFD8] shadow-sm space-y-6">
            <h3 className="text-[16px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-4 mb-2 flex items-center justify-between">
              Order Items
              <span className="text-[12px] font-normal text-[#AFAFAF]">{orderItems.length} items added</span>
            </h3>

            {orderItems.length === 0 ? (
              <div className="py-12 text-center bg-[#F8F5F2] rounded-2xl border-2 border-dashed border-[#EADFD8]">
                <ShoppingBag className="mx-auto text-[#D6C3B3] mb-3" size={32} />
                <p className="text-[#7A7A7A] text-[14px]">No items added to this order yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-[#F8F5F2] rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#BFA6A0] font-bold text-[18px]">
                        {item.quantity}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#2B2B2B]">{item.name}</p>
                        <p className="text-[12px] text-[#AFAFAF]">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-[15px] font-bold text-[#2B2B2B]">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-[#D6C3B3] hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Selector & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EADFD8] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] mb-4">Add Products</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {products.filter(p => p.status === 'active').map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddItem(product.id)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-[#F8F5F2] rounded-xl transition-colors group text-left"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F8F5F2] shrink-0">
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#2B2B2B] truncate">{pickLocalized(product.name, 'hy')}</p>
                    <p className="text-[11px] text-[#AFAFAF]">${Number(product.price).toFixed(2)}</p>
                  </div>
                  <Plus size={16} className="text-[#D6C3B3] group-hover:text-[#E6C97A] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EADFD8] shadow-sm space-y-4">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] border-b border-[#EADFD8] pb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[13px] text-[#7A7A7A]">
                <span>Items Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#7A7A7A]">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="pt-3 border-t border-[#EADFD8] flex justify-between text-[16px] font-bold text-[#2B2B2B]">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              disabled={isSubmitting || orderItems.length === 0}
              type="submit"
              className="w-full py-4 bg-[#E6C97A] text-[#5a4a1e] rounded-2xl font-bold text-[14px] shadow-lg shadow-[#E6C97A]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 mt-4"
            >
              {isSubmitting ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
