
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Star, UserPlus } from 'lucide-react';
import type { Product, Manager } from '@/lib/types';
import { AssignManagerDialog } from './assign-manager-dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


interface SkuInfoCardProps {
  product: Product | undefined;
  manager: Manager | null | undefined;
  availableManagers: Manager[];
  onAssignManager: (skuId: string, managerId: string) => void;
  onUnassignManager: (skuId: string) => void;
}

export function SkuInfoCard({ product, manager, availableManagers, onAssignManager, onUnassignManager }: SkuInfoCardProps) {
  if (!product) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Информация о продукте</CardTitle>
          <CardDescription>Выберите продукт для просмотра деталей.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[245px] w-full flex items-center justify-center bg-muted/10 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Продукт не выбран</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const renderRating = (rating: number, reviews: number) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <span className="font-bold text-lg">{rating.toFixed(1)}</span>
      </div>
      <span className="text-sm text-muted-foreground">({reviews.toLocaleString()} отзывов)</span>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle>{product.name}</CardTitle>
                 <CardDescription>SKU: {product.id}</CardDescription>
                 <CardDescription className="flex items-center gap-1 mt-1">
                    <Building className="w-4 h-4"/>
                    {product.marketplace}
                 </CardDescription>
            </div>
            <AssignManagerDialog
              managers={availableManagers}
              currentManagerId={product.managerId}
              onAssignManager={(managerId) => onAssignManager(product.id, managerId)}
              onUnassignManager={() => onUnassignManager(product.id)}
            >
                {manager ? (
                   <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10">
                      <Avatar className="w-8 h-8">
                          <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                          <AvatarFallback>{manager.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Изменить менеджера</span>
                  </Button>
                ) : (
                  <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
                      <UserPlus className="h-5 w-5"/>
                      <span className="sr-only">Назначить менеджера</span>
                  </Button>
                )}
          </AssignManagerDialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div className="flex items-center justify-center">
            <Image 
                src={product.imageUrl} 
                alt={product.name} 
                width={150} 
                height={150} 
                className="rounded-lg"
                data-ai-hint="product image"
            />
        </div>
        <div>
            {renderRating(product.rating, product.reviews)}
        </div>
         <div>
            <h4 className="font-semibold mb-2">Ключевые особенности:</h4>
            <div className="flex flex-wrap gap-2">
                {product.features.map((feature) => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                ))}
            </div>
        </div>
      </CardContent>
       {manager && (
        <CardFooter className="border-t pt-4">
            <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={manager.avatarUrl} alt={manager.name} />
                    <AvatarFallback>{manager.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Менеджер</p>
                    <p className="font-semibold">{manager.name}</p>
                </div>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
