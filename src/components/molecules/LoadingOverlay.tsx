import React from 'react'
import { cn } from "@/lib/utils"

interface LoaderOverlayProps {
    isLoading: boolean
    text?: string
    className?: string
}

export default function LoaderOverlay({ isLoading, text = 'Loading...', className }: LoaderOverlayProps) {
    if (!isLoading) return null

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
                className
            )}
            aria-busy="true"
            aria-live="polite"
        >
            <div className="flex flex-col items-center space-y-4">
                <svg
                    className="h-12 w-12 animate-spin text-primary"
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
                <p className="text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    )
}