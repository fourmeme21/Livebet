'use client';

import { motion } from 'framer-motion';

export function FootballPitchTracker() {
  return (
    <div className="glass-card p-4 rounded-lg">
      <h3 className="font-semibold text-foreground mb-4 text-sm">Live Tracker</h3>
      
      <svg
        viewBox="0 0 100 60"
        className="w-full h-auto aspect-video bg-gradient-to-b from-green-900/30 to-green-800/30 rounded-lg"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 60%22%3E%3Crect width=%22100%22 height=%2260%22 fill=%22%231a3a1a%22/%3E%3Cline x1=%2250%22 y1=%220%22 x2=%2250%22 y2=%2260%22 stroke=%22%23fff%22 stroke-width=%220.5%22 opacity=%220.2%22/%3E%3Crect x=%220%22 y=%2215%22 width=%2210%22 height=%2230%22 fill=%22none%22 stroke=%22%23fff%22 stroke-width=%220.3%22 opacity=%220.2%22/%3E%3Crect x=%2290%22 y=%2215%22 width=%2210%22 height=%2230%22 fill=%22none%22 stroke=%22%23fff%22 stroke-width=%220.3%22 opacity=%220.2%22/%3E%3C/svg%3E")' }}
      >
        {/* Field lines */}
        <line x1="50" y1="0" x2="50" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
        <rect x="0" y="15" width="10" height="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
        <rect x="90" y="15" width="10" height="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />

        {/* Home team players */}
        <motion.circle cx="15" cy="20" r="1.5" fill="#56b4d3" animate={{ y: [-0.5, 0.5] }} transition={{ duration: 3 }} />
        <motion.circle cx="25" cy="30" r="1.5" fill="#56b4d3" animate={{ y: [0.5, -0.5] }} transition={{ duration: 2.5 }} />
        <motion.circle cx="35" cy="40" r="1.5" fill="#56b4d3" animate={{ y: [-0.3, 0.3] }} transition={{ duration: 3.5 }} />
        <motion.circle cx="50" cy="15" r="1.5" fill="#56b4d3" animate={{ x: [-1, 1], y: [-0.5, 0.5] }} transition={{ duration: 2 }} />

        {/* Away team players */}
        <motion.circle cx="75" cy="25" r="1.5" fill="#e91e63" animate={{ y: [-0.5, 0.5] }} transition={{ duration: 3.2 }} />
        <motion.circle cx="65" cy="35" r="1.5" fill="#e91e63" animate={{ y: [0.5, -0.5] }} transition={{ duration: 2.8 }} />
        <motion.circle cx="55" cy="45" r="1.5" fill="#e91e63" animate={{ y: [-0.3, 0.3] }} transition={{ duration: 3.3 }} />
        <motion.circle cx="85" cy="50" r="1.5" fill="#e91e63" animate={{ x: [1, -1] }} transition={{ duration: 2.2 }} />

        {/* Ball */}
        <motion.circle
          cx="50"
          cy="28"
          r="0.8"
          fill="#ffd700"
          animate={{ x: [-3, 3], y: [-2, 2] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        />
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-muted-foreground">Home</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-odds-negative" />
          <span className="text-muted-foreground">Away</span>
        </div>
      </div>
    </div>
  );
}
