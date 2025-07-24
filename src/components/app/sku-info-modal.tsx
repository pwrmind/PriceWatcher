
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product, Manager } from '@/lib/types';
import { SkuInfoCard } from './sku-info-card';

interface SkuInfoModalProps {
  children: React.ReactNode;
  product: Product;
  manager: Manager | null | undefined;
  availableManagers: Manager[];
  onAssignManager: (skuId: string, managerId: string) => void;
  onUnassignManager: (skuId: string) => void;
  onUpdatePrice: (skuId: string, newPrice: number) => void;
  isCompetitor: boolean;
}

export function SkuInfoModal({ 
    children, 
    product, 
    manager, 
    availableManagers, 
    onAssignManager, 
    onUnassignManager, 
    onUpdatePrice,
    isCompetitor
}: SkuInfoModalProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-4">
            <SkuInfoCard 
                product={product}
                manager={manager}
                availableManagers={availableManagers}
                onAssignManager={onAssignManager}
                onUnassignManager={onUnassignManager}
                onUpdatePrice={onUpdatePrice}
                isCompetitor={isCompetitor}
            />
        </div>
      </DialogContent>
    </Dialog>
  )
}
