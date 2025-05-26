"use client"

import { CreditCard, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentTabsProps {
  selectedTab: string
  onTabChange: (tab: string) => void
}

export function PaymentTabs({ selectedTab, onTabChange }: PaymentTabsProps) {
  const tabs = [
    { id: "bill", label: "دفع الفاتورة", icon: CreditCard },
    { id: "recharge", label: "إعادة تعبئة eeZee", icon: Phone },
  ]

  return (
    <div className="flex border-b mb-8 bg-white rounded-t-lg shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            className={cn(
              "flex-1 py-4 text-center font-medium transition-all duration-200",
              selectedTab === tab.id
                ? "border-b-4 border-[#d13c8c] text-[#d13c8c] bg-pink-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="flex items-center justify-center">
              <Icon className="mr-2" size={18} />
              {tab.label}
            </div>
          </button>
        )
      })}
    </div>
  )
}
