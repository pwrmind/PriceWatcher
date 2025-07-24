
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ComparisonTable } from './comparison-table';
import type { Product } from '@/lib/types';


interface ComparisonSectionProps {
  mainProduct: Product | undefined;
  comparisonProducts: Product[];
  onAddComparisonSku: (id: string) => void;
  onRemoveComparisonSku: (id: string) => void;
}

export function ComparisonSection({ mainProduct, comparisonProducts, onAddComparisonSku, onRemoveComparisonSku }: ComparisonSectionProps) {
  
  const handleAddSku = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sku = formData.get('sku') as string;
    if (sku) {
      onAddComparisonSku(sku.trim());
      event.currentTarget.reset();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Сравнение продуктов</CardTitle>
                <CardDescription>Сравните свой продукт с продуктами конкурентов.</CardDescription>
            </div>
            <form onSubmit={handleAddSku} className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="sku" placeholder="SKU для сравнения..." className="pl-9" />
            </form>
        </div>
      </CardHeader>
      <CardContent>
        <ComparisonTable 
            mainProduct={mainProduct} 
            comparisonProducts={comparisonProducts} 
            onRemoveComparisonSku={onRemoveComparisonSku}
        />
      </CardContent>
    </Card>
  );
}
