import React from 'react'
import { RuleResult } from '../intelligence/types/risk'

export default function RuleItem({ rule, onClick }: { rule: RuleResult; onClick: (r: RuleResult) => void }) {
  return (
    <div
      className={`p-3 rounded border ${rule.triggered ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'} cursor-pointer`}
      onClick={() => onClick(rule)}
    >
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{rule.ruleName}</div>
          <div className="text-xs text-gray-500">{rule.category}</div>
        </div>
        <div className="text-right">
          <div className="font-mono">+{rule.points}</div>
          <div className="text-xs text-gray-500">{rule.triggered ? 'Triggered' : 'Not triggered'}</div>
        </div>
      </div>
    </div>
  )
}
