import { Suspense } from 'react'
import DashboardClient from './DashboardClient'

function Loading() {
  return (
    <div style={{ background: '#070711', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading PostPilot...</p>
    </div>
  )
}

export default function Dashboard() {
  return <Suspense fallback={<Loading />}><DashboardClient /></Suspense>
}
