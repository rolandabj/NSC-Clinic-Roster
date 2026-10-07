/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Gemini API Server-Side Service
 * Uses the modern @google/genai TypeScript SDK with gemini-3.8-flash.
 * All Gemini operations execute securely on the server side using process.env.GEMINI_API_KEY.
 */

import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL = 'gemini-3.8-flash';

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }

  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return geminiClientInstance;
}

export function isGeminiKeyConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== 'MY_GEMINI_API_KEY' && key.trim().length > 0);
}

export interface GenerateOptions {
  systemInstruction?: string;
  temperature?: number;
}

export async function generateContentWithGemini(
  prompt: string,
  options?: GenerateOptions
): Promise<string> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: options?.systemInstruction,
      temperature: options?.temperature,
    },
  });

  return response.text || '';
}

export interface RosterInsightsInput {
  scheduleName: string;
  startDate?: string;
  endDate?: string;
  nurseCount?: number;
  totalHours?: number;
  unassignedDuties?: number;
  fairnessSummary?: string;
}

export async function generateRosterInsights(
  data: RosterInsightsInput
): Promise<string> {
  const systemInstruction = `You are a clinical nurse manager and healthcare operations expert assisting with hospital/clinic shift rosters. Provide concise, clear, and professional analysis with three sections:
1. Executive Roster Summary
2. Equity & Fairness Analysis
3. Recommended Actions / Adjustments.
Keep language encouraging, practical, and clear.`;

  const prompt = `Please analyze this clinic roster:
- Roster Name: ${data.scheduleName}
- Dates: ${data.startDate || 'N/A'} to ${data.endDate || 'N/A'}
- Active Nurses: ${data.nurseCount ?? 'N/A'}
- Total Scheduled Hours: ${data.totalHours ?? 'N/A'}
- Unassigned Sessions/Duties: ${data.unassignedDuties ?? 0}
- Fairness / Balance Observations: ${data.fairnessSummary || 'Standard shift distribution'}

Provide insights and recommendations to ensure fair distribution and well-supported clinic staffing.`;

  return generateContentWithGemini(prompt, { systemInstruction });
}
