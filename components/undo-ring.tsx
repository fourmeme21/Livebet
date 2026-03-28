import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface UndoRingProps {
  isVisible: boolean
  onUndo: () => void
  duration?: number // milisaniye
}

export function UndoRing({ isVisible, onUndo, duration = 2000 }: UndoRingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      return
    }

    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      setProgress(p)
      if (p >= 1) clearInterval(interval)
    }, 16)

    return () => clearInterval(interval)
  }, [isVisible, duration])

  if (!isVisible) return null

  const circumference = 2 * Math.PI * 28 // yarıçap 28
  const dashoffset = circumference * (1 - progress)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-24 right-4 z-50 md:bottom-6"
    >
      <div className="relative flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 64 64" className="transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted-foreground/20"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-undo-ring"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            transition={{ duration: 0 }}
          />
        </svg>
        <button
          onClick={onUndo}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-background text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Geri Al
        </button>
      </div>
    </motion.div>
  )
}
