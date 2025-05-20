"use client"

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Update the state with the current value
    const updateMatches = () => {
      if (media.matches !== matches) {
        setMatches(media.matches)
      }
    }
    
    // Set the initial value
    updateMatches()
    
    // Set up the listener
    media.addEventListener('change', updateMatches)
    
    // Clean up
    return () => {
      media.removeEventListener('change', updateMatches)
    }
    
    // Re-run the effect if the query changes
  }, [matches, query])
  
  return matches
}
