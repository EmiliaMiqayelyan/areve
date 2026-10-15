import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import Reveal from '@/components/ui/Reveal';
import SunMark from '@/components/ui/SunMark';

type Copy = {
  eyebrow: string;
  title: string;
  text: string;
  whatsappLabel: string;
  contactLabel: string;
  contactHref: string;
};

export default function CustomOrderBand({ copy, whatsappUrl }: { copy: Copy; whatsappUrl?: string }) {
  return (
    <section className="relative overflow-hidden bg-secondary text-background">
      <SunMark
        className="pointer-events-none absolute -bottom-10 left-1/2 w-[760px] max-w-none -translate-x-1/2 text-primary/[0.12] lg:left-auto lg:right-[-120px] lg:translate-x-0"
        strokeWidth={0.7}
      />
      <Reveal className="wrap relative grid items-end gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <p className="eyebrow eyebrow-line mb-5 text-accent">{copy.eyebrow}</p>
          <h2 className="section-title text-background">{copy.title}</h2>
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-background/70 sm:text-[16px]">{copy.text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <WhatsAppIcon size={16} /> {copy.whatsappLabel}
            </a>
          )}
          <Link href={copy.contactHref} className="btn btn-ghost-light">
            {copy.contactLabel} <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
