'use server';

import { predictPriceDrop } from '@/ai/flows/predict-price-drop';
import type { PredictPriceDropInput } from '@/ai/flows/predict-price-drop';
import { getRecommendedActions as getRecommendedActionsFlow } from '@/ai/flows/get-recommended-actions';
import type { GetRecommendedActionsInput, RecommendedAction } from '@/ai/flows/get-recommended-actions';
import type { PricePredictionType, PriceData, PositionData } from '@/lib/types';
import { scrapeProductData } from '@/services/marketplace-scraper';

export async function getPriceDropPrediction(input: PredictPriceDropInput): Promise<PricePredictionType | { error: string }> {
  try {
    const prediction = await predictPriceDrop(input);
    return prediction;
  } catch (error) {
    console.error('Error fetching price drop prediction:', error);
    return { error: 'Не удалось получить прогноз цен. Пожалуйста, попробуйте позже.' };
  }
}

export async function getRecommendedActions(input: GetRecommendedActionsInput): Promise<RecommendedAction[] | { error: string }> {
    try {
        const actions = await getRecommendedActionsFlow(input);
        return actions;
    } catch (error) {
        console.error('Error fetching recommended actions:', error);
        return { error: 'Не удалось получить рекомендуемые действия. Пожалуйста, попробуйте позже.' };
    }
}

export async function refreshSkuData(sku: string): Promise<{ price: PriceData; position: PositionData } | { error: string }> {
    try {
        const newData = await scrapeProductData(sku);
        if (!newData) {
            return { error: 'Не удалось найти продукт для обновления.' };
        }
        return newData;
    } catch (error) {
        console.error('Error refreshing SKU data:', error);
        return { error: 'Не удалось обновить данные SKU. Пожалуйста, попробуйте позже.' };
    }
}
