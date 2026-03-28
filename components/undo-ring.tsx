import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface UndoRingProps {
  isActive: boolean
  onExpire: () => void
  duration?: number
}

export function UndoRing({ isActive, onExpire, duration = 2000 }: UndoRingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      return
    }

    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      setProgress(p)
      if (p >= 1) {
        clearInterval(interval)
        onExpire()
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isActive, duration, onExpire])

  if (!isActive) return null

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
        {/* Geri al butonu yok – sadece görsel halka */}
      </div>
    </motion.div>
  )
}
