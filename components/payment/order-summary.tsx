interface OrderSummaryProps {
  selectedAmount: string
  fees: string
  total: string
}

export function OrderSummary({ selectedAmount, fees, total }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-bold text-[#2d1a45] mb-4">ملخص الطلب</h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2">
          <div className="text-gray-700">{selectedAmount} د.ك</div>
          <div className="text-gray-700">مبلغ التعبئة</div>
        </div>

        <div className="flex justify-between items-center pb-2">
          <div className="text-gray-700">{fees} د.ك</div>
          <div className="text-gray-700">الرسوم</div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-dashed">
          <div className="text-[#d13c8c] font-bold text-xl">{total} د.ك</div>
          <div className="text-[#2d1a45] font-bold">الإجمالي</div>
        </div>
      </div>
    </div>
  )
}
