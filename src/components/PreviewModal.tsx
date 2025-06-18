import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

interface PreviewModalProps {
  image: {
    src: string;
    alt: string;
  };
  onClose: () => void;
}

const PreviewModal = ({ image, onClose }: PreviewModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background">
        <div className="relative">
          <DialogClose asChild>
            <button
              className="absolute top-2 right-2 bg-background/80 hover:bg-background p-2 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto max-h-[90vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
