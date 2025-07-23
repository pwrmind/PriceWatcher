'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, HelpCircle, Loader2 } from 'lucide-react';
import { getPriceDropPrediction } from '@/app/actions';
import type { PriceData, PricePredictionType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type PricePredictionProps = {
  sku: string;
  priceHistory: PriceData[];
};

export function PricePrediction({ sku, priceHistory }: PricePredictionProps) {
  const [prediction, setPrediction] = useState<PricePredictionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPrediction() {
      setLoading(true);
      setError(null);
      const result = await getPriceDropPrediction({ sku, historicalPriceData: priceHistory });
      if (isMounted) {
        if ('error' in result) {
          setError(result.error);
        } else {
          setPrediction(result);
        }
        setLoading(false);
      }
    }
    fetchPrediction();
    return () => { isMounted = false };
  }, [sku, priceHistory]);

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (error || !prediction) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 text-destructive" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{error || 'Prediction not available.'}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const { willPriceDrop, confidence, reason } = prediction;
  const confidencePercentage = (confidence * 100).toFixed(0);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 cursor-help">
          {willPriceDrop ? (
            <ArrowDown className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUp className="h-4 w-4 text-red-600" />
          )}
          <span
            className={cn(
              'text-xs font-semibold',
              willPriceDrop ? 'text-green-600' : 'text-red-600'
            )}
          >
            {confidencePercentage}%
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-semibold">
          {willPriceDrop ? 'Price Drop Likely' : 'Price Rise/Stable Likely'}
        </p>
        <p className="text-sm text-muted-foreground">{reason}</p>
      </TooltipContent>
    </Tooltip>
  );
}
