'use client'

import { Bell, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTopBarContext } from './TopBarContext'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { onMenuOpen } = useTopBarContext()

  return (
    <header className="h-16 sticky top-0 z-30 bg-light-base dark:bg-dark-base border-b border-light-border dark:border-dark-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold text-dark-base dark:text-white leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="w-8 h-8 flex items-center justify-center border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-primary rounded-full" />
        </button>
        <ThemeToggle />
        <div className="w-8 h-8 bg-red-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">JD</span>
        </div>
      </div>
    </header>
  )
}
