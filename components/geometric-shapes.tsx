"use client"

import { motion } from "framer-motion"

export default function GeometricShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large circle */}
      <motion.div
        className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#2a3dc3] opacity-30 blur-xl"
        animate={{
          scale: [1, 1.05, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Small circle */}
      <motion.div
        className="absolute top-[60%] -left-[5%] w-[25%] h-[25%] rounded-full bg-[#3a4dd3] opacity-20 blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 15, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Rectangle */}
      <motion.div
        className="absolute top-[20%] left-[60%] w-[30%] h-[20%] rounded-3xl bg-[#4a5de3] opacity-20 blur-lg rotate-12"
        animate={{
          rotate: [12, 15, 12],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Small dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Light beams */}
      <motion.div
        className="absolute top-0 left-[30%] w-[2px] h-[30%] bg-gradient-to-b from-white/0 via-white/20 to-white/0 rotate-[15deg]"
        animate={{
          opacity: [0, 0.3, 0],
          height: ["30%", "40%", "30%"],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute top-[20%] right-[20%] w-[1px] h-[25%] bg-gradient-to-b from-white/0 via-white/15 to-white/0 rotate-[-20deg]"
        animate={{
          opacity: [0, 0.2, 0],
          height: ["25%", "35%", "25%"],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />
    </div>
  )
}
