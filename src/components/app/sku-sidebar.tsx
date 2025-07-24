
'use client';

import { Search, Building, Users, Globe, Plus, UserPlus } from 'lucide-react';
import Image from 'next/image';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PricePrediction } from './price-prediction';
import type { Product, Manager, Shop } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './theme-toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AddSkuDialog } from './add-sku-dialog';
import { AssignManagerDialog } from './assign-manager-dialog';


interface SkuSidebarProps {
  products: Product[];
  shops: Shop[];
  selectedShopId: string;
  onShopChange: (id: string) => void;
  managers: Manager[];
  selectedManagerId: string;
  onManagerChange: (id: string) => void;
  selectedSkuId: string | null;
  onSelectSku: (id: string) => void;
  onAddSku: (id: string) => void;
  onDeleteSku: (id: string) => void;
  onAssignManager: (skuId: string, managerId: string) => void;
  onUnassignManager: (skuId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SkuSidebar({
  products,
  shops,
  selectedShopId,
  onShopChange,
  managers,
  selectedManagerId,
  onManagerChange,
  selectedSkuId,
  onSelectSku,
  onAddSku,
  onDeleteSku,
  onAssignManager,
  onUnassignManager,
  searchTerm,
  onSearchChange,
}: SkuSidebarProps) {
  
  const selectedManager = managers.find(m => m.id === selectedManagerId);
  const selectedShop = shops.find(s => s.id === selectedShopId);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='px-2 space-y-2'>
            <Select value={selectedShopId} onValueChange={onShopChange}>
                <SelectTrigger className="w-full">
                    <SelectValue>
                        <div className="flex items-center gap-2">
                           {selectedShop ? (
                              <>
                                <Building className="w-5 h-5" />
                                <span>{selectedShop.name}</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-5 h-5" />
                                <span>Все магазины</span>
                              </>
                            )}
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            <span>Все магазины</span>
                        </div>
                    </SelectItem>
                    {shops.map(shop => (
                        <SelectItem key={shop.id} value={shop.id}>
                            <div className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                <span>{shop.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedManagerId} onValueChange={onManagerChange}>
              <SelectTrigger className="w-full">
                <SelectValue>
                    <div className="flex items-center gap-2">
                         {selectedManager ? (
                            <>
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={selectedManager?.avatarUrl} alt={selectedManager?.name} />
                                    <AvatarFallback>{selectedManager?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{selectedManager?.name}</span>
                            </>
                         ) : (
                            <>
                                <Users className="w-5 h-5" />
                                <span>Все менеджеры</span>
                            </>
                         )}
                    </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>Все менеджеры</span>
                    </div>
                </SelectItem>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                            <AvatarFallback>{manager.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{manager.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Поиск по названию SKU..." 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
        <div className="px-2 mt-2">
          <AddSkuDialog onAddSku={onAddSku}>
              <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4"/>
                  Добавить SKU
              </Button>
          </AddSkuDialog>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-0">
        <SidebarMenu className="p-2">
          {products.map((product) => {
            const manager = managers.find(m => m.id === product.managerId);
            const shop = shops.find(s => s.id === product.shopId);
            const managersForProductShop = managers.filter(m => m.shopId === product.shopId);

            return (
                <SidebarMenuItem key={product.id} 
                className={cn(
                    "rounded-lg transition-colors cursor-pointer hover:bg-sidebar-accent h-auto",
                    selectedSkuId === product.id && 'bg-sidebar-accent ring-2 ring-primary'
                )}
                onClick={() => onSelectSku(product.id)}
                >
                <div className="flex items-center w-full gap-3 p-2">
                    <div className="relative shrink-0">
                        <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                        data-ai-hint="product image"
                        />
                         {product.notifications > 0 && (
                            <Badge variant="destructive" className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {product.notifications}
                            </Badge>
                         )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate text-sm">{product.name}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{product.id}</p>
                        <PricePrediction sku={product.id} priceHistory={product.priceHistory} />
                    </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <AssignManagerDialog
                            managers={managersForProductShop}
                            currentManagerId={product.managerId}
                            onAssignManager={(managerId) => onAssignManager(product.id, managerId)}
                            onUnassignManager={() => onUnassignManager(product.id)}
                        >
                            {manager ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className="w-7 h-7 cursor-pointer ring-1 ring-transparent hover:ring-primary transition-shadow">
                                            <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                                            <AvatarFallback>{manager.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Менеджер: {manager.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                            <UserPlus className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Назначить менеджера</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </AssignManagerDialog>
                       
                         <Tooltip>
                            <TooltipTrigger asChild>
                                 <Avatar className="w-7 h-7">
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        {shop ? shop.name.charAt(0) : '?'}
                                    </AvatarFallback>
                                 </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{shop?.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <Separator/>
      <SidebarFooter className="flex-row items-center justify-between px-2">
        <p className="text-xs text-muted-foreground text-center">
            &copy; 2024 MarketWatch
        </p>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
