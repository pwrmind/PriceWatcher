
'use client';

import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import type { Product, Manager } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SkuInfoModal } from './sku-info-modal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

interface ComparisonTableProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
  allManagers: Manager[];
  onRemoveComparisonSku: (id: string) => void;
  onAssignManager: (skuId: string, managerId: string) => void;
  onUnassignManager: (skuId: string) => void;
  onUpdatePrice: (skuId: string, newPrice: number) => void;
  onRefreshSku: (skuId: string) => Promise<void>;
}

export function ComparisonTable({ 
    mainProduct, 
    comparisonProducts, 
    allManagers,
    onRemoveComparisonSku, 
    onAssignManager, 
    onUnassignManager, 
    onUpdatePrice,
    onRefreshSku
}: ComparisonTableProps) {
  const [refreshingSkuId, setRefreshingSkuId] = useState<string | null>(null);

  const handleRefreshClick = async (skuId: string) => {
    setRefreshingSkuId(skuId);
    await onRefreshSku(skuId);
    setRefreshingSkuId(null);
  };

  const filteredComparisonProducts = mainProduct
    ? comparisonProducts.filter((p) => p.id !== mainProduct.id)
    : comparisonProducts;
  const allProducts = mainProduct ? [mainProduct, ...filteredComparisonProducts] : [...filteredComparisonProducts];
  const mainProductPrice = mainProduct?.priceHistory.slice(-1)[0]?.price;

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

  const renderPriceDifference = (competitorPrice: number) => {
    if (typeof mainProductPrice !== 'number') return null;

    const difference = competitorPrice - mainProductPrice;
    const isPositive = difference > 0;
    const isNegative = difference < 0;

    return (
      <span
        className={cn(
          'text-xs ml-2',
          isPositive && 'text-red-600',
          isNegative && 'text-green-600'
        )}
      >
        ({isPositive ? '+' : ''}{difference.toFixed(2)})
      </span>
    );
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ru });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="relative w-full overflow-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[150px] font-semibold sticky left-0 z-20 bg-muted/50">Атрибут</TableHead>
            {allProducts.map((product, index) => {
               const manager = product.managerId ? allManagers.find(m => m.id === product.managerId) : null;
               const availableManagers = allManagers.filter(m => m.shopId === product.shopId);

               return (
                <TableHead 
                  key={product.id} 
                  className={cn(
                    "min-w-[250px]",
                     index === 0 && "sticky left-[150px] z-20 bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded-md" data-ai-hint="product image" />
                    <div className="flex-grow">
                      <SkuInfoModal
                        product={product}
                        manager={manager}
                        availableManagers={availableManagers}
                        onAssignManager={onAssignManager}
                        onUnassignManager={onUnassignManager}
                        onUpdatePrice={onUpdatePrice}
                        onRefreshSku={onRefreshSku}
                        isCompetitor={product.shopId === 'competitor'}
                      >
                        <p className="font-bold hover:underline cursor-pointer">{product.name}</p>
                      </SkuInfoModal>
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
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold sticky left-0 z-10 bg-card">Цена</TableCell>
            {allProducts.map((product, index) => (
              <TableCell key={product.id} className={cn("font-bold text-lg text-primary", index === 0 && "sticky left-[150px] z-10 bg-card")}>
                ${product.priceHistory.slice(-1)[0]?.price.toFixed(2)}
                {index > 0 && renderPriceDifference(product.priceHistory.slice(-1)[0]?.price)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold sticky left-0 z-10 bg-card">Торговая площадка</TableCell>
            {allProducts.map((product, index) => (
              <TableCell key={product.id} className={cn(index === 0 && "sticky left-[150px] z-10 bg-card")}>{product.marketplace}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold sticky left-0 z-10 bg-card">Рейтинг</TableCell>
            {allProducts.map((product, index) => (
              <TableCell key={product.id} className={cn(index === 0 && "sticky left-[150px] z-10 bg-card")}>
                {renderRating(product.rating)}
              </TableCell>
            ))}
          </TableRow>
           <TableRow>
            <TableCell className="font-semibold sticky left-0 z-10 bg-card">Отзывы</TableCell>
            {allProducts.map((product, index) => (
              <TableCell key={product.id} className={cn(index === 0 && "sticky left-[150px] z-10 bg-card")}>{product.reviews.toLocaleString()}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold sticky left-0 z-10 bg-card">Дата обновления</TableCell>
            {allProducts.map((product, index) => {
              const lastUpdate = product.priceHistory.slice(-1)[0]?.date;
              const isRefreshing = refreshingSkuId === product.id;
              return (
                <TableCell key={product.id} className={cn("text-sm", index === 0 && "sticky left-[150px] z-10 bg-card")}>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{lastUpdate ? formatDate(lastUpdate) : 'N/A'}</span>
                    {product.shopId !== 'competitor' && (
                       <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handleRefreshClick(product.id)} disabled={isRefreshing}>
                           {isRefreshing ? (
                             <Loader2 className="h-4 w-4 text-muted-foreground animate-spin"/>
                           ) : (
                             <RefreshCw className="h-4 w-4 text-muted-foreground"/>
                           )}
                          <span className="sr-only">Обновить SKU</span>
                       </Button>
                    )}
                  </div>
                </TableCell>
              )
            })}
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold align-top sticky left-0 z-10 bg-card">Особенности</TableCell>
            {allProducts.map((product, index) => (
              <TableCell key={product.id} className={cn(index === 0 && "sticky left-[150px] z-10 bg-card")}>
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
