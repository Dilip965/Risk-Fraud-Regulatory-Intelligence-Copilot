export type Severity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'NONE'

export interface EvidenceItem {
  key: string
  value: any
}

export interface RuleResult {
  ruleId: string
  ruleName: string
  category: string
  triggered: boolean
  observedValue: any
  threshold: any
  points: number
  explanation: string
  recommendedAction: string
  evidence: EvidenceItem[]
}

export interface AggregatedRisk {
  score: number
  severity: Severity
  rules: RuleResult[]
}
export type Category = 'Anomaly' | 'Frequency' | 'DataInconsistency' | 'AccessBehavior' | 'Regulatory';

export interface InputData {
  id?: string;
  activityMultiplier?: number; // e.g., 4.2x baseline -> 4.2
  repeatedEvents?: number;
  missingFields?: string[];
  conflictingRecords?: boolean;
  accessTimes?: string[]; // ISO strings or human friendly
  unusualLocations?: number; // count of unusual locations
  requirementDeadlineDays?: number | null; // days until deadline (negative = overdue)
  previousIssues?: number; // repeated previous issue count
}

export interface RuleEvaluation {
  ruleId: string;
  ruleName: string;
  category: Category;
  description: string;
  triggered: boolean;
  observedValue?: any;
  threshold?: any;
  points: number;
  explanation?: string;
  recommendedAction?: string;
}

export interface RiskResult {
  inputId?: string;
  rules: RuleEvaluation[];
  totalScore: number;
  severity: Severity;
  explanation: string;
  recommendedAction: string;
}
