"use client"

import { motion } from "framer-motion"
import { Phone, Loader2, Check } from "lucide-react"
import type { BalanceData } from "@/types/payment"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  isLoadingBalance: boolean
  balanceData: BalanceData | null
  balanceError: string | null
}

export function PhoneInput({ value, onChange, isLoadingBalance, balanceData, balanceError }: PhoneInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-right mb-2 font-medium text-[#2d1a45]">
        رقم الهاتف <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="tel"
          maxLength={12}
          placeholder="أدخل الرقم 9XXXXXX"
          className="w-full p-4 border border-gray-300 rounded-lg text-right pr-12 focus:outline-none focus:ring-2 focus:ring-[#d13c8c] focus:border-transparent transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Phone className="h-5 w-5 text-gray-400" />
        </div>

        {isLoadingBalance && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Loader2 className="h-5 w-5 text-[#d13c8c] animate-spin" />
          </div>
        )}

        {value.length === 8 && balanceData && !isLoadingBalance && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
      </div>

      {balanceError && <p className="mt-2 text-red-500 text-sm">{balanceError}</p>}

      {balanceData && (
        <motion.div
          className="mt-3 p-3 bg-green-50 border border-green-100 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-green-800 text-sm">تم العثور على معلومات الحساب</p>
        </motion.div>
      )}
    </div>
  )
}
