
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Product } from '@/lib/types';
import { useMemo, useState } from 'react';
import { subDays, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimeRange = '7d' | '30d' | '6m' | '1y';

const timeRanges: { value: TimeRange, label: string }[] = [
    { value: '7d', label: '7 дней' },
    { value: '30d', label: 'Месяц' },
    { value: '6m', label: '6 месяцев' },
    { value: '1y', label: 'Год' },
];

interface PriceHistoryChartProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
}

export function PriceHistoryChart({ mainProduct, comparisonProducts }: PriceHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const { chartData, chartConfig } = useMemo(() => {
    const allProducts = [...(mainProduct ? [mainProduct] : []), ...comparisonProducts];

    if (allProducts.length === 0) return { chartData: [], chartConfig: {} };
    
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
        case '7d':
            startDate = subDays(now, 7);
            break;
        case '30d':
            startDate = subDays(now, 30);
            break;
        case '6m':
            startDate = subMonths(now, 6);
            break;
        case '1y':
            startDate = subMonths(now, 12);
            break;
    }


    const combinedDataMap = new Map<string, { date: string; [key: string]: number | string }>();

    allProducts.forEach(product => {
      product.priceHistory.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startDate) {
            if (!combinedDataMap.has(entry.date)) {
              combinedDataMap.set(entry.date, { date: entry.date });
            }
            const dataPoint = combinedDataMap.get(entry.date);
            if(dataPoint) {
                dataPoint[product.id] = entry.price;
            }
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
  }, [mainProduct, comparisonProducts, timeRange]);

  if (!mainProduct && comparisonProducts.length === 0) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>История цен</CardTitle>
                <CardDescription>Выберите продукт для просмотра истории его цен.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[245px] w-full flex items-center justify-center bg-muted/10 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Продукт не выбран</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
                <CardTitle>История цен</CardTitle>
                <CardDescription>Колебания цен за выбранный период.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig} className="h-full w-full">
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
       <CardFooter className="justify-center border-t pt-4">
        <div className="flex items-center gap-2">
          {timeRanges.map(range => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className={cn(timeRange !== range.value && "text-muted-foreground")}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
