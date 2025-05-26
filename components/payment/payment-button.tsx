"use client"

import { motion } from "framer-motion"
import { Loader2, CreditCard } from "lucide-react"

interface PaymentButtonProps {
  isSubmitted: boolean
  isValidPhoneNumber:boolean
  phoneNumber: string
  onSubmit: () => void
}

export function PaymentButton({ isValidPhoneNumber,isSubmitted, phoneNumber, onSubmit }: PaymentButtonProps) {
  const isDisabled = !isValidPhoneNumber || isSubmitted || phoneNumber === ""

  return (
    <motion.button
      className={`w-full py-4 rounded-lg font-medium text-lg flex items-center justify-center ${
        isDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-[#d13c8c] to-[#e04c9c] text-white shadow-md hover:shadow-lg"
      }`}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      disabled={isDisabled}
      onClick={onSubmit}
    >
      {isSubmitted ? (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          جاري الدفع...
        </>
      ) : (
        <>
          <CreditCard className="mr-2" size={20} />
          دفع
        </>
      )}
    </motion.button>
  )
}
