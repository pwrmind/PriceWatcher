'use client';

import { Plus, Search, Trash2, CheckSquare, Square } from 'lucide-react';
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
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

interface SkuSidebarProps {
  products: Product[];
  selectedSkuId: string | null;
  comparisonSkuIds: string[];
  onSelectSku: (id: string) => void;
  onToggleCompare: (id:string) => void;
  onAddSku: (id: string) => void;
  onDeleteSku: (id: string) => void;
}

export function SkuSidebar({
  products,
  selectedSkuId,
  comparisonSkuIds,
  onSelectSku,
  onToggleCompare,
  onAddSku,
  onDeleteSku
}: SkuSidebarProps) {

  const handleAddSku = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sku = formData.get('sku') as string;
    if (sku) {
      onAddSku(sku.trim());
      event.currentTarget.reset();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-semibold px-2">MarketWatch</h2>
        <form onSubmit={handleAddSku} className="relative px-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input name="sku" placeholder="Track new SKU..." className="pl-8 bg-background" />
        </form>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-0">
        <SidebarMenu className="p-2">
          {products.map((product) => (
            <SidebarMenuItem key={product.id} 
              className={cn(
                "rounded-lg transition-colors cursor-pointer hover:bg-sidebar-accent",
                selectedSkuId === product.id && 'bg-sidebar-accent ring-2 ring-primary'
              )}
              onClick={() => onSelectSku(product.id)}
            >
              <div className="flex items-center w-full gap-3 p-2">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md shrink-0"
                  data-ai-hint="product image"
                />
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold truncate text-sm">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{product.id}</p>
                    <PricePrediction sku={product.id} priceHistory={product.priceHistory} />
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7" 
                                onClick={(e) => { e.stopPropagation(); onToggleCompare(product.id)}} 
                                disabled={product.id === selectedSkuId}
                                aria-label={comparisonSkuIds.includes(product.id) ? "Remove from comparison" : "Add to comparison"}
                            >
                                {comparisonSkuIds.includes(product.id) ? <CheckSquare className="h-4 w-4 text-primary"/> : <Square className="h-4 w-4"/>}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{comparisonSkuIds.includes(product.id) ? "Remove from comparison" : "Add to comparison"}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => {e.stopPropagation(); onDeleteSku(product.id);}} aria-label="Delete SKU">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete SKU</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator/>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground text-center">
            &copy; 2024 MarketWatch
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
