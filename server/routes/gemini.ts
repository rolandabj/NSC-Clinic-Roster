/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Gemini API Routes
 * Server endpoints for AI operations using gemini-3.8-flash.
 */

import { Router, Request, Response } from 'express';
import {
  generateContentWithGemini,
  generateRosterInsights,
  isGeminiKeyConfigured,
  GEMINI_MODEL,
} from '../services/gemini/geminiClient';

export const geminiRouter = Router();

// Liveness & model status check
geminiRouter.get('/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    model: GEMINI_MODEL,
    isKeyConfigured: isGeminiKeyConfigured(),
  });
});

// General text generation endpoint
geminiRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, temperature } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'BadRequest',
        message: 'The "prompt" string field is required in the request body.',
      });
    }

    if (!isGeminiKeyConfigured()) {
      return res.status(503).json({
        error: 'MissingApiKey',
        message:
          'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in the Settings > Secrets panel.',
      });
    }

    const text = await generateContentWithGemini(prompt, {
      systemInstruction,
      temperature,
    });

    return res.json({
      text,
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error('[GeminiAPI] generate error:', error);
    return res.status(500).json({
      error: 'GeminiGenerationFailed',
      message: error?.message || 'Failed to generate content with Gemini 3.8 Flash.',
    });
  }
});

// Specialized roster fairness & workload insight endpoint
geminiRouter.post('/insights', async (req: Request, res: Response) => {
  try {
    const { scheduleName, startDate, endDate, nurseCount, totalHours, unassignedDuties, fairnessSummary } =
      req.body || {};

    if (!scheduleName) {
      return res.status(400).json({
        error: 'BadRequest',
        message: 'The "scheduleName" string field is required.',
      });
    }

    if (!isGeminiKeyConfigured()) {
      return res.status(503).json({
        error: 'MissingApiKey',
        message:
          'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in the Settings > Secrets panel.',
      });
    }

    const insights = await generateRosterInsights({
      scheduleName,
      startDate,
      endDate,
      nurseCount,
      totalHours,
      unassignedDuties,
      fairnessSummary,
    });

    return res.json({
      insights,
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error('[GeminiAPI] insights error:', error);
    return res.status(500).json({
      error: 'GeminiInsightsFailed',
      message: error?.message || 'Failed to generate roster insights with Gemini 3.8 Flash.',
    });
  }
});
