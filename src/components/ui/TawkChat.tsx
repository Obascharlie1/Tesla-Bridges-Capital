'use client'

import { useEffect } from 'react'

export function TawkChat() {
  useEffect(() => {
    const s1 = document.createElement('script')
    s1.async = true
    s1.src = 'https://embed.tawk.to/6a11a0c4db67011c34f8542e/1jpado0a0'
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    document.head.appendChild(s1)
  }, [])

  return null
}
