'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const
type Range = typeof timeRanges[number]

const rangeToDays: Record<Range, string> = {
  '1D':  '1',
  '1W':  '7',
  '1M':  '30',
  '3M':  '90',
  '1Y':  '365',
  'ALL': 'max',
}

function buildPaths(data: number[]) {
  const w = 600, h = 160, pad = 8
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: pad + ((max - v) / range) * (h - pad * 2),
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts.at(-1)!.x.toFixed(1)},${h} L0,${h} Z`
  return { line, area }
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function BTCChart() {
  const [range,     setRange]     = useState<Range>('1W')
  const [prices,    setPrices]    = useState<number[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(false)

  const fetch_ = useCallback(async (r: Range) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${rangeToDays[r]}`,
        { next: { revalidate: 0 } }
      )
      if (!res.ok) throw new Error()
      const { prices: raw } = await res.json() as { prices: [number, number][] }
      setPrices(raw.map(p => p[1]))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_(range) }, [range, fetch_])

  const currentPrice = prices.at(-1) ?? 0
  const openPrice    = prices.at(0)  ?? 0
  const change       = currentPrice - openPrice
  const changePct    = openPrice ? (change / openPrice) * 100 : 0
  const isUp         = change >= 0

  const { line, area } = prices.length >= 2
    ? buildPaths(prices)
    : { line: '', area: '' }

  const stroke = isUp ? '#10B981' : '#DC2626'
  const gradId = isUp ? 'btcGradUp' : 'btcGradDown'
  const gradColor = isUp ? '#10B981' : '#DC2626'

  return (
    <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border p-5 sm:p-6">
      {/* Header row */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* BTC icon */}
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold" style={{ fontSize: 10 }}>₿</span>
            </div>
            <h2 className="text-sm font-bold text-dark-base dark:text-white">Bitcoin (BTC/USD)</h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-light-surface dark:bg-dark-surface text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live</span>
          </div>

          {loading ? (
            <div className="h-8 flex items-center">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <p className="text-xs text-slate-400">Price unavailable</p>
          ) : (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-dark-base dark:text-white tracking-tight">
                ${formatPrice(currentPrice)}
              </span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? 'text-emerald-500' : 'text-red-primary'}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? '+' : ''}{formatPrice(change)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
              </div>
            </div>
          )}
        </div>

        {/* Time range tabs */}
        <div className="flex gap-1">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 text-[11px] font-semibold transition-colors ${
                range === r
                  ? 'bg-red-primary text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 160 }}>
          <Loader2 size={20} className="animate-spin text-slate-300 dark:text-slate-600" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: 160 }}>
          Could not load chart data
        </div>
      ) : prices.length >= 2 ? (
        <svg viewBox="0 0 600 160" className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={gradColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={gradColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradId})`} />
          <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      ) : null}

      {/* Footer: high / low */}
      {!loading && !error && prices.length >= 2 && (
        <div className="flex gap-5 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span>High: <span className="font-semibold text-dark-base dark:text-white">${formatPrice(Math.max(...prices))}</span></span>
          <span>Low: <span className="font-semibold text-dark-base dark:text-white">${formatPrice(Math.min(...prices))}</span></span>
          <span className="ml-auto">via CoinGecko</span>
        </div>
      )}
    </div>
  )
}
