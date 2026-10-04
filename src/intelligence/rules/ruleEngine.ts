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
