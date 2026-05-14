import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeInteractions(medicationText: string): Promise<AnalysisResult> {
  const prompt = `Analyze the following patient medication list for drug-drug interactions:
  "${medicationText}"
  
  Provide a detailed clinical analysis including:
  1. Total number of unique drugs identified.
  2. Number of interactions found.
  3. Number of high risk alerts (Major/Contraindicated).
  4. Number of safe combinations.
  5. A list of specific interactions with drugs involved, severity, type (e.g., Systemic, CYP3A4 Inhibition, Pharmacodynamic), mechanism, and recommendation.
  6. Clinical insights (Actionable advice for the professional).

  Return ONLY a JSON object following this structure:
  {
    "totalDrugs": number,
    "interactionsFound": number,
    "highRiskAlerts": number,
    "safeCombinations": number,
    "interactions": [
      {
        "drugs": ["Drug A", "Drug B"],
        "severity": "LOW" | "MODERATE" | "MAJOR" | "CONTRAINDICATED",
        "type": string,
        "mechanism": string,
        "recommendation": string
      }
    ],
    "clinicalInsights": [
      {
        "title": string,
        "description": string,
        "severity": "error" | "warning" | "info"
      }
    ]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalDrugs: { type: Type.NUMBER },
            interactionsFound: { type: Type.NUMBER },
            highRiskAlerts: { type: Type.NUMBER },
            safeCombinations: { type: Type.NUMBER },
            interactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  drugs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  severity: { type: Type.STRING, enum: Object.values(Severity) },
                  type: { type: Type.STRING },
                  mechanism: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ["drugs", "severity", "type", "mechanism", "recommendation"]
              }
            },
            clinicalInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["error", "warning", "info"] }
                },
                required: ["title", "description", "severity"]
              }
            }
          },
          required: ["totalDrugs", "interactionsFound", "highRiskAlerts", "safeCombinations", "interactions", "clinicalInsights"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
}
