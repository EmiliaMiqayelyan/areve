'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Mail, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';
import NextImg from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { apiFetch } from '@/lib/api';

const WA = () => (
  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const IG_ICON = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FB_ICON = () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
});

type F = z.infer<typeof schema>;

export default function ContactPage() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({ 
    resolver: zodResolver(schema) 
  });

  const onSubmit = async (data: F) => {
    await apiFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setDone(true);
    reset();
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: '#EADFD8', padding: '80px 24px 64px', borderBottom: '1px solid #D6C3B3' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader 
            eyebrow="Get in Touch" 
            title="We'd Love to Hear from You" 
            subtitle="Choose the preferred way to connect — traditional inquiry or direct social messaging." 
            centered 
          />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 64 }}>

          {/* LEFT SIDE: Info & Small Form */}
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#2B2B2B', marginBottom: 16 }}>Inquiries</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#7A7A7A', lineHeight: 1.7, marginBottom: 32 }}>
                Have a question or want to discuss a project? Fill out this quick form and we'll get back to you soon.
              </p>

              {done ? (
                <div style={{ background: '#C7D3C020', borderRadius: 20, padding: '32px', border: '1px dashed #C7D3C0', textAlign: 'center' }}>
                  <CheckCircle size={32} color="#C7D3C0" style={{ marginBottom: 12 }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#3d4d38', fontWeight: 500 }}>Message received! We'll reply within 24 hours.</p>
                  <button onClick={() => setDone(false)} style={{ marginTop: 12, fontSize: 13, color: '#7A7A7A', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <input {...register('name')} placeholder="Name" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EADFD8', background: '#fff', fontSize: 14, outline: 'none' }} />
                      {errors.name && <p style={{ fontSize: 11, color: '#c97a7a', marginTop: 4 }}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <input {...register('email')} placeholder="Email" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EADFD8', background: '#fff', fontSize: 14, outline: 'none' }} />
                      {errors.email && <p style={{ fontSize: 11, color: '#c97a7a', marginTop: 4 }}>{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <textarea {...register('message')} placeholder="How can we help?" rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EADFD8', background: '#fff', fontSize: 14, outline: 'none', resize: 'none' }} />
                    {errors.message && <p style={{ fontSize: 11, color: '#c97a7a', marginTop: 4 }}>{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} style={{ padding: '12px', background: '#2B2B2B', color: '#fff', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                    {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Details & Socials */}
            <div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#2B2B2B', marginBottom: 20 }}>Contact Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA6A0' }}>
                    <Mail size={16} />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#7A7A7A' }}>hello@areve.handmade</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F8F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA6A0' }}>
                    <MessageCircle size={16} />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#7A7A7A' }}>+374 XX XXX XXXX</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                {[
                  { icon: <IG_ICON />, href: 'https://instagram.com/areve.handmade' },
                  { icon: <FB_ICON />, href: 'https://facebook.com' }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1px solid #EADFD8', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BFA6A0', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#E6C97A';
                        e.currentTarget.style.color = '#5a4a1e';
                        e.currentTarget.style.borderColor = '#E6C97A';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#BFA6A0';
                        e.currentTarget.style.borderColor = '#EADFD8';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Direct Ordering Cards */}
          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#2B2B2B', marginBottom: 12 }}>Direct Ordering</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#7A7A7A' }}>The fastest way to custom order or get product advice.</p>
              </div>

              {/* WhatsApp Card */}
              <motion.div 
                whileHover={{ y: -8 }}
                style={{ 
                  background: '#fff', 
                  borderRadius: 24, 
                  padding: 32, 
                  border: '1px solid #EADFD8',
                  boxShadow: '0 12px 30px rgba(180, 156, 140, 0.06)',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#25D36615', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <WA />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#2B2B2B', marginBottom: 8 }}>WhatsApp Chat</h4>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#7A7A7A', marginBottom: 24 }}>Order directly or get real-time advice via WhatsApp.</p>
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', 
                    background: '#25D366', color: '#fff', borderRadius: 12, textDecoration: 'none', 
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 
                  }}
                >
                  Start Ordering <ExternalLink size={14} />
                </a>
              </motion.div>

              {/* Instagram Card */}
              <motion.div 
                whileHover={{ y: -8 }}
                style={{ 
                  background: '#fff', 
                  borderRadius: 24, 
                  padding: 32, 
                  border: '1px solid #EADFD8',
                  boxShadow: '0 12px 30px rgba(180, 156, 140, 0.06)',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: 56, height: 56, borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
                }}>
                  <div style={{ transform: 'scale(1.2)' }}><IG_ICON /></div>
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#2B2B2B', marginBottom: 8 }}>Instagram DM</h4>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#7A7A7A', marginBottom: 24 }}>Message us on Instagram for custom requests and arrivals.</p>
                <a 
                  href="https://instagram.com/areve.handmade" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', 
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
                    color: '#fff', borderRadius: 12, textDecoration: 'none', 
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 
                  }}
                >
                  Message on Instagram <ExternalLink size={14} />
                </a>
              </motion.div>

            </div>
          </motion.div>

        </div>

        {/* Studio Image Section */}
        <div style={{ marginTop: 100, borderRadius: 32, overflow: 'hidden', height: 400, position: 'relative' }}>
          <NextImg 
            src="/images/gallery-light-3.png" 
            alt="AREVÉ Studio" 
            fill 
            style={{ objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 64px' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontStyle: 'italic', color: '#fff', maxWidth: 450 }}>
              "Every piece is a tiny sun — made with warmth."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
