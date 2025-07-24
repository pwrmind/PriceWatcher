'use client';

import { useState, useMemo } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SkuSidebar } from '@/components/app/sku-sidebar';
import { PriceHistoryChart } from '@/components/app/price-history-chart';
import { ComparisonSection } from '@/components/app/comparison-section';
import { managedProducts, allAvailableProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [managerProducts, setManagerProducts] = useState<Product[]>(managedProducts);
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(managerProducts[0]?.id || null);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  const handleSelectSku = (id: string) => {
    setSelectedSkuId(id);
  };

  const handleAddManagerSku = (id: string) => {
    if (managerProducts.some(p => p.id === id)) {
      toast({
        title: "SKU уже отслеживается",
        description: `Продукт с SKU ${id} уже есть в вашем списке.`,
        variant: "default",
      });
      return;
    }
    
    const productToAdd = allAvailableProducts.find(p => p.id === id);

    if (productToAdd) {
        setManagerProducts(prev => [...prev, productToAdd]);
         toast({
            title: "SKU добавлен",
            description: `Продукт ${productToAdd.name} добавлен в ваш список.`,
            variant: "default",
        });
    } else {
        toast({
            title: "SKU не найден",
            description: `Не удалось найти данные о продукте для SKU ${id}.`,
            variant: "destructive",
        });
    }
  };

  const handleDeleteManagerSku = (id: string) => {
    setManagerProducts(prods => {
      const remainingProducts = prods.filter(p => p.id !== id);
      if (selectedSkuId === id) {
        setSelectedSkuId(remainingProducts[0]?.id || null);
      }
      return remainingProducts;
    });
    // Also remove from comparison if it's there
    setComparisonProducts(comps => comps.filter(c => c.id !== id));
  };
  
  const handleAddComparisonSku = (id: string) => {
    if (comparisonProducts.some(p => p.id === id)) {
      toast({
        title: "SKU уже в сравнении",
        description: `Продукт с SKU ${id} уже находится в таблице сравнения.`,
        variant: "default",
      });
      return;
    }
    
    const productToCompare = allAvailableProducts.find(p => p.id === id);

    if (productToCompare) {
        setComparisonProducts(prev => [...prev, productToCompare]);
    } else {
        toast({
            title: "SKU не найден",
            description: `Не удалось найти данные о продукте для SKU ${id} для сравнения.`,
            variant: "destructive",
        });
    }
  }

  const handleRemoveComparisonSku = (id: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== id));
  };

  const mainProduct = useMemo(() => managerProducts.find(p => p.id === selectedSkuId), [managerProducts, selectedSkuId]);

  return (
    <SidebarProvider>
      <SkuSidebar
        products={managerProducts}
        selectedSkuId={selectedSkuId}
        onSelectSku={handleSelectSku}
        onAddSku={handleAddManagerSku}
        onDeleteSku={handleDeleteManagerSku}
      />
      <SidebarInset>
        <main className="flex flex-col gap-8 p-4 md:p-8">
            <PriceHistoryChart mainProduct={mainProduct} comparisonProducts={comparisonProducts} />
            <ComparisonSection 
              mainProduct={mainProduct} 
              comparisonProducts={comparisonProducts}
              onAddComparisonSku={handleAddComparisonSku}
              onRemoveComparisonSku={handleRemoveComparisonSku}
            />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
