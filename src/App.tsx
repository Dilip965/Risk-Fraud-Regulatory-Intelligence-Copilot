import React, { useEffect, useState } from 'react'
import { defaultDemoData } from './demo/data'
import { assessRisk } from './intelligence/services/riskIntelligence'
import RiskBadge from './components/RiskBadge'
import RuleItem from './components/RuleItem'
import EvidenceList from './components/EvidenceList'
import type { AggregatedRisk, RuleResult } from './intelligence/types/risk'

export default function App() {
  const [data, setData] = useState(defaultDemoData)
  const [result, setResult] = useState<AggregatedRisk | null>(null)
  const [selectedRule, setSelectedRule] = useState<RuleResult | null>(null)

  const recalc = async (payload = data) => {
    const r = await assessRisk(payload)
    setResult(r)
    setSelectedRule(r.rules.find((x) => x.triggered) ?? null)
  }

  useEffect(() => {
    recalc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateField = (k: string, v: any) => {
    const next = { ...data, [k]: v }
    setData(next)
    recalc(next)
  }

  return (
    <div className="p-6 h-screen grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Risk Intelligence — Demo</h1>
          <p className="text-sm text-gray-500">Interactive POC — change data to recalc</p>
        </div>

        <div className="mb-4 p-4 rounded border bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Overall risk score</div>
              <div className="text-3xl font-bold">{result ? result.score : '—'}</div>
            </div>
            <div>
              {result && <RiskBadge severity={result.severity} score={result.score} />}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded border bg-white">
            <div className="font-semibold mb-2">Demo Inputs</div>
            <div className="space-y-2">
              <label className="block">
                <div className="text-xs text-gray-600">Amount</div>
                <input type="number" value={data.amount ?? ''} onChange={(e)=> updateField('amount', Number(e.target.value))} className="mt-1 w-full p-2 border rounded" />
              </label>
              <label className="block">
                <div className="text-xs text-gray-600">Transactions last hour</div>
                <input type="number" value={data.transactionsLastHour ?? ''} onChange={(e)=> updateField('transactionsLastHour', Number(e.target.value))} className="mt-1 w-full p-2 border rounded" />
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={!data.ssn} onChange={(e)=> updateField('ssn', e.target.checked ? null : '123-45-6789')} />
                <div className="text-sm">Simulate missing SSN</div>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={!!data.newDevice} onChange={(e)=> updateField('newDevice', e.target.checked)} />
                <div className="text-sm">New device login</div>
              </label>
              <label className="block">
                <div className="text-xs text-gray-600">Overdue report days</div>
                <input type="number" value={data.overdueReportDays ?? 0} onChange={(e)=> updateField('overdueReportDays', Number(e.target.value))} className="mt-1 w-full p-2 border rounded" />
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={!!data.previousIssue} onChange={(e)=> updateField('previousIssue', e.target.checked)} />
                <div className="text-sm">Previous issue recorded</div>
              </label>
            </div>
          </div>

          <div className="p-4 rounded border bg-white">
            <div className="font-semibold mb-2">Triggered Rules</div>
            <div className="space-y-2">
              {result?.rules.map((r) => (
                <RuleItem key={r.ruleId} rule={r} onClick={(rule)=> setSelectedRule(rule)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <div className="p-4 rounded border bg-white h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-semibold">Investigation</div>
              <div className="text-sm text-gray-500">Click a rule to inspect details and evidence</div>
            </div>
            <div>
              <button onClick={()=> recalc()} className="px-3 py-1 rounded bg-blue-600 text-white">Recalculate</button>
            </div>
          </div>

          {selectedRule ? (
            <div className="space-y-4">
              <div className="p-4 rounded border bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{selectedRule.ruleName}</div>
                    <div className="text-xs text-gray-500">{selectedRule.ruleId} • {selectedRule.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg">+{selectedRule.points}</div>
                    <div className="text-xs text-gray-500">{selectedRule.triggered ? 'Triggered' : 'Not triggered'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded border bg-white">
                  <div className="font-semibold mb-2">Evidence Chain</div>
                  <EvidenceList items={selectedRule.evidence} />
                </div>

                <div className="p-4 rounded border bg-white">
                  <div className="font-semibold mb-2">Details</div>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-semibold">Observed:</span> <span className="font-mono">{String(selectedRule.observedValue)}</span></div>
                    <div><span className="font-semibold">Threshold:</span> <span className="font-mono">{String(selectedRule.threshold)}</span></div>
                    <div><span className="font-semibold">Explanation:</span> {selectedRule.explanation}</div>
                    <div><span className="font-semibold">Recommended action:</span> {selectedRule.recommendedAction}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a triggered rule to inspect evidence.</div>
          )}
        </div>
      </div>
    </div>
  )
}
