export type PriceData = {
  date: string;
  price: number;
};

export type Product = {
  id: string; // SKU
  name: string;
  imageUrl: string;
  marketplace: string;
  rating: number;
  reviews: number;
  features: string[];
  priceHistory: PriceData[];
};

export type PricePredictionType = {
  willPriceDrop: boolean;
  confidence: number;
  reason: string;
};
