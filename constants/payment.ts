import type { AmountOption } from "@/types/payment"

export const AMOUNT_OPTIONS: AmountOption[] = [
  { value: "2.000", validity: 7 },
  { value: "4.000", validity: 15 },
  { value: "6.000", validity: 30 },
  { value: "12.000", validity: 90 },
  { value: "22.000", validity: 180 },
  { value: "30.000", validity: 365 },
]

export const NUMBER_TYPES = [
  { value: "رقم آخر", label: "رقم آخر" },
  { value: "رقم العقد", label: "رقم العقد" },
]

export const TABS = [
  { id: "bill", label: "دفع الفاتورة", icon: "CreditCard" },
  { id: "recharge", label: "إعادة تعبئة eeZee", icon: "Phone" },
]
