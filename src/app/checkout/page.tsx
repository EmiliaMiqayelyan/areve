'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { apiFetch } from '@/lib/api';
import { useSiteSettings } from '@/context/SiteSettingsContext';

// Validation Schema
const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(5, 'Please enter your street address'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  zipCode: z.string().min(1, 'ZIP/Postal code is required'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiry: z.string().min(5, 'Expiration date must be MM/YY'),
  cvc: z.string().min(3, 'CVC is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Avoid hydration mismatch by rendering only after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });
      setIsSuccess(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  const orderTotal = total();
  const shippingCost = 0; // Free shipping
  const finalTotal = orderTotal + shippingCost;

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-ivory">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-2xl shadow-[0_8px_40px_rgba(180,156,140,0.15)]"
        >
          <div className="mx-auto w-20 h-20 bg-sage/20 text-sage rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-[#3d4d38]" />
          </div>
          <h1 className="text-3xl font-serif text-ink">Order Confirmed</h1>
          <p className="text-subtle font-sans">
            Thank you for your order! We{"'"}ve received your request and will begin handcrafting your items soon. A confirmation email has been sent to you.
          </p>
          <Link href="/products" className="btn-primary w-full justify-center mt-8">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-ivory">
        <ShoppingBag size={64} className="text-[#D6C3B3] mb-6" strokeWidth={1} />
        <h1 className="text-3xl font-serif text-ink mb-4">Your bag is empty</h1>
        <p className="text-subtle font-sans mb-8">It seems you haven{"'"}t added any items to your order yet.</p>
        <Link href="/products" className="btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <Link href="/products" className="inline-flex items-center gap-2 text-subtle hover:text-gold transition-colors font-sans text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <SectionHeader title={co.title} subtitle={co.subtitle} centered={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Contact Information */}
              <div className="card p-8">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-beige text-ink flex items-center justify-center text-sm font-bold">1</span>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5 font-sans">Email Address</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="field"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card p-8">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-beige text-ink flex items-center justify-center text-sm font-bold">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5 font-sans">First Name</label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className="field"
                      placeholder="Jane"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1 font-sans">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5 font-sans">Last Name</label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className="field"
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1 font-sans">{errors.lastName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink mb-1.5 font-sans">Street Address</label>
                    <input
                      {...register('address')}
                      type="text"
                      className="field"
                      placeholder="123 Artisan Way"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1 font-sans">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5 font-sans">City</label>
                    <input
                      {...register('city')}
                      type="text"
                      className="field"
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-sans">{errors.city.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5 font-sans">State</label>
                      <input
                        {...register('state')}
                        type="text"
                        className="field"
                        placeholder="NY"
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1 font-sans">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5 font-sans">ZIP Code</label>
                      <input
                        {...register('zipCode')}
                        type="text"
                        className="field"
                        placeholder="10001"
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1 font-sans">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-8">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-beige text-ink flex items-center justify-center text-sm font-bold">3</span>
                  Payment Details
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border border-[#EADFD8] rounded-xl flex items-start gap-4 bg-gray-50/50 mb-6">
                    <Lock className="text-subtle shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-subtle font-sans">
                      This is a secure 128-bit SSL encrypted payment. Your details are safe with us. This is a demo store, so please use a dummy card number.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink mb-1.5 font-sans">Card Number</label>
                    <div className="relative">
                      <input
                        {...register('cardNumber')}
                        type="text"
                        className="field pl-10"
                        placeholder="0000 0000 0000 0000"
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 9V15C2 17.8284 2 19.2426 2.87868 20.1213C3.75736 21 5.17157 21 8 21H16C18.8284 21 20.2426 21 21.1213 20.1213C22 19.2426 22 17.8284 22 15V9M2 9V8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2H16C18.8284 2 20.2426 2 21.1213 2.87868C22 3.75736 22 5.17157 22 8V9M2 9H22M6 16H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1 font-sans">{errors.cardNumber.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5 font-sans">Expiration (MM/YY)</label>
                      <input
                        {...register('expiry')}
                        type="text"
                        className="field"
                        placeholder="MM/YY"
                      />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1 font-sans">{errors.expiry.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5 font-sans">CVC</label>
                      <input
                        {...register('cvc')}
                        type="text"
                        className="field"
                        placeholder="123"
                      />
                      {errors.cvc && <p className="text-red-500 text-xs mt-1 font-sans">{errors.cvc.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button for Mobile (Hidden on Desktop, shown via Order Summary instead usually, but good to have) */}
              <div className="block lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center py-4 text-sm"
                >
                  {isSubmitting ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-serif mb-6 text-ink">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-beige">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-sans font-bold z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-ink truncate">{item.name}</p>
                      <p className="font-sans text-xs text-subtle mt-1">{item.category}</p>
                    </div>
                    <div className="font-serif text-sm font-medium text-ink">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EADFD8] pt-4 space-y-3 font-sans text-sm">
                <div className="flex justify-between text-subtle">
                  <span>Subtotal</span>
                  <span className="text-ink">${orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-subtle">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-sage font-medium" : "text-ink"}>
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#EADFD8] mt-4 pt-4 flex justify-between items-center">
                <span className="font-sans font-medium text-ink">Total</span>
                <span className="font-serif text-2xl text-ink">${finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="btn-primary w-full justify-center mt-8 py-4 text-sm hidden lg:flex"
              >
                {isSubmitting ? 'Processing...' : `Place Order`}
              </button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-subtle font-sans">
                  <ShieldCheck size={18} className="text-sage" />
                  <span>Safe and secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-subtle font-sans">
                  <Truck size={18} className="text-[#BFA6A0]" />
                  <span>Free shipping on all orders</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
