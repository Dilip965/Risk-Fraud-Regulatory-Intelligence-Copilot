import { InputData, RuleEvaluation } from '../types/risk';

export const regulatoryRules = [
  {
    ruleId: 'reg_requirement_approaching',
    ruleName: 'Requirement approaching deadline',
    category: 'Regulatory' as const,
    description: 'A regulatory requirement is approaching its deadline.',
    evaluate: (input: InputData): RuleEvaluation => {
      const days = input.requirementDeadlineDays;
      const triggered = typeof days === 'number' && days >= 0 && days <= 7;
      return {
        ruleId: 'reg_requirement_approaching',
        ruleName: 'Requirement approaching deadline',
        category: 'Regulatory',
        description: 'A regulatory requirement is approaching its deadline.',
        triggered,
        observedValue: days,
        threshold: '<=7 days',
        points: triggered ? 20 : 0,
        explanation: triggered ? `Deadline in ${days} day(s).` : 'Not triggered',
        recommendedAction: triggered ? 'Prepare required submission or evidence.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'reg_requirement_overdue',
    ruleName: 'Requirement overdue',
    category: 'Regulatory' as const,
    description: 'A regulatory requirement is overdue.',
    evaluate: (input: InputData): RuleEvaluation => {
      const days = input.requirementDeadlineDays;
      const triggered = typeof days === 'number' && days < 0 && days >= -30;
      return {
        ruleId: 'reg_requirement_overdue',
        ruleName: 'Requirement overdue',
        category: 'Regulatory',
        description: 'A regulatory requirement is overdue.',
        triggered,
        observedValue: days,
        threshold: '<0 days (overdue)',
        points: triggered ? 20 : 0,
        explanation: triggered ? `Requirement overdue by ${-days} day(s).` : 'Not triggered',
        recommendedAction: triggered ? 'Take corrective action and notify stakeholders.' : undefined,
      } as RuleEvaluation;
    },
  },
  {
    ruleId: 'reg_requirement_critical_overdue',
    ruleName: 'Critical compliance overdue',
    category: 'Regulatory' as const,
    description: 'A critical compliance requirement is overdue.',
    evaluate: (input: InputData): RuleEvaluation => {
      const days = input.requirementDeadlineDays;
      const triggered = typeof days === 'number' && days < -30;
      return {
        ruleId: 'reg_requirement_critical_overdue',
        ruleName: 'Critical compliance overdue',
        category: 'Regulatory',
        description: 'A critical compliance requirement is overdue.',
        triggered,
        observedValue: days,
        threshold: '<-30 days',
        points: triggered ? 20 : 0,
        explanation: triggered ? `Critical compliance overdue by ${-days} day(s).` : 'Not triggered',
        recommendedAction: triggered ? 'Immediate executive escalation and remediation.' : undefined,
      } as RuleEvaluation;
    },
  },
];
