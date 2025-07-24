/**
 * @fileoverview A service that simulates scraping product data from a marketplace.
 */
'use server';

import { allAvailableProducts } from '@/lib/mock-data';
import type { PriceData, PositionData } from '@/lib/types';

/**
 * Simulates scraping fresh data for a given SKU from a marketplace.
 * In a real application, this would make an API call to the marketplace.
 * @param sku The product SKU to scrape.
 * @returns The latest price and position data, or null if the product is not found.
 */
export async function scrapeProductData(
  sku: string
): Promise<{ price: PriceData; position: PositionData } | null> {
  console.log(`Scraping data for SKU: ${sku}...`);

  const product = allAvailableProducts.find((p) => p.id === sku);

  if (!product) {
    console.warn(`Product with SKU ${sku} not found for scraping.`);
    return null;
  }

  // Simulate finding new data by generating a new price and position.
  const lastPriceEntry = product.priceHistory[product.priceHistory.length - 1];
  const lastPositionEntry = product.positionHistory[product.positionHistory.length - 1];
    
  const randomFactor = Math.random() - 0.5; // -0.5 to 0.5

  const newPrice = Math.max(10, parseFloat((lastPriceEntry.price * (1 + randomFactor * 0.05)).toFixed(2)));
  const newPosition = Math.max(1, Math.min(100, Math.round(lastPositionEntry.position + randomFactor * 4)));
  
  const today = new Date().toISOString().split('T')[0];

  const newData = {
    price: {
      date: today,
      price: newPrice,
    },
    position: {
      date: today,
      position: newPosition,
    },
  };
  
  console.log(`Scraped new data for SKU ${sku}:`, newData);

  // In a real scenario, you might save this data to a database.
  // Here, we just return it.
  return newData;
}
