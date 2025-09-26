import { useEffect, useState } from 'react'

export function useCurrentTime(timezone: 'PST' | 'EST' | string, withSeconds: boolean = true) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const tz = timezone === 'PST' ? 'America/Los_Angeles' : 'America/New_York'

      const now = new Date()

      const formatter = new Intl.DateTimeFormat('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        ...(withSeconds && { second: '2-digit' }), // include seconds only if true
        timeZone: tz
      })

      setCurrentTime(formatter.format(now))
    }

    updateTime() // initialize immediately
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [timezone, withSeconds])

  return currentTime
}
