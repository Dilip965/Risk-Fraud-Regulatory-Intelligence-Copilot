import React from 'react'

const colorFor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-600'
    case 'HIGH':
      return 'bg-orange-500'
    case 'MODERATE':
      return 'bg-yellow-400 text-black'
    default:
      return 'bg-green-500'
  }
}

export default function RiskBadge({ severity, score }: { severity: string; score: number }) {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-white ${colorFor(severity)}`}>
      <span className="font-semibold mr-2">{severity}</span>
      <span className="text-sm">{score}</span>
    </div>
  )
}
