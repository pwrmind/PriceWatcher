
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/types';

interface SkuInfoCardProps {
  product: Product | undefined;
}

export function SkuInfoCard({ product }: SkuInfoCardProps) {
  if (!product) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Информация о продукте</CardTitle>
          <CardDescription>Выберите продукт для просмотра деталей.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[245px] w-full flex items-center justify-center bg-muted/10 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Продукт не выбран</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const renderRating = (rating: number, reviews: number) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <span className="font-bold text-lg">{rating.toFixed(1)}</span>
      </div>
      <span className="text-sm text-muted-foreground">({reviews.toLocaleString()} отзывов)</span>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>SKU: {product.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
            <Image 
                src={product.imageUrl} 
                alt={product.name} 
                width={150} 
                height={150} 
                className="rounded-lg"
                data-ai-hint="product image"
            />
        </div>
        <div>
            {renderRating(product.rating, product.reviews)}
        </div>
         <div>
            <h4 className="font-semibold mb-2">Ключевые особенности:</h4>
            <div className="flex flex-wrap gap-2">
                {product.features.map((feature) => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
