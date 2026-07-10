'use client';

import { useAdminStore } from '@/lib/adminStore';
import { useState, useEffect } from 'react';
import { ArrowLeft, Package, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import AdminSelect from '@/components/admin/AdminSelect';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import { formatPrice } from '@/lib/currency';

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus, updateOrder } = useAdminStore();
  const order = orders.find(o => o.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (order && !formData) {
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        address: order.address || '',
        city: order.city || '',
        state: order.state || '',
        zipCode: order.zipCode || ''
      });
    }
  }, [order, formData]);

  const handleSave = async () => {
    if (!order) return;
    try {
      setSaving(true);
      await updateOrder(order.id, formData);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold mb-4 font-serif text-[#2B2B2B]">Order not found</h2>
        <Link href="/admin/orders" className="text-[#E6C97A] hover:underline">Return to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 text-[#AFAFAF] hover:text-[#2B2B2B] hover:bg-white rounded-xl transition-colors shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-[#2B2B2B]">Order {order.id}</h1>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                  order.status === 'shipped' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-[#F8F5F2] text-[#7A7A7A] border-[#EADFD8]'
                }`}>
                {order.status}
              </span>
            </div>
            <p className="text-[13px] text-[#7A7A7A] mt-1">
              {order.date ? new Date(order.date).toLocaleString() : 'Date N/A'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <AdminSaveButton
              type="button"
              loading={saving}
              loadingLabel="Saving..."
              compact
              className="px-4 py-2 font-medium"
              onClick={() => void handleSave()}
            >
              Save Changes
            </AdminSaveButton>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl text-[13px] font-medium transition-colors bg-white border border-[#EADFD8] text-[#2B2B2B] hover:bg-[#F8F5F2]"
            >
              Edit Details
            </button>
          )}
          {isEditing && (
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-[13px] font-medium bg-white border border-red-100 text-red-500 hover:bg-red-50"
            >
              Cancel
            </button>
          )}
          <AdminSelect
            value={order.status}
            onChange={(next) => updateOrderStatus(order.id, next as 'pending' | 'shipped' | 'delivered')}
            options={ORDER_STATUS_OPTIONS}
            className="w-[180px]"
            menuAlign="left"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm">
             <h3 className="text-[15px] font-bold text-[#2B2B2B] flex items-center gap-2 mb-4 border-b border-[#EADFD8] pb-4">
               <Package size={18} className="text-[#AFAFAF]" /> Ordered Items
             </h3>
             <div className="space-y-4">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#EADFD8] last:border-0 pl-2">
                    <div>
                      <p className="text-[14px] font-bold text-[#2B2B2B]">{item.name}</p>
                      <p className="text-[13px] text-[#AFAFAF] mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-[14px] font-bold text-[#2B2B2B]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
             </div>
             
             <div className="mt-6 border-t border-[#EADFD8] pt-4 space-y-2 text-right">
                <div className="flex justify-end gap-12 text-[13px] text-[#7A7A7A]">
                  <span>Subtotal</span>
                  <span className="w-20 text-[#2B2B2B] font-medium">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-end gap-12 text-[13px] text-[#7A7A7A]">
                   <span>Shipping</span>
                   <span className="w-20 text-[#2B2B2B] font-medium">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-end gap-12 text-[15px] font-bold text-[#2B2B2B] pt-2">
                   <span>Total</span>
                   <span className="w-20">{formatPrice(order.total)}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] flex items-center gap-2 mb-4 border-b border-[#EADFD8] pb-4">
              <User size={18} className="text-[#AFAFAF]" /> Customer
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold text-[#7A7A7A] uppercase tracking-wider">Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                    className="w-full mt-1 px-3 py-1.5 bg-[#F8F5F2] border-none rounded-lg text-[14px] focus:ring-1 focus:ring-[#E6C97A]"
                  />
                ) : (
                  <p className="text-[14px] text-[#2B2B2B] font-medium mt-0.5">{order.customerName}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#7A7A7A] uppercase tracking-wider">Contact</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.customerEmail}
                    onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                    className="w-full mt-1 px-3 py-1.5 bg-[#F8F5F2] border-none rounded-lg text-[14px] focus:ring-1 focus:ring-[#E6C97A]"
                  />
                ) : (
                  <a href={`mailto:${order.customerEmail}`} className="text-[14px] text-[#E6C97A] hover:underline mt-0.5 block">{order.customerEmail}</a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EADFD8] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#2B2B2B] flex items-center gap-2 mb-4 border-b border-[#EADFD8] pb-4">
              <MapPin size={18} className="text-[#AFAFAF]" /> Shipping Address
            </h3>
            <div className="text-[14px] text-[#2B2B2B] leading-relaxed space-y-2">
              {isEditing ? (
                <>
                  <input 
                    type="text" 
                    placeholder="Address"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-1.5 bg-[#F8F5F2] border-none rounded-lg text-[14px] focus:ring-1 focus:ring-[#E6C97A]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="City"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-1.5 bg-[#F8F5F2] border-none rounded-lg text-[14px] focus:ring-1 focus:ring-[#E6C97A]"
                    />
                    <input 
                      type="text" 
                      placeholder="State"
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      className="w-full px-3 py-1.5 bg-[#F8F5F2] border-none rounded-lg text-[14px] focus:ring-1 focus:ring-[#E6C97A]"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={e => setFormData({...formData, zipCode: e.target.value})}
                    className="w-full px-3 py-1.5 bg-[#F8F5F2] border-none rounded-lg text-[14px] focus:ring-1 focus:ring-[#E6C97A]"
                  />
                </>
              ) : (
                <>
                  <p className="font-medium">{order.customerName}</p>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.state} {order.zipCode}</p>
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
