'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, TrendingUp, Quote } from 'lucide-react'
import { testimonials } from '@/data'

export function Testimonials() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive((p) => (p + 1) % testimonials.length)

  return (
    <section className="bg-light-base dark:bg-dark-base py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-red-primary uppercase mb-4"
          >
            Investor Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight"
          >
            Real investors,{' '}
            <span className="gradient-text">real results</span>
          </motion.h2>
        </div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto mb-10"
        >
          <div className="glass-card rounded p-8 lg:p-12 text-center relative overflow-hidden">
            {/* Quote icon */}
            <div className="absolute top-6 right-8 opacity-10">
              <Quote size={80} className="text-red-primary" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#DC2626" className="text-red-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg lg:text-xl text-dark-base dark:text-light-base leading-relaxed mb-8 font-medium">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </blockquote>

                {/* Profit badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-primary/10 border border-red-primary/20 mb-6">
                  <TrendingUp size={14} className="text-red-primary" />
                  <span className="text-sm font-bold text-red-primary">
                    {testimonials[active].profit} in {testimonials[active].period}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={testimonials[active].image}
                    alt={testimonials[active].name}
                    className="w-10 h-10 object-cover grayscale"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-dark-base dark:text-light-base">
                      {testimonials[active].name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {testimonials[active].role} · {testimonials[active].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Controls + dots */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-9 h-9 rounded glass-card flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-primary hover:border-red-primary border border-light-border dark:border-dark-border transition-colors duration-200 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 cursor-pointer ${i === active ? 'w-6 h-1.5 bg-red-primary' : 'w-2 h-1.5 bg-light-border dark:bg-dark-border hover:bg-red-primary/50'}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-9 h-9 rounded glass-card flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-primary hover:border-red-primary border border-light-border dark:border-dark-border transition-colors duration-200 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Mini cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {testimonials.map((t, i) => (
            <motion.button
              key={t.name}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`glass-card rounded p-4 text-left transition-all duration-200 cursor-pointer ${active === i ? 'ring-2 ring-red-primary' : ''}`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-7 h-7 object-cover grayscale"
                />
                <div>
                  <p className="text-xs font-bold text-dark-base dark:text-light-base">{t.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-red-primary">{t.profit}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.period}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
