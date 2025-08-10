import React from 'react'

interface Props {
  value: number // 0..1
  className?: string
}

export function ProgressBar({ value, className }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div 
      className={`w-full h-3 rounded-full overflow-hidden ${className ?? ''}`} 
      style={{ background: 'var(--hover)' }}
      role="progressbar" 
      aria-valuenow={pct} 
      aria-valuemin={0} 
      aria-valuemax={100}
    >
      <div 
        className="h-full transition-all duration-300" 
        style={{ 
          width: `${pct}%`,
          background: 'var(--accent)'
        }} 
      />
    </div>
  )
}