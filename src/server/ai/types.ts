export interface ICPGenerationData {
  companyName: string;
  industry: string;
  location: string;
  size: string;
  revenue: string;
  targetMarket: string;
  painPoints: string[];
  goals: string[];
}

export interface ICPProfile {
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    incomeLevel: string;
    education: string;
  };
  psychographics: {
    interests: string[];
    values: string[];
    lifestyle: string;
    personality: string;
  };
  behavioral: {
    buyingBehavior: string;
    decisionMakingProcess: string;
    painPoints: string[];
    motivations: string[];
  };
  professional: {
    jobTitle: string;
    department: string;
    companySize: string;
    industry: string;
    responsibilities: string[];
  };
  challenges: {
    primaryChallenges: string[];
    objections: string[];
    barriers: string[];
  };
  solutions: {
    desiredOutcomes: string[];
    successMetrics: string[];
    preferredFeatures: string[];
  };
}

export interface CampaignGenerationData {
  icpProfile: ICPProfile;
  copyStyle: string;
  mediaType: string;
  cta: string;
  hooks: string;
}

export interface Campaign {
  adCopy: {
    headline: string;
    subheadline: string;
    body: string;
    cta: string;
  };
  hooks: {
    primaryHook: string;
    secondaryHooks: string[];
    emotionalTriggers: string[];
  };
  landingPageCopy: {
    heroSection: {
      headline: string;
      subheadline: string;
      benefits: string[];
    };
    features: string[];
    testimonials: string[];
    socialProof: string[];
  };
  imagePrompt: string;
  targeting: {
    audience: string;
    platforms: string[];
    timing: string;
  };
  messaging: {
    valueProposition: string;
    uniqueSellingPoints: string[];
    tone: string;
  };
}

export interface CompanyAnalysis {
  industryInsights: {
    marketTrends: string[];
    competitiveLandscape: string;
    growthOpportunities: string[];
  };
  customerSegments: string[];
  painPoints: string[];
  recommendations: {
    targetAudience: string;
    messagingStrategy: string;
    channels: string[];
  };
}

export interface CompanyData {
  name: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  [key: string]: unknown;
}
