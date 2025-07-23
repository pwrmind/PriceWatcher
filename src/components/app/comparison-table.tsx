'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ComparisonTableProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
}

export function ComparisonTable({ mainProduct, comparisonProducts }: ComparisonTableProps) {
  if (!mainProduct) {
    return null;
  }

  const allProducts = [mainProduct, ...comparisonProducts];

  const renderRating = (rating: number) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
      <span className="font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Сравнение продуктов</CardTitle>
        <CardDescription>Сравнение отслеживаемых продуктов бок о бок.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] font-semibold">Атрибут</TableHead>
                {allProducts.map((product) => (
                  <TableHead key={product.id} className="min-w-[200px]">
                    <div className="flex items-start gap-4">
                      <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded-md" data-ai-hint="product image" />
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.id}</p>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Цена</TableCell>
                {allProducts.map((product) => (
                  <TableCell key={product.id} className="font-bold text-lg text-primary">
                    ${product.priceHistory.slice(-1)[0]?.price.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Торговая площадка</TableCell>
                {allProducts.map((product) => (
                  <TableCell key={product.id}>{product.marketplace}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Рейтинг</TableCell>
                {allProducts.map((product) => (
                  <TableCell key={product.id}>
                    {renderRating(product.rating)}
                  </TableCell>
                ))}
              </TableRow>
               <TableRow>
                <TableCell className="font-semibold">Отзывы</TableCell>
                {allProducts.map((product) => (
                  <TableCell key={product.id}>{product.reviews.toLocaleString()}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold align-top">Особенности</TableCell>
                {allProducts.map((product) => (
                  <TableCell key={product.id}>
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature) => (
                        <Badge key={feature} variant="secondary">{feature}</Badge>
                      ))}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
