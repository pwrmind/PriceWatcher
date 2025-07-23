// PredictPriceDrop story implementation.

'use server';

/**
 * @fileOverview Predicts potential price drops for tracked products.
 *
 * - predictPriceDrop - Predicts potential price drops for a given product SKU.
 * - PredictPriceDropInput - The input type for the predictPriceDrop function.
 * - PredictPriceDropOutput - The return type for the predictPriceDrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPriceDropInputSchema = z.object({
  sku: z.string().describe('The product SKU to predict price drops for.'),
  historicalPriceData: z.array(z.object({
    date: z.string().describe('The date of the price.'),
    price: z.number().describe('The price of the product on the given date.'),
  })).describe('Historical price data for the product.'),
});
export type PredictPriceDropInput = z.infer<typeof PredictPriceDropInputSchema>;

const PredictPriceDropOutputSchema = z.object({
  willPriceDrop: z.boolean().describe('Whether the price is predicted to drop in the near future.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
  reason: z.string().describe('The reason for the price drop prediction.'),
});
export type PredictPriceDropOutput = z.infer<typeof PredictPriceDropOutputSchema>;

export async function predictPriceDrop(input: PredictPriceDropInput): Promise<PredictPriceDropOutput> {
  return predictPriceDropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictPriceDropPrompt',
  input: {schema: PredictPriceDropInputSchema},
  output: {schema: PredictPriceDropOutputSchema},
  prompt: `You are a price prediction expert. Analyze the historical price data and predict whether the price of the product will drop in the near future.

Historical Price Data:
{{#each historicalPriceData}}
- Date: {{this.date}}, Price: {{this.price}}
{{/each}}

Consider factors such as seasonality, trends, and price volatility.

Provide a confidence level (0-1) for your prediction and a reason for your prediction.

SKU: {{{sku}}}`,
});

const predictPriceDropFlow = ai.defineFlow(
  {
    name: 'predictPriceDropFlow',
    inputSchema: PredictPriceDropInputSchema,
    outputSchema: PredictPriceDropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
