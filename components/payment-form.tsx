"use client"

import { useState } from "react"
import { ChevronDown, Heart, Menu, Plus, ShoppingCart } from "lucide-react"
import ZainLogo from "./zain-logo"

export default function PaymentForm() {
  const [activeTab, setActiveTab] = useState<"recharge" | "bill">("bill")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isRobotChecked, setIsRobotChecked] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-[#2e0a4a] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6" />
          <Heart className="h-6 w-6" />
          <div className="bg-white rounded-full p-2">
            <ShoppingCart className="h-5 w-5 text-[#2e0a4a]" />
          </div>
        </div>
        <div className="w-24">
          <ZainLogo/>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        {/* Title */}
        <h1 className="text-right text-2xl font-bold text-black mb-4">الدفع السريع</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === "recharge" ? "border-b-2 border-[#2e0a4a] text-[#2e0a4a]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("recharge")}
          >
            إعادة تعبئة eezee
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === "bill" ? "border-b-2 border-[#e91e63] text-[#e91e63]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("bill")}
          >
            دفع الفاتورة
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Pay For Dropdown */}
          <div className="mb-6">
            <label className="block text-right mb-2 font-medium text-black">أريد الدفع لـ</label>
            <div className="relative">
              <select className="w-full p-3 border rounded text-right appearance-none pr-10">
                <option>رقم آخر</option>
              </select>
              <ChevronDown className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-right mb-2 font-medium text-black">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="أدخل الرقم 98XXXXXX"
              className="w-full p-3 border rounded text-right"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* reCAPTCHA */}
          <div className="mb-6">
            <div className="border rounded p-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="robot"
                  className="mr-2 h-5 w-5"
                  checked={isRobotChecked}
                  onChange={() => setIsRobotChecked(!isRobotChecked)}
                />
                <label htmlFor="robot" className="text-gray-600">
                  أنا لست برنامج روبوت
                </label>
              </div>
              <div className="text-xs text-gray-400">
                reCAPTCHA
                <br />
                خصوصية - شروط
              </div>
            </div>
          </div>
        </div>

        {/* Add Another Number Button */}
        <button className="w-full mt-4 p-3 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center">
          <Plus className="h-5 w-5 mr-2" />
          <span>أضف رقم آخر</span>
        </button>

        {/* Total */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-green-500 font-bold">د.ك 0.000</div>
          <div className="text-right font-bold text-black text-xl">إجمالي</div>
        </div>

        {/* Pay Now Button */}
        <button className="w-full mt-4 p-4 bg-gray-200 text-gray-600 rounded-lg font-bold">دفع الآن</button>
      </main>
    </div>
  )
}
