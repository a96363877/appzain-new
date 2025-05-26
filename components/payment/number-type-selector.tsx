"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { NUMBER_TYPES } from "@/constants/payment"

interface NumberTypeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function NumberTypeSelector({ value, onChange }: NumberTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative mb-6">
      <div
        className="w-full flex justify-between items-center border-b-2 border-[#d13c8c] pb-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <ChevronDown className={`text-[#d13c8c] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          <span className="mr-2 text-gray-700">{value}</span>
        </div>
        <span className="text-gray-500 text-sm">نوع الرقم</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-10 bg-white shadow-lg w-full mt-1 border rounded-md overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NUMBER_TYPES.map((type) => (
              <div
                key={type.value}
                className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => {
                  onChange(type.value)
                  setIsOpen(false)
                }}
              >
                <span>{type.label}</span>
                {value === type.value && (
                  <div className="w-4 h-4 rounded-full bg-[#d13c8c] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
