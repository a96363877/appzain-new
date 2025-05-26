"use client"

import { useEffect } from "react"

interface SmartsuppChatProps {
  apiKey?: string
}

export default function SmartsuppChat({ apiKey = "5d8d3c668ee55e8fedaa6a4fd2f403f55663714f" }: SmartsuppChatProps) {
  useEffect(() => {
    // Initialize Smartsupp
    const _smartsupp = window._smartsupp || {}
    _smartsupp.key = apiKey

    // Load Smartsupp script
    window.smartsupp ||
      (function (d) {
        var s, c, o: any
        var smartsupp: any;
        o = smartsupp = function () {
          o._.push(arguments)
        }
        o._ = []
        s = d.getElementsByTagName("script")[0]
        c = d.createElement("script")
        c.type = "text/javascript"
        c.charset = "utf-8"
        c.async = true
        c.src = "https://www.smartsuppchat.com/loader.js?"
        s.parentNode?.insertBefore(c, s)
      })(document)

    // Clean up function
    return () => {
      // Optional: Clean up Smartsupp when component unmounts
      if (window.smartsupp) {
        window.smartsupp("shutdown")
      }
    }
  }, [apiKey])

  return null // This component doesn't render anything visible
}

// Add TypeScript declarations
declare global {
  interface Window {
    _smartsupp: any
    smartsupp: any
  }
}
