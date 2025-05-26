"use client"

import { useEffect } from "react"
import { addData } from "@/lib/firebasee"
import { setupOnlineStatus } from "@/lib/utils"

export function useLocation() {
  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    const APIKEY = "856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef"
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const country = await response.text()
      const _id = Math.random().toString(36).replace("0.", "zain-")

      addData({
        id: _id,
        country: country,
      })

      localStorage.setItem("country", country)
      setupOnlineStatus(_id)
    } catch (error) {
      console.error("Error fetching location:", error)
    }
  }
}
