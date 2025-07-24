'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Product } from '@/lib/types';
import { useMemo } from 'react';

interface PriceHistoryChartProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
}

export function PriceHistoryChart({ mainProduct, comparisonProducts }: PriceHistoryChartProps) {

  const { chartData, chartConfig } = useMemo(() => {
    const allProducts = [...(mainProduct ? [mainProduct] : []), ...comparisonProducts];

    if (allProducts.length === 0) return { chartData: [], chartConfig: {} };

    const combinedDataMap = new Map<string, { date: string; [key: string]: number | string }>();

    allProducts.forEach(product => {
      product.priceHistory.forEach(entry => {
        if (!combinedDataMap.has(entry.date)) {
          combinedDataMap.set(entry.date, { date: entry.date });
        }
        const dataPoint = combinedDataMap.get(entry.date);
        if(dataPoint) {
            dataPoint[product.id] = entry.price;
        }
      });
    });
    
    const data = Array.from(combinedDataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const config = allProducts.reduce((config, product, index) => {
      config[product.id] = {
        label: product.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    }, {} as any);

    return { chartData: data, chartConfig: config };
  }, [mainProduct, comparisonProducts]);

  if (!mainProduct && comparisonProducts.length === 0) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>История цен</CardTitle>
                <CardDescription>Выберите продукт для просмотра истории его цен.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center bg-muted/10 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Продукт не выбран</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>История цен</CardTitle>
        <CardDescription>Колебания цен за последние 90 дней.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(value) => `$${value}`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map(productId => (
                <Line
                    key={productId}
                    type="monotone"
                    dataKey={productId}
                    stroke={chartConfig[productId].color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig[productId].label}
                />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
