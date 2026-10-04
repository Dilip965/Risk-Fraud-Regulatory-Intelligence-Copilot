import { RuleResult, AggregatedRisk } from '../types/risk'
import { allRules } from './riskRules'

function mapScoreToSeverity(score: number) {
  if (score >= 75) return 'CRITICAL'
  if (score >= 50) return 'HIGH'
  if (score >= 25) return 'MODERATE'
  return 'LOW'
}

export const evaluate = async (event: any): Promise<AggregatedRisk> => {
  const results: RuleResult[] = allRules.map((r) => r(event))
  const score = Math.min(
    results.reduce((s, r) => s + (r.triggered ? r.points : 0), 0),
    100
  )
  const severity = mapScoreToSeverity(score) as AggregatedRisk['severity']
  return { score, severity, rules: results }
}
import { InputData, RuleEvaluation } from '../types/risk';

export type RuleDef = {
  ruleId: string;
  ruleName: string;
  category: string;
  description: string;
  evaluate: (input: InputData) => RuleEvaluation;
};

export function runRules(rules: RuleDef[], input: InputData): RuleEvaluation[] {
  return rules.map((r) => r.evaluate(input));
}
