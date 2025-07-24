'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecommendedActions } from '@/app/actions';
import { type Product } from '@/lib/types';
import { type RecommendedAction } from '@/ai/flows/get-recommended-actions';
import { AlertCircle, Bot, Lightbulb, TrendingUp, Zap } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface RecommendedActionsProps {
  mainProduct: Product;
  comparisonProducts: Product[];
}

const iconMap: { [key: string]: React.ElementType } = {
  price: Zap,
  strategy: Lightbulb,
  sales: TrendingUp,
  default: Bot,
};


export function RecommendedActions({ mainProduct, comparisonProducts }: RecommendedActionsProps) {
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActions() {
      setLoading(true);
      setError(null);
      const result = await getRecommendedActions({
        mainProduct,
        comparisonProducts,
      });

      if ('error' in result) {
        setError(result.error);
      } else {
        setActions(result);
      }
      setLoading(false);
    }

    fetchActions();
  }, [mainProduct, comparisonProducts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Рекомендуемые действия</CardTitle>
        <CardDescription>
          AI-рекомендации для увеличения конкурентоспособности вашего продукта.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {actions.map((action, index) => {
              const Icon = iconMap[action.category] || iconMap.default;
              return (
                <li key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-grow pt-1">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
