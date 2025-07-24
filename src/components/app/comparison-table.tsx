'use client';

import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ComparisonTableProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
  onRemoveComparisonSku: (id: string) => void;
}

export function ComparisonTable({ mainProduct, comparisonProducts, onRemoveComparisonSku }: ComparisonTableProps) {

  const allProducts = mainProduct ? [mainProduct, ...comparisonProducts] : [...comparisonProducts];

  if (allProducts.length === 0) {
     return (
        <div className="h-[350px] w-full flex items-center justify-center bg-muted/10 rounded-lg border border-dashed">
            <p className="text-muted-foreground text-center">Выберите свой SKU и добавьте SKU для сравнения, чтобы начать.</p>
        </div>
    );
  }

  const renderRating = (rating: number) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
      <span className="font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] font-semibold">Атрибут</TableHead>
            {allProducts.map((product) => (
              <TableHead key={product.id} className="min-w-[220px]">
                <div className="flex items-start gap-3">
                  <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded-md" data-ai-hint="product image" />
                  <div className="flex-grow">
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.id}</p>
                  </div>
                   {product.id !== mainProduct?.id && (
                     <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onRemoveComparisonSku(product.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground"/>
                        <span className="sr-only">Удалить из сравнения</span>
                     </Button>
                   )}
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
  );
}
