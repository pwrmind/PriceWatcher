
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
import { UserPlus } from 'lucide-react';

interface AddManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopId: string;
  onAddNewManager: (name: string, shopId: string) => void;
}

export function AddManagerDialog({ open, onOpenChange, shopId, onAddNewManager }: AddManagerDialogProps) {
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    if (name) {
      onAddNewManager(name.trim(), shopId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить нового менеджера</DialogTitle>
          <DialogDescription>
            Введите имя нового менеджера. Он будет автоматически привязан к текущему выбранному магазину.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Имя
                    </Label>
                    <div className="col-span-3 relative">
                         <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" name="name" placeholder="Введите имя..." className="pl-9" autoFocus />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
                <Button type="submit">Добавить менеджера</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
