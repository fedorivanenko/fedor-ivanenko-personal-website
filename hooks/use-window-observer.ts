'use client'

import * as React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WindowStore {
  screenSize: { x: number; y: number }
  setScreenSize: (x: number, y: number) => void
}

const useWindowStore = create<WindowStore>()(
  persist(
    (set) => ({
      screenSize: { x: 0, y: 0 },
      setScreenSize: (x: number, y: number) => set({ screenSize: { x, y } }),
    }),
    { 
      name: 'window-size-store',
      skipHydration: true 
    }
  )
)

export function initializeWindowSize() {
  if (typeof window !== 'undefined') {
    useWindowStore.getState().setScreenSize(
      window.innerWidth, 
      window.innerHeight
    )
  }
}

const WindowObserver = () => {
  const setScreenSize = useWindowStore((state) => state.setScreenSize)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    initializeWindowSize()
    setMounted(true)

    const handleResize = () => {
      setScreenSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreenSize])

  if (!mounted) return null

  return null
}

export { useWindowStore, WindowObserver }


const useWindowSize = () => {
  const screenSize = useWindowStore((state) => state.screenSize)
  return screenSize
}

export { useWindowSize };