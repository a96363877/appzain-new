"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Battery } from "lucide-react"
import GeometricShapes from "./geometric-shapes"
import AwardTrophy from "./award-trophy"
import ZainLogo from "./zain-logo"

export default function SplashScreen() {
  const [loading, setLoading] = useState(0)
  const [currentDot, setCurrentDot] = useState(0)
  const [showAwards, setShowAwards] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [glowIndex, setGlowIndex] = useState(-1)
  const [progressBarWidth, setProgressBarWidth] = useState(0)

  useEffect(() => {
    // Start showing elements in sequence
    const timer1 = setTimeout(() => setShowAwards(true), 500)
    const timer2 = setTimeout(() => setShowText(true), 1200)
    const timer3 = setTimeout(() => setShowLogo(true), 1800)

    // Handle loading progress
    const loadingInterval = setInterval(() => {
      setLoading((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    // Animate progress bar width
    const progressInterval = setInterval(() => {
      setProgressBarWidth((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 0.5
      })
    }, 30)

    // Animate dots
    const dotInterval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % 3)
    }, 500)

    // Animate award glow
    const glowInterval = setInterval(() => {
      setGlowIndex((prev) => (prev + 1) % 5)
    }, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearInterval(loadingInterval)
      clearInterval(dotInterval)
      clearInterval(glowInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const awardTitles = [
    "FASTEST MOBILE NETWORK",
    "FASTEST FIXED NETWORK",
    "BEST VIDEO EXPERIENCE",
    "BEST WIFI EXPERIENCE",
    "BEST 5G MOBILE EXPERIENCE",
  ]

  return (
    <div className="fixed top-0 right-0 h-screen w-full bg-[#1a2db3] overflow-hidden font-sans">
      {/* Geometric background shapes */}
      <GeometricShapes />


      {/* Awards */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <AnimatePresence>
          {showAwards && (
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {[0, 1, 2, ].map((index) => (
                <AwardTrophy key={index} title={awardTitles[index]} isGlowing={glowIndex === index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* White line under awards */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="absolute top-[60%] inset-x-0 mx-auto w-[80%] h-0.5 bg-white"
            initial={{ width: "0%", opacity: 0, x: "-50%" }}
            animate={{ width: "80%", opacity: 1, x: "0%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ left: "10%" }} // This ensures it's centered (10% from left with 80% width)
          />
        )}
      </AnimatePresence>

      {/* Text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="absolute top-[62%] inset-x-0 mx-auto px-4 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              className="text-white text-3xl font-bold mb-2 w-full text-center"
              dir="rtl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              الشبكة الأسرع في الكويت
            </motion.div>
            <motion.div
              className="text-white text-2xl font-bold w-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Kuwait&apos;s Fastest Network
            </motion.div>
            <motion.div
              className="text-white mb-4 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <ZainLogo />
            </motion.div>  <motion.div
              className="text-white text-sm rtl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              القادم فيه كل جميل
            </motion.div>
            <motion.div className="flex justify-center mt-4 space-x-2">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className={`h-2 w-2 rounded-full ${currentDot === dot ? "bg-white" : "bg-white bg-opacity-40"}`}
                  animate={{
                    scale: currentDot === dot ? 1.2 : 1,
                    opacity: currentDot === dot ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    
      {/* Progress bar */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[80%] h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${progressBarWidth}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </div>
  )
}
