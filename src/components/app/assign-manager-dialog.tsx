
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Manager } from '@/lib/types';


interface AssignManagerDialogProps {
  children: React.ReactNode;
  managers: Manager[];
  currentManagerId?: string | null;
  onAssignManager: (managerId: string) => void;
}

export function AssignManagerDialog({ children, managers, currentManagerId, onAssignManager }: AssignManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(currentManagerId || (managers.length > 0 ? managers[0].id : ''));
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedManager) {
      onAssignManager(selectedManager);
      setOpen(false);
    }
  };
  
  if (managers.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Назначить менеджера</DialogTitle>
          <DialogDescription>
            Выберите менеджера из списка, чтобы привязать его к этому SKU.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="manager" className="text-right">
                    Менеджер
                    </Label>
                    <Select value={selectedManager} onValueChange={setSelectedManager}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Выберите менеджера..." />
                        </SelectTrigger>
                        <SelectContent>
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
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>
                <Button type="submit">Назначить</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
