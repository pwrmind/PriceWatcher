
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Product } from '@/lib/types';
import { useMemo, useState } from 'react';
import { subDays, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimeRange = '7d' | '30d' | '1y';

const timeRanges: { value: TimeRange, label: string }[] = [
    { value: '7d', label: 'Неделя' },
    { value: '30d', label: 'Месяц' },
    { value: '1y', label: 'Год' },
];

interface PositionHistoryChartProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
}

export function PositionHistoryChart({ mainProduct, comparisonProducts }: PositionHistoryChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const { chartData, chartConfig } = useMemo(() => {
    const allProducts = [...(mainProduct ? [mainProduct] : []), ...comparisonProducts.filter(p => p.shopId === 'competitor')];

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
        case '1y':
            startDate = subMonths(now, 12);
            break;
    }


    const combinedDataMap = new Map<string, { date: string; [key: string]: number | string }>();

    allProducts.forEach(product => {
      product.positionHistory.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= startDate) {
            if (!combinedDataMap.has(entry.date)) {
              combinedDataMap.set(entry.date, { date: entry.date });
            }
            const dataPoint = combinedDataMap.get(entry.date);
            if(dataPoint) {
                dataPoint[product.id] = entry.position;
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

  if (!mainProduct) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>История позиций в выдаче</CardTitle>
                <CardDescription>Выберите продукт для просмотра истории его позиций.</CardDescription>
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
                <CardTitle>История позиций в выдаче</CardTitle>
                <CardDescription>Динамика позиций в поиске за выбранный период.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} reversed={true} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(value) => `#${value}`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map(productId => (
                <defs key={productId}>
                    <linearGradient id={`fill-${productId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig[productId].color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartConfig[productId].color} stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
            ))}
            {Object.keys(chartConfig).map(productId => (
                <Area
                    key={productId}
                    type="monotone"
                    dataKey={productId}
                    stroke={chartConfig[productId].color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig[productId].label}
                    fill={`url(#fill-${productId})`}
                />
            ))}
          </AreaChart>
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
