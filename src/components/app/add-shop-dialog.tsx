
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from 'lucide-react';

interface AddShopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNewShop: (name: string) => void;
}

export function AddShopDialog({ open, onOpenChange, onAddNewShop }: AddShopDialogProps) {
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    if (name) {
      onAddNewShop(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новый магазин</DialogTitle>
          <DialogDescription>
            Введите название нового магазина или филиала.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Название
                    </Label>
                    <div className="col-span-3 relative">
                         <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" name="name" placeholder="Введите название..." className="pl-9" autoFocus />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
                <Button type="submit">Добавить магазин</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
