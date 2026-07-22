'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Headphones, ShieldCheck, Sparkles, Star, Users, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import type { Recipe } from '@/types';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { SectionHeading } from '@/components/shared/section-heading';

const categories = [
  { icon: '🎨', label: 'Design & Creative', tone: 'from-violet-500 to-fuchsia-500' },
  { icon: '🤖', label: 'AI Tools', tone: 'from-emerald-500 to-cyan-500' },
  { icon: '🎬', label: 'Streaming', tone: 'from-rose-500 to-orange-500' },
  { icon: '📚', label: 'Learning', tone: 'from-blue-500 to-indigo-500' },
  { icon: '⚡', label: 'Productivity', tone: 'from-amber-500 to-orange-500' },
  { icon: '🛡️', label: 'Security', tone: 'from-slate-600 to-slate-900' },
];

const brands = ['Canva Pro', 'CapCut Pro', 'ChatGPT Plus', 'Netflix', 'Grammarly', 'Microsoft 365'];
const heroSlides = [
  { eyebrow: 'AI that works at your speed', title: 'ChatGPT Plus', headline: 'Think bigger. Create faster.', description: 'Premium AI access for writing, research, coding and everyday productivity—delivered securely.', price: '৳1,899', oldPrice: '৳2,499', offer: '24% OFF', duration: '1 month', logo: 'https://www.google.com/s2/favicons?domain_url=https://openai.com&sz=256', gradient: 'from-[#071b17] via-[#0d3a2f] to-[#10a37f]', glow: 'bg-emerald-300', href: '/recipes?search=ChatGPT' },
  { eyebrow: 'Entertainment without limits', title: 'Netflix Premium', headline: 'Your next favorite story awaits.', description: 'Enjoy premium streaming access with fast delivery, reliable support and a smooth setup experience.', price: '৳499', oldPrice: '৳699', offer: '29% OFF', duration: '1 month', logo: 'https://www.google.com/s2/favicons?domain_url=https://netflix.com&sz=256', gradient: 'from-[#120506] via-[#3b090c] to-[#b20710]', glow: 'bg-red-400', href: '/recipes?search=Netflix' },
  { eyebrow: 'Design anything, beautifully', title: 'Canva Pro', headline: 'Make every idea look professional.', description: 'Unlock premium templates, brand tools and creative assets for an entire year at a smarter price.', price: '৳1,199', oldPrice: '৳1,799', offer: '33% OFF', duration: '1 year', logo: 'https://www.google.com/s2/favicons?domain_url=https://canva.com&sz=256', gradient: 'from-[#15113d] via-[#4b258f] to-[#7d2ae8]', glow: 'bg-violet-400', href: '/recipes?search=Canva' },
  { eyebrow: 'Create content that moves', title: 'CapCut Pro', headline: 'Edit smarter. Publish faster.', description: 'Professional video tools, premium effects and effortless exports for creators on every platform.', price: '৳899', oldPrice: '৳1,299', offer: '31% OFF', duration: '6 months', logo: 'https://www.google.com/s2/favicons?domain_url=https://capcut.com&sz=256', gradient: 'from-[#020617] via-[#111827] to-[#164e63]', glow: 'bg-cyan-300', href: '/recipes?search=CapCut' },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { data: featured, isLoading } = useQuery({ queryKey: ['featured-products'], queryFn: async () => (await api.get('/recipes?featured=true&limit=5')).data.items as Recipe[] });
  const { data: popular } = useQuery({ queryKey: ['popular-products'], queryFn: async () => (await api.get('/recipes?sort=popular&limit=5')).data.items as Recipe[] });

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 5500);
    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];
  const changeSlide = (direction: number) => setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);

  return (
    <>
      <section className="relative overflow-hidden bg-[#07110e] text-white">
        <AnimatePresence mode="wait">
          <motion.div key={activeSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }} className={`relative bg-gradient-to-br ${slide.gradient}`}>
            <div className={`absolute -right-24 -top-32 size-[32rem] rounded-full ${slide.glow} opacity-20 blur-[120px]`} />
            <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            <div className="shell relative grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-[1.12fr_.88fr] lg:py-20">
              <motion.div initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-white/80 backdrop-blur"><Sparkles size={14} />{slide.eyebrow}</span>
                <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-.045em] sm:text-6xl xl:text-7xl">{slide.headline}</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">{slide.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link href={slide.href} className="btn min-h-12 border-0 bg-white px-7 text-slate-950 shadow-xl hover:bg-amber-300">Shop {slide.title}<ArrowRight size={18}/></Link>
                  <Link href="/recipes" className="inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white">Browse all products <ArrowRight size={16}/></Link>
                </div>
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/55 sm:text-sm">
                  <span className="flex items-center gap-2"><BadgeCheck size={17} className="text-emerald-300"/>Verified access</span>
                  <span className="flex items-center gap-2"><Zap size={17} className="text-amber-300"/>Fast delivery</span>
                  <span className="flex items-center gap-2"><Headphones size={17} className="text-sky-300"/>Dedicated support</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .6, delay: .08 }} className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-8 rounded-full bg-white/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2.25rem] border border-white/15 bg-white/[.09] p-5 shadow-2xl backdrop-blur-xl">
                  <div className="relative grid min-h-[320px] place-items-center overflow-hidden rounded-[1.75rem] bg-white p-10 text-slate-900 sm:min-h-[350px]">
                    <span className="absolute left-5 top-5 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">{slide.offer}</span>
                    <img src={slide.logo} alt={`${slide.title} logo`} className="size-32 object-contain sm:size-40" />
                    <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5"><div><p className="text-sm font-bold text-slate-500">{slide.title}</p><p className="mt-1 text-xs text-slate-400">{slide.duration} premium access</p></div><div className="text-right"><span className="text-xs text-slate-400 line-through">{slide.oldPrice}</span><p className="text-2xl font-black text-slate-950">{slide.price}</p></div></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between px-2 text-xs font-semibold text-white/60"><span>Secure digital delivery</span><span className="flex items-center gap-1 text-emerald-300"><ShieldCheck size={15}/>Purchase protected</span></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-md">
          <button aria-label="Previous slide" onClick={() => changeSlide(-1)} className="grid size-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"><ChevronLeft size={18}/></button>
          {heroSlides.map((item, index) => <button key={item.title} aria-label={`Show ${item.title}`} onClick={() => setActiveSlide(index)} className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-7 bg-white' : 'w-2 bg-white/35 hover:bg-white/60'}`} />)}
          <button aria-label="Next slide" onClick={() => changeSlide(1)} className="grid size-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"><ChevronRight size={18}/></button>
        </div>
      </section>

      <section className="border-y border-base-300 bg-base-100"><div className="shell flex flex-wrap items-center justify-between gap-6 py-7 text-sm font-bold text-base-content/45">{brands.map((brand) => <span key={brand}>{brand}</span>)}</div></section>
      <section className="section"><div className="shell"><SectionHeading title="Shop by category" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{categories.map((item) => <Link href={`/recipes?category=${encodeURIComponent(item.label)}`} key={item.label} className="group rounded-3xl border border-base-300 bg-base-100 p-5 shadow-soft transition hover:-translate-y-1"><span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${item.tone}`}>{item.icon}</span><h3 className="mt-4 font-bold">{item.label}</h3><p className="mt-1 text-xs text-base-content/45">Explore deals →</p></Link>)}</div></div></section>
      <section className="section bg-base-200"><div className="shell"><SectionHeading title="Featured deals" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-base-300" />) : featured?.map((product) => <RecipeCard key={product._id} recipe={product} compact />)}</div></div></section>
      <section className="section"><div className="shell"><SectionHeading title="Popular right now" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{popular?.map((product) => <RecipeCard key={product._id} recipe={product} compact />)}</div></div></section>
      <section className="section pt-0"><div className="shell grid gap-5 md:grid-cols-3">{[{icon: Users,value:'12K+',label:'Happy customers'},{icon: Star,value:'4.9/5',label:'Average rating'},{icon: ShieldCheck,value:'100%',label:'Purchase protection'}].map(({icon:Icon,value,label}) => <div key={label} className="rounded-3xl border border-base-300 bg-base-100 p-7 text-center shadow-soft"><Icon className="mx-auto text-brand-600" size={30}/><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-base-content/55">{label}</p></div>)}</div></section>
      <section id="about" className="section bg-[#081d17] text-white"><div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><span className="text-sm font-bold uppercase tracking-[.2em] text-amber-400">Sell on PremiumStore</span><h2 className="mt-3 text-4xl font-extrabold">Turn digital products into real income.</h2><p className="mt-3 max-w-2xl text-white/60">List subscriptions, licenses, templates, courses and downloadable assets from one professional dashboard.</p></div><Link href="/dashboard/add" className="btn border-0 bg-white text-slate-900 hover:bg-amber-400">Add your product <ArrowRight size={18}/></Link></div></section>
    </>
  );
}
