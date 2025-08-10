"use client"
import React from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from './ProgressBar'

interface Props {
  id: string
  name: string
  chapters: number
  checked: boolean[]
  onToggle: (chapterIndex: number) => void
}

export function BookCard({ id, name, chapters, checked, onToggle }: Props) {
  const router = useRouter()
  const completed = checked.filter(Boolean).length
  const pct = chapters ? completed / chapters : 0

  const items = Array.from({ length: chapters }, (_, i) => i)

  const handleCardClick = () => {
    router.push(`/book/${id}`)
  }

  return (
    <div className="card p-4">
      <div 
        className="cursor-pointer hover:bg-[var(--hover)] -m-4 p-4 rounded-lg transition-colors mb-3"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">{name}</h3>
          <span className="badge">{(pct * 100).toFixed(1)}%</span>
        </div>
        <ProgressBar value={pct} className="mb-0" />
      </div>
      <div className="grid grid-cols-10 gap-1 sm:grid-cols-12">
        {items.map((i) => {
          const isChecked = !!checked[i]
          return (
            <button
              key={i}
              onClick={() => onToggle(i)}
              className="aspect-square rounded-md text-[10px] sm:text-xs flex items-center justify-center select-none border transition-all duration-200"
              style={{
                background: isChecked ? 'var(--accent)' : 'var(--hover)',
                color: isChecked ? '#000' : 'var(--text-primary)',
                borderColor: isChecked ? 'var(--accent)' : 'var(--border)'
              }}
              onMouseEnter={(e) => {
                if (!isChecked) {
                  e.currentTarget.style.background = 'var(--border)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isChecked) {
                  e.currentTarget.style.background = 'var(--hover)'
                }
              }}
              aria-pressed={isChecked}
              title={`Capítulo ${i + 1}`}
            >
              {isChecked ? <Check className="w-4 h-4" /> : i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}