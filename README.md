# MarketWatch: Price Comparison Tool

This is a Next.js application built with Firebase Studio that serves as a price comparison tool for products on various marketplaces.

## Core Features

- **Price History Graph**: Displays historical price data for a selected product SKU in a graph format. It also allows overlaying price data from other tracked SKUs for comparison.
- **SKU Tracking & Management**: Users can input, track, and manage a list of SKUs. The list is displayed in a sidebar for easy access.
- **Comparison Table**: Presents product information of tracked items side-by-side in a table format for direct comparison of attributes like price, rating, marketplace, and features.
- **AI-Powered Price Drop Prediction**: Leverages a GenAI model to analyze historical price data and predict potential price drops, helping users make informed purchasing decisions.

## Getting Started

To get started, run the development server:

```bash
npm run dev
```

Then open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The main application logic can be found in `src/app/page.tsx`.
