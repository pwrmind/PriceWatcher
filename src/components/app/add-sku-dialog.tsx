
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
import { Search } from 'lucide-react';

interface AddSkuDialogProps {
  children: React.ReactNode;
  onAddSku: (sku: string) => void;
}

export function AddSkuDialog({ children, onAddSku }: AddSkuDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sku = formData.get('sku') as string;
    if (sku) {
      onAddSku(sku.trim());
      setOpen(false); // Close dialog on submit
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить SKU для отслеживания</DialogTitle>
          <DialogDescription>
            Введите SKU продукта, который вы хотите добавить в свой список отслеживания.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                    SKU
                    </Label>
                    <div className="col-span-3 relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="sku" name="sku" placeholder="Введите SKU..." className="pl-9" autoFocus />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Добавить SKU</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
