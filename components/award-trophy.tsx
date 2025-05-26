"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AwardTrophyProps {
  title: string
  isGlowing: boolean
  icon?: ReactNode
}

export default function AwardTrophy({ title, isGlowing, icon }: AwardTrophyProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] shadow-lg ${
          isGlowing ? "ring-4 ring-white/30" : ""
        }`}
        animate={{
          boxShadow: isGlowing ? "0 0 15px 5px rgba(255, 255, 255, 0.5)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Trophy icon */}
        <motion.div
          className="text-[#1a2db3]"
          animate={{
            scale: isGlowing ? 1.1 : 1,
            opacity: isGlowing ? 1 : 0.8,
          }}
          transition={{ duration: 0.5 }}
        >
          {icon || (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 21V16.5M16 21V16.5M3.5 9.5H5.5M18.5 9.5H20.5M5.5 9.5C5.5 7.01472 7.51472 5 10 5H14C16.4853 5 18.5 7.01472 18.5 9.5V10C18.5 12.4853 16.4853 14.5 14 14.5H10C7.51472 14.5 5.5 12.4853 5.5 10V9.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14.5V16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 21H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </motion.div>

        {/* Glow effect */}
        {isGlowing && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.5 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        )}
      </motion.div>

      {/* Award title */}
      <motion.div
        className="mt-2 text-white text-xs font-medium text-center max-w-[100px] opacity-80"
        animate={{
          opacity: isGlowing ? 1 : 0.8,
        }}
        transition={{ duration: 0.5 }}
      >
        {title.split(" ").slice(0, 2).join(" ")}
      </motion.div>
    </motion.div>
  )
}
