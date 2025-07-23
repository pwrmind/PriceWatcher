'use client';

import { useState, useMemo } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SkuSidebar } from '@/components/app/sku-sidebar';
import { PriceHistoryChart } from '@/components/app/price-history-chart';
import { ComparisonTable } from '@/components/app/comparison-table';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(mockProducts[0]?.id || null);
  const [comparisonSkuIds, setComparisonSkuIds] = useState<string[]>([]);

  const handleSelectSku = (id: string) => {
    setSelectedSkuId(id);
    setComparisonSkuIds(ids => ids.filter(compId => compId !== id));
  };

  const handleToggleCompare = (id: string) => {
    setComparisonSkuIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(compId => compId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleAddSku = (id: string) => {
    if (products.some(p => p.id === id)) {
      toast({
        title: "SKU уже отслеживается",
        description: `Продукт с SKU ${id} уже есть в вашем списке.`,
        variant: "default",
      });
      return;
    }
    toast({
      title: "SKU не найден",
      description: `Не удалось найти данные о продукте для SKU ${id}. Это демонстрационное приложение.`,
      variant: "destructive",
    });
  };

  const handleDeleteSku = (id: string) => {
    setProducts(prods => {
      const remainingProducts = prods.filter(p => p.id !== id);
      if (selectedSkuId === id) {
        setSelectedSkuId(remainingProducts[0]?.id || null);
      }
      setComparisonSkuIds(ids => ids.filter(compId => compId !== id));
      return remainingProducts;
    });
  };


  const mainProduct = useMemo(() => products.find(p => p.id === selectedSkuId), [products, selectedSkuId]);
  const comparisonProducts = useMemo(() => products.filter(p => comparisonSkuIds.includes(p.id)), [products, comparisonSkuIds]);

  return (
    <SidebarProvider>
      <SkuSidebar
        products={products}
        selectedSkuId={selectedSkuId}
        comparisonSkuIds={comparisonSkuIds}
        onSelectSku={handleSelectSku}
        onToggleCompare={handleToggleCompare}
        onAddSku={handleAddSku}
        onDeleteSku={handleDeleteSku}
      />
      <SidebarInset>
        <main className="flex flex-col gap-8 p-4 md:p-8">
            <PriceHistoryChart mainProduct={mainProduct} comparisonProducts={comparisonProducts} />
            <ComparisonTable mainProduct={mainProduct} comparisonProducts={comparisonProducts} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
