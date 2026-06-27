'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTrustDevice } from '@/hooks/use-trust-device'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'


export function TrustDeviceModal() {
  const { isOpen, loading, checkTrustDevice, handleTrustDevice, handleClose } = useTrustDevice()
  
  const toastIdRef = useRef<string | number | undefined>(undefined)

  useEffect(() => {
    
    checkTrustDevice()
  }, []) 
  useEffect(() => {
    
    if (isOpen) {
      
      if (toastIdRef.current !== undefined && !loading) {
        toast.dismiss(toastIdRef.current)
      }

      const id = toast(
        <div className="flex flex-col gap-2 p-2 w-full">
          <div className="text-base font-semibold text-black">
            X?c th?c
          </div>
          <div className="text-sm text-gray-500 leading-snug">
            X?c th?c
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {' '}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleClose()
              }}
              disabled={loading}
              className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              X?c th?c
            </Button>
            <Button
              size="sm"
              variant="destructive" 
              onClick={() => {
                handleTrustDevice()
              }}
              disabled={loading}
              className="relative text-white bg-red-600"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  X?c th?c
                </span>
              ) : (
                'X?c th?c'
              )}
            </Button>
          </div>
        </div>,
        {
          
          id: 'trust-device-toast', 
          duration: Infinity, 
          position: 'bottom-right', 
          
          
          className: 'p-0 border-none shadow-lg rounded-lg max-w-sm' 
          
        }
      )
      toastIdRef.current = id
    } else if (!loading) {
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current)
        toastIdRef.current = undefined
      }
    }

    
    return () => {
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current)
      }
    }
  }, [isOpen, loading, handleClose, handleTrustDevice]) 

  
  return null
}
