'use server';

/**
 * @fileOverview Provides recommended actions for a product based on its data and competitor data.
 * 
 * - getRecommendedActions - Generates a list of recommended actions.
 * - GetRecommendedActionsInput - The input type for the getRecommendedActions function.
 * - RecommendedAction - The output type for a single recommended action.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Product } from '@/lib/types';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  marketplace: z.string(),
  rating: z.number(),
  reviews: z.number(),
  features: z.array(z.string()),
  priceHistory: z.array(z.object({
    date: z.string(),
    price: z.number(),
  })),
});

const GetRecommendedActionsInputSchema = z.object({
  mainProduct: ProductSchema.describe("The user's main product."),
  comparisonProducts: z.array(ProductSchema).describe("A list of competitor products for comparison."),
});

export type GetRecommendedActionsInput = z.infer<typeof GetRecommendedActionsInputSchema>;

const RecommendedActionSchema = z.object({
    category: z.enum(['price', 'strategy', 'sales']).describe('The category of the recommendation.'),
    title: z.string().describe('A short, catchy title for the recommended action.'),
    description: z.string().describe('A detailed description of the recommended action and why it is suggested.'),
});

export type RecommendedAction = z.infer<typeof RecommendedActionSchema>;

const GetRecommendedActionsOutputSchema = z.array(RecommendedActionSchema);


export async function getRecommendedActions(input: GetRecommendedActionsInput): Promise<RecommendedAction[]> {
    const flowResult = await recommendedActionsFlow(input);
    return flowResult;
}

const prompt = ai.definePrompt({
  name: 'recommendedActionsPrompt',
  input: { schema: GetRecommendedActionsInputSchema },
  output: { schema: GetRecommendedActionsOutputSchema },
  prompt: `
You are a marketing and sales expert for e-commerce. Your goal is to provide actionable recommendations to a product manager.
Analyze the main product and compare it with the competitor products provided.

Main Product:
Name: {{{mainProduct.name}}}
SKU: {{{mainProduct.id}}}
Marketplace: {{{mainProduct.marketplace}}}
Rating: {{{mainProduct.rating}}} ({{mainProduct.reviews}} reviews)
Current Price: \${{{mainProduct.priceHistory.[-1].price}}}
Features: {{#each mainProduct.features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Competitor Products:
{{#each comparisonProducts}}
- Name: {{{this.name}}} ({{this.marketplace}})
  SKU: {{{this.id}}}
  Rating: {{{this.rating}}} ({{this.reviews}} reviews)
  Price: \${{{this.priceHistory.[-1].price}}}
  Features: {{#each this.features}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{else}}
No competitor products to compare.
{{/each}}

Based on this data, provide 3-4 specific, actionable recommendations.
For each recommendation, provide a category, a title, and a description.
The categories are: 'price', 'strategy', 'sales'.

- 'price': Recommendations related to changing the price.
- 'strategy': Recommendations related to product features, marketing, or positioning.
- 'sales': Recommendations related to boosting sales through promotions or bundles.

Focus on providing concrete advice. For example, instead of "Lower the price", say "Consider lowering the price to $XX.XX to be more competitive with [Competitor Name]".
`,
});

const recommendedActionsFlow = ai.defineFlow(
  {
    name: 'recommendedActionsFlow',
    inputSchema: GetRecommendedActionsInputSchema,
    outputSchema: GetRecommendedActionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || [];
  }
);
