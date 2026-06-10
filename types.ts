
export type RiskLevel = 'low' | 'medium' | 'high';

export enum DocType {
  REGISTRU_EVIDENTA = 'registru_evidenta',
  POLITICA_RETENTIE = 'politica_retentie',
  POLITICA_SECURITATE = 'politica_securitate',
  REGISTRU_BRESE = 'registru_brese',
  ANALIZA_INTERES = 'analiza_interes',
  ANALIZA_PROPORTIONALITATE = 'analiza_proportionalitate', // Specifc RO (Art 5 Legea 190)
  NOTA_INFORMARE_CLIENTI = 'nota_informare_clienti',
  NOTA_INFORMARE_ANGAJATI = 'nota_informare_angajati', // Separat de clienti
  POLITICA_COOKIES = 'politica_cookies',
  PROCEDURA_CERERI = 'procedura_cereri',
  FORMULAR_CONSIMTAMANT = 'formular_consimtamant',
  ACORD_PRELUCRARE = 'acord_prelucrare',
  NDA_ANGAJATI = 'nda_angajati', // Acord confidentialitate (Art 32)
  DPIA = 'dpia',
  DECIZIE_DPO = 'decizie_dpo',
}

export interface BillingDetails {
  entityType: 'company' | 'individual';
  companyName: string;
  cui: string;
  regCom?: string;
  address: string;
  county: string;
  city: string;
  email: string;
  phone?: string;
}

export interface CompanyProfile {
  name: string;
  cui: string;
  industry: string;
  employeeCount: number;
  hasWebsite: boolean;
  websiteUrl?: string;
  hasNewsletter: boolean;
  hasCCTV: boolean;
  processSensitiveData: boolean;
  processCNPLegitimateInterest: boolean; // Specifc RO (Art 4 Legea 190) - Trigger DPO
  thirdPartyServices: string[];
  termsAcceptedAt?: Date;
  privacyAcceptedAt?: Date;
  billingDetails?: BillingDetails;
}

export interface DocumentVersion {
  id: string;
  date: Date;
  content: string;
  reason: string;
}

export interface DocumentItem {
  id: string;
  type: DocType;
  title: string;
  description: string;
  isMandatory: boolean;
  status: 'missing' | 'generated' | 'approved';
  lastUpdated?: Date;
  content?: string;
  history: DocumentVersion[];
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export interface UserState {
  isOnboardingComplete: boolean;
  isDemo?: boolean; 
  subscriptionStatus: SubscriptionStatus;
  profile: CompanyProfile;
  documents: DocumentItem[];
}
