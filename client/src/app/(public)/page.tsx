'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Clock3, Download, Headphones, ShieldCheck, Sparkles, Star, Users, Zap } from 'lucide-react';
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

export default function HomePage() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => (await api.get('/recipes?featured=true&limit=5')).data.items as Recipe[],
  });
  const { data: popular } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => (await api.get('/recipes?sort=popular&limit=5')).data.items as Recipe[],
  });

  return (
    <>
      <section className="hero-glow overflow-hidden">
        <div className="shell grid min-h-[650px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles size={14} /> Premium access, smarter prices</span>
            <h1 className="mt-6 max-w-2xl text-5xl font-extrabold leading-[1.04] sm:text-7xl">
              Everything premium. <span className="text-brand-600">One trusted store.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-base-content/65">
              Get instant access to the digital tools and entertainment you love—verified, affordable, and delivered fast.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn-brand" href="/recipes">Explore products <ArrowRight size={18} /></Link>
              <Link className="btn btn-outline" href="/register">Start selling</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold text-base-content/60">
              <span className="flex items-center gap-2"><ShieldCheck className="text-brand-600" size={18} /> Secure checkout</span>
              <span className="flex items-center gap-2"><Zap className="text-amber-500" size={18} /> Instant delivery</span>
              <span className="flex items-center gap-2"><Headphones className="text-sky-500" size={18} /> Human support</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-10 rounded-full bg-brand-300/20 blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-white/70 bg-white/75 p-5 shadow-2xl backdrop-blur dark:bg-slate-900/80">
              <div className="rounded-[2rem] bg-gradient-to-br from-[#0b1f19] via-[#123d30] to-brand-600 p-7 text-white">
                <p className="text-sm text-white/60">Trending bundle</p>
                <h2 className="mt-2 text-3xl font-extrabold">Creator Power Pack</h2>
                <p className="mt-2 text-white/65">Canva Pro + CapCut Pro + ChatGPT Plus</p>
                <div className="my-8 grid grid-cols-3 gap-3">
                  {['CA', 'CC', 'AI'].map((item) => <div key={item} className="grid aspect-square place-items-center rounded-2xl bg-white/10 text-xl font-black ring-1 ring-white/15">{item}</div>)}
                </div>
                <div className="flex items-end justify-between"><div><span className="text-sm text-white/50 line-through">৳1,499</span><p className="text-3xl font-black">৳799</p></div><span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">SAVE 47%</span></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-bold"><span className="rounded-2xl bg-base-200 p-3"><Download className="mx-auto mb-1 text-brand-600" size={18}/>Instant</span><span className="rounded-2xl bg-base-200 p-3"><BadgeCheck className="mx-auto mb-1 text-brand-600" size={18}/>Verified</span><span className="rounded-2xl bg-base-200 p-3"><Clock3 className="mx-auto mb-1 text-brand-600" size={18}/>30 days</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-base-300 bg-base-100"><div className="shell flex flex-wrap items-center justify-between gap-6 py-7 text-sm font-bold text-base-content/45">{brands.map((brand) => <span key={brand}>{brand}</span>)}</div></section>

      <section className="section"><div className="shell"><SectionHeading title="Shop by category" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{categories.map((item) => <Link href={`/recipes?category=${encodeURIComponent(item.label)}`} key={item.label} className="group rounded-3xl border border-base-300 bg-base-100 p-5 shadow-soft transition hover:-translate-y-1"><span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${item.tone}`}>{item.icon}</span><h3 className="mt-4 font-bold">{item.label}</h3><p className="mt-1 text-xs text-base-content/45">Explore deals →</p></Link>)}</div></div></section>

      <section className="section bg-base-200"><div className="shell"><SectionHeading title="Featured deals" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-base-300" />) : featured?.map((product) => <RecipeCard key={product._id} recipe={product} compact />)}</div>
      </div></section>

      <section className="section"><div className="shell"><SectionHeading title="Popular right now" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{popular?.map((product) => <RecipeCard key={product._id} recipe={product} compact />)}</div></div></section>

      <section className="section pt-0"><div className="shell grid gap-5 md:grid-cols-3">
        {[{icon: Users,value:'12K+',label:'Happy customers'},{icon: Star,value:'4.9/5',label:'Average rating'},{icon: ShieldCheck,value:'100%',label:'Purchase protection'}].map(({icon:Icon,value,label}) => <div key={label} className="rounded-3xl border border-base-300 bg-base-100 p-7 text-center shadow-soft"><Icon className="mx-auto text-brand-600" size={30}/><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-base-content/55">{label}</p></div>)}
      </div></section>

      <section id="about" className="section bg-[#081d17] text-white"><div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><span className="text-sm font-bold uppercase tracking-[.2em] text-amber-400">Sell on PremiumStore</span><h2 className="mt-3 text-4xl font-extrabold">Turn digital products into real income.</h2><p className="mt-3 max-w-2xl text-white/60">List subscriptions, licenses, templates, courses and downloadable assets from one professional dashboard.</p></div><Link href="/dashboard/add" className="btn border-0 bg-white text-slate-900 hover:bg-amber-400">Add your product <ArrowRight size={18}/></Link></div></section>
    </>
  );
}
