import { RuleResult } from '../types/risk'

export type EventData = {
  amount?: number
  transactionsLastHour?: number
  ssn?: string | null
  newDevice?: boolean
  overdueReportDays?: number
  previousIssue?: boolean
}

export const anomalyRule = (data: EventData): RuleResult => {
  const threshold = 10000
  const observed = data.amount ?? 0
  const triggered = observed > threshold
  return {
    ruleId: 'anomaly.amount.large',
    ruleName: 'Large Transaction Amount',
    category: 'Anomaly Risk',
    triggered,
    observedValue: observed,
    threshold,
    points: triggered ? 20 : 0,
    explanation: triggered ? `Transaction amount ${observed} > ${threshold}` : 'Within normal range',
    recommendedAction: triggered ? 'Flag for analyst review and confirm purpose' : 'None',
    evidence: [
      { key: 'amount', value: observed },
      { key: 'threshold', value: threshold }
    ]
  }
}

export const frequencyRule = (data: EventData): RuleResult => {
  const threshold = 10
  const observed = data.transactionsLastHour ?? 0
  const triggered = observed > threshold
  return {
    ruleId: 'frequency.transactions.spike',
    ruleName: 'High Transaction Frequency',
    category: 'Frequency Risk',
    triggered,
    observedValue: observed,
    threshold,
    points: triggered ? 15 : 0,
    explanation: triggered ? `Transactions in last hour ${observed} > ${threshold}` : 'Normal frequency',
    recommendedAction: triggered ? 'Throttle account and investigate origin' : 'None',
    evidence: [
      { key: 'transactionsLastHour', value: observed }
    ]
  }
}

export const dataInconsistencyRule = (data: EventData): RuleResult => {
  const missing = !data.ssn
  return {
    ruleId: 'data.ssn.missing',
    ruleName: 'Missing SSN',
    category: 'Data Inconsistency',
    triggered: missing,
    observedValue: data.ssn ?? null,
    threshold: 'present',
    points: missing ? 20 : 0,
    explanation: missing ? 'Required SSN is missing from payload' : 'SSN present',
    recommendedAction: missing ? 'Request identity documentation' : 'None',
    evidence: [{ key: 'ssn', value: data.ssn ?? null }]
  }
}

export const accessBehaviorRule = (data: EventData): RuleResult => {
  const newDevice = !!data.newDevice
  return {
    ruleId: 'access.new_device',
    ruleName: 'Login From New Device',
    category: 'Access / Behavior Risk',
    triggered: newDevice,
    observedValue: newDevice,
    threshold: true,
    points: newDevice ? 15 : 0,
    explanation: newDevice ? 'Authentication from previously unseen device' : 'Known device',
    recommendedAction: newDevice ? 'Step-up authentication / analyst review' : 'None',
    evidence: [{ key: 'newDevice', value: newDevice }]
  }
}

export const regulatoryRule = (data: EventData): RuleResult => {
  const threshold = 30
  const observed = data.overdueReportDays ?? 0
  const triggered = observed > threshold
  return {
    ruleId: 'regulatory.report.overdue',
    ruleName: 'Overdue Regulatory Report',
    category: 'Regulatory Risk',
    triggered,
    observedValue: observed,
    threshold,
    points: triggered ? 20 : 0,
    explanation: triggered ? `Report overdue by ${observed} days` : 'Reports up-to-date',
    recommendedAction: triggered ? 'Immediately notify compliance team' : 'None',
    evidence: [{ key: 'overdueReportDays', value: observed }]
  }
}

export const repeatIssueRule = (data: EventData): RuleResult => {
  const observed = !!data.previousIssue
  return {
    ruleId: 'issue.previous',
    ruleName: 'Repeated Previous Issue',
    category: 'Anomaly Risk',
    triggered: observed,
    observedValue: observed,
    threshold: true,
    points: observed ? 10 : 0,
    explanation: observed ? 'Issue previously reported for this entity' : 'No previous issues found',
    recommendedAction: observed ? 'Escalate to senior analyst' : 'None',
    evidence: [{ key: 'previousIssue', value: observed }]
  }
}

export const allRules = [
  anomalyRule,
  frequencyRule,
  dataInconsistencyRule,
  accessBehaviorRule,
  regulatoryRule,
  repeatIssueRule
]
import { InputData, RuleEvaluation } from '../types/risk';

export const anomalyRules = [
  {
    ruleId: 'anomaly_medium',
    ruleName: 'Activity > 2x Baseline',
    category: 'Anomaly' as const,
    description: 'Activity is more than twice the historical baseline.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.activityMultiplier ?? 0;
      const triggered = observed > 2 && observed <= 3;
      return {
        ruleId: 'anomaly_medium',
        ruleName: 'Activity > 2x Baseline',
        category: 'Anomaly',
        description: 'Activity is more than twice the historical baseline.',
        triggered,
        observedValue: observed,
        threshold: '>2x',
        points: triggered ? 20 : 0,
        explanation: triggered ? `Activity is ${observed}x baseline (>2x).` : 'Not triggered',
        recommendedAction: triggered ? 'Review activity pattern and validate sources.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'anomaly_high',
    ruleName: 'Activity > 3x Baseline',
    category: 'Anomaly' as const,
    description: 'Activity is more than three times the historical baseline.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.activityMultiplier ?? 0;
      const triggered = observed > 3 && observed <= 5;
      return {
        ruleId: 'anomaly_high',
        ruleName: 'Activity > 3x Baseline',
        category: 'Anomaly',
        description: 'Activity is more than three times the historical baseline.',
        triggered,
        observedValue: observed,
        threshold: '>3x',
        points: triggered ? 20 : 0,
        explanation: triggered ? `Activity is ${observed}x baseline (>3x).` : 'Not triggered',
        recommendedAction: triggered ? 'Investigate rapid activity increase.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'anomaly_critical',
    ruleName: 'Activity > 5x Baseline',
    category: 'Anomaly' as const,
    description: 'Activity is more than five times the historical baseline.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.activityMultiplier ?? 0;
      const triggered = observed > 5;
      return {
        ruleId: 'anomaly_critical',
        ruleName: 'Activity > 5x Baseline',
        category: 'Anomaly',
        description: 'Activity is more than five times the historical baseline.',
        triggered,
        observedValue: observed,
        threshold: '>5x',
        points: triggered ? 20 : 0,
        explanation: triggered ? `Activity is ${observed}x baseline (>5x).` : 'Not triggered',
        recommendedAction: triggered ? 'Immediate investigation: possible automated attack.' : undefined,
      } as RuleEvaluation;
    },
  },
];
