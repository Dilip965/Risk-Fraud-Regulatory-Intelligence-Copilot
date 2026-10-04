import React from 'react'
import { EvidenceItem } from '../intelligence/types/risk'

export default function EvidenceList({ items }: { items: EvidenceItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((e, i) => (
        <div key={i} className="flex justify-between bg-white p-2 rounded border">
          <div className="text-sm text-gray-600">{e.key}</div>
          <div className="font-mono text-sm">{String(e.value)}</div>
        </div>
      ))}
    </div>
  )
}
