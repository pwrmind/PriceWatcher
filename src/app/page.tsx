'use client';

import { useState, useMemo, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SkuSidebar } from '@/components/app/sku-sidebar';
import { PriceHistoryChart } from '@/components/app/price-history-chart';
import { ComparisonSection } from '@/components/app/comparison-section';
import { RecommendedActions } from '@/components/app/recommended-actions';
import { allAvailableProducts as allAvailableProductsData, managedProducts as managedProductsData, allManagers as allManagersData, allShops as allShopsData } from '@/lib/mock-data';
import type { Product, Manager, Shop } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { PositionHistoryChart } from '@/components/app/position-history-chart';
import { refreshSkuData } from './actions';

export default function Home() {
  const { toast } = useToast();

  const allAvailableProducts = useMemo(() => allAvailableProductsData, []);
  
  const [trackedSkus, setTrackedSkus] = useState<Product[]>(managedProductsData);
  const [shops, setShops] = useState<Shop[]>(allShopsData);
  const [allManagers, setAllManagers] = useState<Manager[]>(allManagersData);

  const [selectedShopId, setSelectedShopId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const managersForSelectedShop = useMemo(() => {
    if (selectedShopId === 'all') {
      return allManagers;
    }
    return allManagers.filter(m => m.shopId === selectedShopId)
  }, [selectedShopId, allManagers]);
  
  const [selectedManagerId, setSelectedManagerId] = useState<string>('all');
  
  const productsForSelectedShop = useMemo(() => {
    if (selectedShopId === 'all') {
      return trackedSkus;
    }
    return trackedSkus.filter(p => p.shopId === selectedShopId)
  }, [trackedSkus, selectedShopId]);
  
  const managedProducts = useMemo(() => {
    let baseProducts = productsForSelectedShop;
    if (selectedManagerId !== 'all') {
      baseProducts = baseProducts.filter(p => p.managerId === selectedManagerId)
    }
    if (searchTerm) {
      baseProducts = baseProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return baseProducts;
  }, [productsForSelectedShop, selectedManagerId, searchTerm]);
  
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(managedProducts[0]?.id || null);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  const mainProduct = useMemo(() => trackedSkus.find(p => p.id === selectedSkuId), [trackedSkus, selectedSkuId]);

  useEffect(() => {
    if (mainProduct) {
      const competitorIds = mainProduct.competitorSkus || [];
      const competitors = allAvailableProducts.filter(p => competitorIds.includes(p.id));
      setComparisonProducts(competitors);
    } else {
      setComparisonProducts([]);
    }
  }, [mainProduct, allAvailableProducts]);

  const handleShopChange = (shopId: string) => {
    setSelectedShopId(shopId);
    setSelectedManagerId('all');

    const newShopProducts = shopId !== 'all' ? trackedSkus.filter(p => p.shopId === shopId) : trackedSkus;
    setSelectedSkuId(newShopProducts[0]?.id || null);
  };

  const handleSelectSku = (id: string) => {
    setSelectedSkuId(id);
  };
  
  const handleManagerChange = (managerId: string) => {
    setSelectedManagerId(managerId);
    const baseProducts = selectedShopId !== 'all' ? trackedSkus.filter(p => p.shopId === selectedShopId) : trackedSkus;
    const newManagerProducts = managerId !== 'all' ? baseProducts.filter(p => p.managerId === managerId) : baseProducts;
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
        if (selectedShopId !== 'all' && productToAdd.shopId !== selectedShopId) {
             toast({
                title: "Неверный магазин",
                description: `Этот SKU принадлежит другому магазину.`,
                variant: "destructive",
            });
            return;
        }
        if (selectedManagerId !== 'all' && productToAdd.managerId !== selectedManagerId) {
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
        let remainingManaged = selectedShopId !== 'all' ? remainingProducts.filter(p => p.shopId === selectedShopId) : remainingProducts;
        if (selectedManagerId !== 'all') {
          remainingManaged = remainingManaged.filter(p => p.managerId === selectedManagerId);
        }
        setSelectedSkuId(remainingManaged[0]?.id || null);
      }
      return remainingProducts;
    });
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
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleAssignManager = (skuId: string, managerId: string) => {
    setTrackedSkus(prev => prev.map(p => p.id === skuId ? { ...p, managerId } : p));
    toast({
        title: "Менеджер назначен",
        description: `Новый менеджер был успешно назначен на SKU ${skuId}.`,
        variant: "default",
    });
  };

  const handleUnassignManager = (skuId: string) => {
    setTrackedSkus(prev => prev.map(p => p.id === skuId ? { ...p, managerId: null } : p));
    toast({
      title: 'Менеджер отвязан',
      description: `Менеджер был успешно отвязан от SKU ${skuId}.`,
      variant: 'default',
    });
  };
  
  const handleUpdatePrice = (skuId: string, newPrice: number) => {
    setTrackedSkus(prev => 
      prev.map(p => {
        if (p.id === skuId) {
          const newPriceHistory = [...p.priceHistory];
          const today = new Date().toISOString().split('T')[0];
          const lastEntry = newPriceHistory[newPriceHistory.length - 1];

          if (lastEntry.date === today) {
            lastEntry.price = newPrice;
          } else {
            newPriceHistory.push({ date: today, price: newPrice });
          }
          
          return { ...p, priceHistory: newPriceHistory, currentPrice: newPrice };
        }
        return p;
      })
    );
     toast({
        title: "Цена обновлена",
        description: `Новая цена для SKU ${skuId} установлена в размере $${newPrice.toFixed(2)}.`,
        variant: "default",
    });
  };

  const handleAddNewShop = (name: string) => {
    const newShop: Shop = {
        id: `shop-${Date.now()}`,
        name: name,
    };
    setShops(prev => [...prev, newShop]);
    setSelectedShopId(newShop.id);
    toast({
        title: "Магазин добавлен",
        description: `Магазин "${name}" был успешно создан.`,
        variant: "default",
    });
  };

  const handleAddNewManager = (name: string, shopId: string) => {
      const newManager: Manager = {
          id: `manager-${Date.now()}`,
          name: name,
          shopId: shopId,
          avatarUrl: 'https://placehold.co/40x40.png',
      };
      setAllManagers(prev => [...prev, newManager]);
      setSelectedManagerId(newManager.id);
      toast({
          title: "Менеджер добавлен",
          description: `Менеджер "${name}" был успешно добавлен в магазин.`,
          variant: "default",
      });
  };

  const handleRefreshSku = async (skuId: string) => {
    const result = await refreshSkuData(skuId);
    if ('error' in result) {
        toast({
            title: "Ошибка обновления",
            description: result.error,
            variant: "destructive",
        });
        return;
    }
    
    setTrackedSkus(prev => 
      prev.map(p => {
        if (p.id === skuId) {
          const newPriceHistory = [...p.priceHistory, result.price];
          const newPositionHistory = [...p.positionHistory, result.position];
          return { 
            ...p, 
            priceHistory: newPriceHistory,
            positionHistory: newPositionHistory,
            currentPrice: result.price.price 
          };
        }
        return p;
      })
    );

    toast({
        title: "Данные обновлены",
        description: `Свежие данные для SKU ${skuId} были успешно загружены.`,
        variant: "default",
    });
  };

  return (
    <SidebarProvider>
      <SkuSidebar
        products={managedProducts}
        shops={shops}
        selectedShopId={selectedShopId}
        onShopChange={handleShopChange}
        onAddNewShop={handleAddNewShop}
        managers={managersForSelectedShop}
        selectedManagerId={selectedManagerId}
        onManagerChange={handleManagerChange}
        onAddNewManager={handleAddNewManager}
        selectedSkuId={selectedSkuId}
        onSelectSku={handleSelectSku}
        onAddSku={handleAddTrackedSku}
        onDeleteSku={handleDeleteTrackedSku}
        onAssignManager={handleAssignManager}
        onUnassignManager={handleUnassignManager}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <SidebarInset>
        <main className="flex flex-col gap-8 p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PriceHistoryChart 
                  mainProduct={mainProduct} 
                  comparisonProducts={comparisonProducts}
                />
                <PositionHistoryChart 
                  mainProduct={mainProduct}
                  comparisonProducts={comparisonProducts}
                />
            </div>
            <ComparisonSection 
              mainProduct={mainProduct} 
              comparisonProducts={comparisonProducts}
              allManagers={allManagers}
              onAddComparisonSku={handleAddComparisonSku}
              onRemoveComparisonSku={handleRemoveComparisonSku}
              onAssignManager={handleAssignManager}
              onUnassignManager={handleUnassignManager}
              onUpdatePrice={handleUpdatePrice}
              onRefreshSku={handleRefreshSku}
            />
            {mainProduct && (
              <RecommendedActions 
                mainProduct={mainProduct} 
                comparisonProducts={comparisonProducts} 
              />
            )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
