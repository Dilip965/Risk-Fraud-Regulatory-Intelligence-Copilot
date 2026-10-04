import { InputData, RuleEvaluation } from '../types/risk';

export const frequencyRules = [
  {
    ruleId: 'freq_medium',
    ruleName: 'Repeated events > 5',
    category: 'Frequency' as const,
    description: 'Number of repeated events exceeds 5 within a short period.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.repeatedEvents ?? 0;
      const triggered = observed > 5 && observed <= 10;
      return {
        ruleId: 'freq_medium',
        ruleName: 'Repeated events > 5',
        category: 'Frequency',
        description: 'Number of repeated events exceeds 5 within a short period.',
        triggered,
        observedValue: observed,
        threshold: '>5',
        points: triggered ? 15 : 0,
        explanation: triggered ? `Repeated events: ${observed} (>5).` : 'Not triggered',
        recommendedAction: triggered ? 'Check for automated/repeat activity.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'freq_high',
    ruleName: 'Repeated events > 10',
    category: 'Frequency' as const,
    description: 'Number of repeated events exceeds 10 within a short period.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.repeatedEvents ?? 0;
      const triggered = observed > 10 && observed <= 20;
      return {
        ruleId: 'freq_high',
        ruleName: 'Repeated events > 10',
        category: 'Frequency',
        description: 'Number of repeated events exceeds 10 within a short period.',
        triggered,
        observedValue: observed,
        threshold: '>10',
        points: triggered ? 15 : 0,
        explanation: triggered ? `Repeated events: ${observed} (>10).` : 'Not triggered',
        recommendedAction: triggered ? 'Escalate: high repetition of events.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'freq_critical',
    ruleName: 'Repeated events > 20',
    category: 'Frequency' as const,
    description: 'Number of repeated events exceeds 20 within a short period.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.repeatedEvents ?? 0;
      const triggered = observed > 20;
      return {
        ruleId: 'freq_critical',
        ruleName: 'Repeated events > 20',
        category: 'Frequency',
        description: 'Number of repeated events exceeds 20 within a short period.',
        triggered,
        observedValue: observed,
        threshold: '>20',
        points: triggered ? 15 : 0,
        explanation: triggered ? `Repeated events: ${observed} (>20).` : 'Not triggered',
        recommendedAction: triggered ? 'Critical: consider blocking or throttling.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'previous_issue_repeat',
    ruleName: 'Repeated previous issue',
    category: 'Frequency' as const,
    description: 'There are repeated previous issues related to this entity.',
    evaluate: (input: InputData): RuleEvaluation => {
      const observed = input.previousIssues ?? 0;
      const triggered = observed > 0;
      return {
        ruleId: 'previous_issue_repeat',
        ruleName: 'Repeated previous issue',
        category: 'Frequency',
        description: 'There are repeated previous issues related to this entity.',
        triggered,
        observedValue: observed,
        threshold: '>0',
        points: triggered ? 10 : 0,
        explanation: triggered ? `Previous issues: ${observed}.` : 'Not triggered',
        recommendedAction: triggered ? 'Include historical context in investigation.' : undefined,
      } as RuleEvaluation;
    },
  },
];
