import { useRef, useEffect } from "react"

export function useOutClick(callbackfn: () => void) {

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {

    const handleClick = (e: MouseEvent) => {

      if (!ref.current?.contains(e.target as Node)) {
        if (callbackfn) callbackfn()
      }
    }

    window.addEventListener("mousedown", handleClick)

    return () => {
      window.removeEventListener("mousedown", handleClick)
    }
  }, [])

  return ref
}

export function useKeyDown(keyId: string, callbackfn: (e: HTMLButtonElement | null) => void) {

  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key === keyId) {
        if (callbackfn) callbackfn(ref.current)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return ref
}