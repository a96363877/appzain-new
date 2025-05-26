"use client"

interface HelpButtonProps {
  onOpenChat: () => void
}

export function HelpButton({ onOpenChat }: HelpButtonProps) {
  return (
    <div className="mt-4 text-center">
      <button
        onClick={onOpenChat}
        className="text-[#2d1a45] text-sm hover:underline flex items-center justify-center mx-auto"
      >
        هل تحتاج إلى مساعدة؟
      </button>
    </div>
  )
}
