import { InputData, RuleEvaluation, RiskResult, Severity } from '../types/risk';
import { runRules, RuleDef } from '../rules/ruleEngine';
import { anomalyRules } from '../rules/riskRules';
import { frequencyRules } from '../rules/fraudRules';
import { regulatoryRules } from '../rules/regulatoryRules';

const ALL_RULES: RuleDef[] = [...anomalyRules as any, ...frequencyRules as any, ...regulatoryRules as any];

function mapSeverity(score: number): Severity {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MODERATE';
  if (score > 0) return 'LOW';
  return 'NONE';
}

export function evaluateRisk(input: InputData): RiskResult {
  const evaluations: RuleEvaluation[] = runRules(ALL_RULES, input);

  // Summation of points in a deterministic way
  const totalScore = Math.min(100, evaluations.reduce((s, r) => s + (r.triggered ? r.points : 0), 0));

  const severity = mapSeverity(totalScore);

  const triggered = evaluations.filter((r) => r.triggered);

  const explanation = triggered.length
    ? `${triggered.length} predefined risk rules were triggered: ${triggered.map((r) => r.ruleName).join(', ')}.`
    : 'No rules triggered.';

  const recommended = triggered.length
    ? triggered.map((r) => r.recommendedAction).filter(Boolean).join(' | ')
    : 'No action required.';

  return {
    inputId: input.id,
    rules: evaluations,
    totalScore,
    severity,
    explanation,
    recommendedAction: recommended,
  } as RiskResult;
}
