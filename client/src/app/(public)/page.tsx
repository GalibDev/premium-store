'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Sparkles, Star, Store, Users, Zap } from 'lucide-react';
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
const floatingStats = [
  { icon: Users, value: '12K+', label: 'Happy Customers', className: 'right-0 top-[10%]' },
  { icon: Store, value: '18+', label: 'Premium Products', className: '-left-[5%] top-[54%]' },
  { icon: Star, value: '4.9', label: 'Customer Rating', className: 'right-[5%] bottom-[2%]' },
];

export default function HomePage() {
  const { data: featured, isLoading } = useQuery({ queryKey: ['featured-products'], queryFn: async () => (await api.get('/recipes?featured=true&limit=5')).data.items as Recipe[] });
  const { data: popular } = useQuery({ queryKey: ['popular-products'], queryFn: async () => (await api.get('/recipes?sort=popular&limit=5')).data.items as Recipe[] });

  return (
    <>
      <section className="hero-glow overflow-hidden">
        <div className="shell grid min-h-[65vh] items-center gap-10 py-10 lg:grid-cols-[1.02fr_.98fr] lg:py-12">
          <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6 }}>
            <span className="eyebrow"><Sparkles size={14}/> Discover · Access · Create</span>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-.045em] sm:text-6xl xl:text-7xl">
              Premium tools.<br/><span className="text-brand-600">Limitless</span> possibilities.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-base-content/60 sm:text-lg">
              Get trusted access to the digital products you love—from AI and design tools to streaming and productivity—all in one place.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn-brand min-h-12 px-7" href="/recipes">Explore Products <ArrowRight size={18}/></Link>
              <Link className="btn btn-outline min-h-12 px-7" href="/register">Join PremiumStore</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-base-content/55">
              <span className="flex items-center gap-2"><BadgeCheck className="text-brand-600" size={18}/>Verified access</span>
              <span className="flex items-center gap-2"><Zap className="text-amber-500" size={18}/>Fast delivery</span>
              <span className="flex items-center gap-2"><Headphones className="text-sky-500" size={18}/>Friendly support</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .75, delay: .12 }} className="relative mx-auto min-h-[430px] w-full max-w-[590px] sm:min-h-[560px]">
            <div className="absolute inset-[8%] rounded-full bg-amber-200/35 blur-3xl"/>
            <div className="absolute left-1/2 top-1/2 aspect-square w-[82%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[12px] border-white bg-white shadow-2xl sm:border-[16px]">
              <img src="/images/premium-digital-hero.png" alt="Premium digital products on laptop, tablet and mobile" className="size-full object-cover"/>
            </div>
            {['left-[10%] top-[12%]','right-[2%] top-[34%]','left-[3%] bottom-[14%]','right-[20%] bottom-[3%]'].map((position, index) => (
              <motion.span key={position} animate={{ y: [0,-9,0], rotate: [0,index%2?8:-8,0] }} transition={{ duration: 3.2+index*.35, repeat: Infinity }} className={`absolute grid size-10 place-items-center rounded-full bg-white text-brand-600 shadow-soft ${position}`}><Sparkles size={19}/></motion.span>
            ))}
            {floatingStats.map(({ icon: Icon, value, label, className }, index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45+index*.12 }} className={`absolute z-10 flex min-w-40 items-center gap-3 rounded-2xl border border-base-300 bg-base-100/95 p-4 shadow-xl backdrop-blur ${className}`}>
                <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-600"><Icon size={21} fill={label==='Customer Rating'?'currentColor':'none'}/></span>
                <span><b className="block text-xl leading-none">{value}</b><small className="mt-1 block text-xs text-base-content/50">{label}</small></span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-base-300 bg-base-100"><div className="shell flex flex-wrap items-center justify-between gap-6 py-7 text-sm font-bold text-base-content/45">{brands.map((brand) => <span key={brand}>{brand}</span>)}</div></section>
      <section className="section"><div className="shell"><SectionHeading title="Shop by category"/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{categories.map((item) => <Link href={`/recipes?category=${encodeURIComponent(item.label)}`} key={item.label} className="group rounded-3xl border border-base-300 bg-base-100 p-5 shadow-soft transition hover:-translate-y-1"><span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${item.tone}`}>{item.icon}</span><h3 className="mt-4 font-bold">{item.label}</h3><p className="mt-1 text-xs text-base-content/45">Explore deals →</p></Link>)}</div></div></section>
      <section className="section bg-base-200"><div className="shell"><SectionHeading title="Featured deals"/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{isLoading?Array.from({length:5}).map((_,i)=><div key={i} className="h-72 animate-pulse rounded-3xl bg-base-300"/>):featured?.map((product)=><RecipeCard key={product._id} recipe={product} compact/>)}</div></div></section>
      <section className="section"><div className="shell"><SectionHeading title="Popular right now"/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{popular?.map((product)=><RecipeCard key={product._id} recipe={product} compact/>)}</div></div></section>
      <section className="section pt-0"><div className="shell grid gap-5 md:grid-cols-3">{[{icon:Users,value:'12K+',label:'Happy customers'},{icon:Star,value:'4.9/5',label:'Average rating'},{icon:ShieldCheck,value:'100%',label:'Purchase protection'}].map(({icon:Icon,value,label})=><div key={label} className="rounded-3xl border border-base-300 bg-base-100 p-7 text-center shadow-soft"><Icon className="mx-auto text-brand-600" size={30}/><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-base-content/55">{label}</p></div>)}</div></section>
      <section id="about" className="section bg-[#081d17] text-white"><div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><span className="text-sm font-bold uppercase tracking-[.2em] text-amber-400">Sell on PremiumStore</span><h2 className="mt-3 text-4xl font-extrabold">Turn digital products into real income.</h2><p className="mt-3 max-w-2xl text-white/60">List subscriptions, licenses, templates, courses and downloadable assets from one professional dashboard.</p></div><Link href="/dashboard/add" className="btn border-0 bg-white text-slate-900 hover:bg-amber-400">Add your product <ArrowRight size={18}/></Link></div></section>
    </>
  );
}
