export function PaymentHeader() {
  return (
    <header
      style={{
        background: "url(/top.png)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
      className="flex items-center justify-between bg-gradient-to-r from-[#2d1a45] to-[#3a2259] shadow-md h-16"
    >
      <div className="flex items-center">
        <img src="/next.svg" alt="Zain Logo" className="h-16 ml-2" style={{ visibility: "hidden" }} />
      </div>
    </header>
  )
}
