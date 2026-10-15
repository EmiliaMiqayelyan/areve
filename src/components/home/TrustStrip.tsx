import { HandHeart, MapPin, MessageCircle, Sparkles } from 'lucide-react';

const ICONS = [HandHeart, MapPin, MessageCircle, Sparkles];

export default function TrustStrip({ items }: { items: ReadonlyArray<{ title: string; text: string }> }) {
  return (
    <section aria-label="AREVÉ" className="border-y border-border bg-background">
      <ul className="wrap grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <li
              key={item.title}
              className={`flex items-start gap-3 py-5 sm:gap-4 sm:py-6 ${i % 2 === 1 ? 'pl-4 sm:pl-6' : 'pr-4 sm:pr-6'} ${
                i >= 2 ? 'border-t border-border lg:border-t-0' : ''
              } ${i % 2 === 1 ? 'border-l border-border' : ''} ${
                i === 2 ? 'lg:border-l lg:pl-6' : ''
              } ${i >= 1 ? 'lg:pl-6' : ''}`}
            >
              <Icon size={20} strokeWidth={1.3} className="mt-0.5 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug text-text sm:text-[14px]">{item.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted sm:text-[13px]">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
