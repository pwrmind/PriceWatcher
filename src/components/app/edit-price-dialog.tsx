
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditPriceDialogProps {
  children: React.ReactNode;
  currentPrice: number;
  onUpdatePrice: (newPrice: number) => void;
}

export function EditPriceDialog({ children, currentPrice, onUpdatePrice }: EditPriceDialogProps) {
  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState(currentPrice.toString());
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const priceValue = parseFloat(newPrice);
    if (!isNaN(priceValue) && priceValue > 0) {
      onUpdatePrice(priceValue);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить текущую цену</DialogTitle>
          <DialogDescription>
            Введите новую цену для этого продукта. Изменение отразится в истории цен.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                    Цена ($)
                    </Label>
                    <Input 
                        id="price" 
                        name="price" 
                        type="number"
                        step="0.01"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="col-span-3"
                        autoFocus
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
                <Button type="submit">Сохранить цену</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
