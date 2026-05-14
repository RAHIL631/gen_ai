export enum Severity {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  CONTRAINDICATED = 'CONTRAINDICATED',
}

export interface Interaction {
  drugs: string[];
  severity: Severity;
  type: string;
  mechanism: string;
  recommendation: string;
  confidence?: number;
}

export interface AnalysisResult {
  totalDrugs: number;
  interactionsFound: number;
  highRiskAlerts: number;
  safeCombinations: number;
  interactions: Interaction[];
  clinicalInsights: {
    title: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
  }[];
}

export interface CheckHistory {
  id: string;
  drugs: string[];
  timestamp: string;
  issueCount: number;
  maxSeverity: Severity | 'NONE';
}

export interface User {
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
