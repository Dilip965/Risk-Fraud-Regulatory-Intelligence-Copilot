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
