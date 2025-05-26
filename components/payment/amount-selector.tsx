"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Clock, Check } from "lucide-react"
import { AMOUNT_OPTIONS } from "@/constants/payment"

interface AmountSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function AmountSelector({ value, onChange }: AmountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = AMOUNT_OPTIONS.find((option) => option.value === value)

  return (
    <div className="relative mb-6">
      <div
        className="flex justify-between items-center border-b-2 border-[#d13c8c] py-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <ChevronDown className={`text-[#d13c8c] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          <span className="mr-2 font-medium">{value} د.ك</span>
        </div>
        <label className="block text-right text-sm text-gray-500">مبلغ التعبئة</label>
      </div>

      <div className="text-right text-sm text-gray-500 mt-2 flex items-center">
        <Clock className="inline-block ml-1" size={14} />
        الصلاحية {selectedOption?.validity || 30} يوم
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-10 bg-white shadow-lg w-full mt-2 border rounded-md overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {AMOUNT_OPTIONS.map((amount) => (
              <div
                key={amount.value}
                className={`flex justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  value === amount.value ? "bg-pink-50" : ""
                }`}
                onClick={() => {
                  localStorage.setItem("amount", amount.value)
                  onChange(amount.value)
                  setIsOpen(false)
                }}
              >
                <div className="flex items-center">
                  {value === amount.value ? (
                    <div className="w-5 h-5 rounded-full bg-[#d13c8c] flex items-center justify-center mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300 mr-2"></div>
                  )}
                  <span className="font-medium">{amount.value} د.ك</span>
                </div>
                <div className="flex items-center">
                  <Clock className="inline-block ml-1" size={14} />
                  <span>الصلاحية {amount.validity} يوم</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
