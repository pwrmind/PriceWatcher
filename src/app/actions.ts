'use server';

import { predictPriceDrop } from '@/ai/flows/predict-price-drop';
import type { PredictPriceDropInput } from '@/ai/flows/predict-price-drop';
import type { PricePredictionType } from '@/lib/types';

export async function getPriceDropPrediction(input: PredictPriceDropInput): Promise<PricePredictionType | { error: string }> {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return { error: 'Ключ API Gemini не настроен.' };
  }
  try {
    const prediction = await predictPriceDrop(input);
    return prediction;
  } catch (error) {
    console.error('Error fetching price drop prediction:', error);
    return { error: 'Не удалось получить прогноз цен. Пожалуйста, попробуйте позже.' };
  }
}
