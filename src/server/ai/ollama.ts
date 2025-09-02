import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type {
  ICPGenerationData,
  ICPProfile,
  CampaignGenerationData,
  Campaign,
  CompanyAnalysis,
  CompanyData,
} from "./types";

export class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateICPProfile(data: ICPGenerationData): Promise<ICPProfile> {
    const prompt = `
You are an expert marketing strategist and ICP (Ideal Customer Profile) specialist. 
Based on the following company information, generate a comprehensive ICP profile:

Company: ${data.companyName}
Industry: ${data.industry}
Location: ${data.location}
Company Size: ${data.size}
Revenue: ${data.revenue}
Target Market: ${data.targetMarket}
Pain Points: ${data.painPoints.join(", ")}
Goals: ${data.goals.join(", ")}

Please generate a detailed ICP profile in JSON format with the following structure:
{
  "demographics": {
    "ageRange": "string",
    "gender": "string",
    "location": "string",
    "incomeLevel": "string",
    "education": "string"
  },
  "psychographics": {
    "interests": ["array of interests"],
    "values": ["array of values"],
    "lifestyle": "string",
    "personality": "string"
  },
  "behavioral": {
    "buyingBehavior": "string",
    "decisionMakingProcess": "string",
    "painPoints": ["array of pain points"],
    "motivations": ["array of motivations"]
  },
  "professional": {
    "jobTitle": "string",
    "department": "string",
    "companySize": "string",
    "industry": "string",
    "responsibilities": ["array of responsibilities"]
  },
  "challenges": {
    "primaryChallenges": ["array of challenges"],
    "objections": ["array of objections"],
    "barriers": ["array of barriers"]
  },
  "solutions": {
    "desiredOutcomes": ["array of outcomes"],
    "successMetrics": ["array of metrics"],
    "preferredFeatures": ["array of features"]
  }
}

Make the profile realistic and specific to the company's industry and target market.
`;

    try {
      const result = await generateText({
        model: openai("gpt-4"),
        prompt,
        temperature: 0.7,
      });

      return JSON.parse(result.text) as ICPProfile;
    } catch (error) {
      console.error("Error generating ICP profile:", error);
      throw new Error("Failed to generate ICP profile");
    }
  }

  async generateCampaign(data: CampaignGenerationData): Promise<Campaign> {
    const prompt = `
You are an expert marketing copywriter and campaign strategist.
Based on the following ICP profile and campaign requirements, generate a comprehensive marketing campaign:

ICP Profile: ${JSON.stringify(data.icpProfile, null, 2)}
Copy Style: ${data.copyStyle}
Media Type: ${data.mediaType}
Call-to-Action: ${data.cta}
Hooks: ${data.hooks}

Please generate a complete campaign in JSON format with the following structure:
{
  "adCopy": {
    "headline": "string",
    "subheadline": "string",
    "body": "string",
    "cta": "string"
  },
  "hooks": {
    "primaryHook": "string",
    "secondaryHooks": ["array of hooks"],
    "emotionalTriggers": ["array of triggers"]
  },
  "landingPageCopy": {
    "heroSection": {
      "headline": "string",
      "subheadline": "string",
      "benefits": ["array of benefits"]
    },
    "features": ["array of features"],
    "testimonials": ["array of testimonial ideas"],
    "socialProof": ["array of social proof elements"]
  },
  "imagePrompt": "Detailed prompt for generating campaign imagery",
  "targeting": {
    "audience": "string",
    "platforms": ["array of platforms"],
    "timing": "string"
  },
  "messaging": {
    "valueProposition": "string",
    "uniqueSellingPoints": ["array of USPs"],
    "tone": "string"
  }
}

Make the campaign compelling, specific to the ICP, and optimized for the specified media type and copy style.
`;

    try {
      const result = await generateText({
        model: openai("gpt-4"),
        prompt,
        temperature: 0.8,
      });

      return JSON.parse(result.text) as Campaign;
    } catch (error) {
      console.error("Error generating campaign:", error);
      throw new Error("Failed to generate campaign");
    }
  }

  async analyzeCompanyData(
    companyData: CompanyData[],
  ): Promise<CompanyAnalysis> {
    const prompt = `
You are a business analyst specializing in market research and customer profiling.
Analyze the following company data and provide insights for ICP generation:

Company Data: ${JSON.stringify(companyData, null, 2)}

Please provide analysis in JSON format:
{
  "industryInsights": {
    "marketTrends": ["array of trends"],
    "competitiveLandscape": "string",
    "growthOpportunities": ["array of opportunities"]
  },
  "customerSegments": ["array of potential segments"],
  "painPoints": ["array of common pain points"],
  "recommendations": {
    "targetAudience": "string",
    "messagingStrategy": "string",
    "channels": ["array of channels"]
  }
}
`;

    try {
      const result = await generateText({
        model: openai("gpt-4"),
        prompt,
        temperature: 0.6,
      });

      return JSON.parse(result.text) as CompanyAnalysis;
    } catch (error) {
      console.error("Error analyzing company data:", error);
      throw new Error("Failed to analyze company data");
    }
  }
}

export const aiService = AIService.getInstance();
