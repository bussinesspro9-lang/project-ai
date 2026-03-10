import React from "react"
import { AppLayout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </AppLayout>
  )
}
