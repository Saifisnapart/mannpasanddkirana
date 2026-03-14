import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface CartConflictModalProps {
  open: boolean;
  currentVendor: string;
  newVendor: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CartConflictModal({ open, currentVendor, newVendor, onConfirm, onCancel }: CartConflictModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-accent" />
          </div>
          <DialogTitle className="text-center">Switch Vendor?</DialogTitle>
          <DialogDescription className="text-center">
            Your cart has items from <strong>{currentVendor}</strong>. Adding from <strong>{newVendor}</strong> will clear your current cart.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button onClick={onConfirm} className="w-full">Clear Cart & Switch</Button>
          <Button variant="outline" onClick={onCancel} className="w-full">Keep Current Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
