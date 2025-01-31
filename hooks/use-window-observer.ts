'use client'

import * as React from 'react'
import { create } from "zustand";

interface WindowStore {
  screenSize: { x: number; y: number }
  setScreenSize: (x: number, y: number) => void
}

const useWindowStore = create<WindowStore>((set) => ({
  screenSize: { x: window.innerWidth, y: window.innerHeight },
  setScreenSize: (x: number, y: number) => set({ screenSize: { x, y } }),
}))

//TODO: fix hydration error

const WindowObserver = () => {
  const setScreenSize = useWindowStore((state) => state.setScreenSize)

  const dimensionsRef = React.useRef({ x: window.innerWidth, y: window.innerHeight })
  const updatePending = React.useRef(false)

  const updateWindow = React.useCallback(() => {
    updatePending.current = false
    const currentX = window.innerWidth
    const currentY = window.innerHeight

    if (dimensionsRef.current.x !== currentX || dimensionsRef.current.y !== currentY) {
      dimensionsRef.current = { x: currentX, y: currentY }
      setScreenSize(currentX, currentY)
    }
  }, [setScreenSize])

  const handleWindowUpdate = React.useCallback(() => {
    if (!updatePending.current) {
      updatePending.current = true
      requestAnimationFrame(updateWindow)
    }
  }, [updateWindow])

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowUpdate)
    window.addEventListener('scroll', handleWindowUpdate)

    return () => {
      window.removeEventListener('resize', handleWindowUpdate)
      window.removeEventListener('scroll', handleWindowUpdate)
    }
  }, [handleWindowUpdate])

  return null
}

export { useWindowStore, WindowObserver }


const useWindowSize = () => {
  const screenSize = useWindowStore((state) => state.screenSize)
  return screenSize
}

export { useWindowSize };