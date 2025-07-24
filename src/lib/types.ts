export type PriceData = {
  date: string;
  price: number;
};

export type Manager = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Product = {
  id: string; // SKU
  name: string;
  imageUrl: string;
  managerId: string;
  marketplace: string;
  rating: number;
  reviews: number;
  features: string[];
  priceHistory: PriceData[];
  notifications: number;
};

export type PricePredictionType = {
  willPriceDrop: boolean;
  confidence: number;
  reason: string;
};
