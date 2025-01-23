import { Suspense } from 'react'

import { AnalyticsContent } from './_components/analytics-content'

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <AnalyticsContent />
    </Suspense>
  )
}
