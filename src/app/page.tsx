'use client';

import { useState, useMemo } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SkuSidebar } from '@/components/app/sku-sidebar';
import { PriceHistoryChart } from '@/components/app/price-history-chart';
import { ComparisonSection } from '@/components/app/comparison-section';
import { RecommendedActions } from '@/components/app/recommended-actions';
import { allAvailableProducts as allAvailableProductsData, managedProducts as managedProductsData, managers } from '@/lib/mock-data';
import type { Product, Manager } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  const allAvailableProducts = useMemo(() => allAvailableProductsData, []);
  
  const [trackedSkus, setTrackedSkus] = useState<Product[]>(managedProductsData);
  const [selectedManagerId, setSelectedManagerId] = useState<string>(managers[0].id);
  
  const managedProducts = useMemo(() => trackedSkus.filter(p => p.managerId === selectedManagerId), [trackedSkus, selectedManagerId]);
  
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(managedProducts[0]?.id || null);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  const handleSelectSku = (id: string) => {
    setSelectedSkuId(id);
  };
  
  const handleManagerChange = (managerId: string) => {
    setSelectedManagerId(managerId);
    const newManagerProducts = trackedSkus.filter(p => p.managerId === managerId);
    setSelectedSkuId(newManagerProducts[0]?.id || null);
  };

  const handleAddTrackedSku = (id: string) => {
    if (trackedSkus.some(p => p.id === id)) {
      toast({
        title: "SKU уже отслеживается",
        description: `Продукт с SKU ${id} уже есть в вашем списке.`,
        variant: "default",
      });
      return;
    }
    
    const productToAdd = allAvailableProducts.find(p => p.id === id);

    if (productToAdd) {
        if (productToAdd.managerId !== selectedManagerId) {
             toast({
                title: "Неверный менеджер",
                description: `Этот SKU принадлежит другому менеджеру.`,
                variant: "destructive",
            });
            return;
        }
        setTrackedSkus(prev => [...prev, productToAdd]);
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

  const handleDeleteTrackedSku = (id: string) => {
    setTrackedSkus(prods => {
      const remainingProducts = prods.filter(p => p.id !== id);
      if (selectedSkuId === id) {
        const remainingManaged = remainingProducts.filter(p => p.managerId === selectedManagerId);
        setSelectedSkuId(remainingManaged[0]?.id || null);
      }
      return remainingProducts;
    });
    // Also remove from comparison if it's there
    setComparisonProducts(comps => comps.filter(c => c.id !== id));
  };
  
  const handleAddComparisonSku = (id: string) => {
    const mainProduct = trackedSkus.find(p => p.id === selectedSkuId);
    if (mainProduct?.id === id) {
        toast({
            title: "SKU уже выбран",
            description: "Этот продукт уже выбран как основной для сравнения.",
            variant: "default",
        });
        return;
    }

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

  const mainProduct = useMemo(() => trackedSkus.find(p => p.id === selectedSkuId), [trackedSkus, selectedSkuId]);

  return (
    <SidebarProvider>
      <SkuSidebar
        products={managedProducts}
        managers={managers}
        selectedManagerId={selectedManagerId}
        onManagerChange={handleManagerChange}
        selectedSkuId={selectedSkuId}
        onSelectSku={handleSelectSku}
        onAddSku={handleAddTrackedSku}
        onDeleteSku={handleDeleteTrackedSku}
      />
      <SidebarInset>
        <main className="flex flex-col gap-8 p-4 md:p-8">
            <PriceHistoryChart mainProduct={mainProduct} comparisonProducts={comparisonProducts} />
            {mainProduct && <RecommendedActions mainProduct={mainProduct} comparisonProducts={comparisonProducts} />}
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
