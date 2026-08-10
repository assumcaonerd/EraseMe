export type ContentType =
  | 'intimate_image'
  | 'photo'
  | 'video'
  | 'phone'
  | 'name'
  | 'address'
  | 'profile_fake'
  | 'ad_fraud'
  | 'minor'
  | 'other';

export type CaseStatus =
  | 'found'
  | 'evidence_preserved'
  | 'report_prepared'
  | 'report_sent'
  | 'awaiting_response'
  | 'removed'
  | 'reappeared'
  | 'legal_review';

export interface IncidentData {
  fullName?: string;
  aliases?: string;
  phones?: string;
  emails?: string;
  urls: string;
  keywords?: string;
  contentType: ContentType;
  description: string;
  userRequests?: string;
  anonymize: boolean;
  professionalMode: boolean;
}

export interface RemovalTemplate {
  platform: string;
  title: string;
  content: string;
  channel?: string;
}

export interface TechnicalAnalysis {
  domain?: string;
  host?: string;
  registrar?: string;
  cdn?: string;
  socialNetwork?: string;
  reportingChannels: string[];
  notes: string[];
}

export interface ActionStep {
  priority: number;
  title: string;
  description: string;
  type: 'removal' | 'deindex' | 'copy_removal' | 'evidence' | 'monitor' | 'legal';
}

export interface RemovalPlanResponse {
  summary: string;
  classification: string;
  risks: string[];
  technicalAnalysis: TechnicalAnalysis;
  actionPlan: ActionStep[];
  templates: RemovalTemplate[];
  placeholders: string[];
  checklist: string[];
  evidenceTips: string[];
  monitoringTips: string[];
  distinctionNote: string;
}
