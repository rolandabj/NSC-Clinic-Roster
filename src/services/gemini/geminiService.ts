/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Client Gemini Service
 * Communicates with the server-side Gemini API (/api/gemini/*) powered by gemini-3.8-flash.
 * Never imports @google/genai directly or exposes API credentials to the browser.
 */

import { authorizedFetch } from '../auth/authService';

export interface GeminiStatus {
  status: string;
  model: string;
  isKeyConfigured: boolean;
}

export interface GeminiGenerateResponse {
  text: string;
  model: string;
}

export interface GeminiInsightsResponse {
  insights: string;
  model: string;
}

export interface RosterInsightsPayload {
  scheduleName: string;
  startDate?: string;
  endDate?: string;
  nurseCount?: number;
  totalHours?: number;
  unassignedDuties?: number;
  fairnessSummary?: string;
}

/**
 * Checks server Gemini API status and whether an API key is configured.
 */
export async function getGeminiStatus(): Promise<GeminiStatus> {
  const res = await authorizedFetch('/api/gemini/status');
  if (!res.ok) {
    throw new Error(`Failed to check Gemini status (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Sends a text prompt to server-side Gemini 3.8 Flash.
 */
export async function generateWithGemini(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const res = await authorizedFetch('/api/gemini/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemInstruction }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gemini generation request failed');
  }

  return data.text;
}

/**
 * Requests an intelligent roster evaluation and fairness insight summary from Gemini 3.8 Flash.
 */
export async function fetchRosterInsights(
  payload: RosterInsightsPayload
): Promise<string> {
  const res = await authorizedFetch('/api/gemini/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gemini roster insights request failed');
  }

  return data.insights;
}
