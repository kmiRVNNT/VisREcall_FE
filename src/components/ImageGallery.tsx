import React, { useState } from 'react';
import ImageCard from './ImageCard';
import PreviewModal from '@/components/PreviewModal';

interface Image {
  id: string;
  src: string;
  alt: string;
  tags: string[];
  description: string;
  dateAdded: string;
  liked?: boolean;
}

interface ImageGalleryProps {
  images: Image[];
  searchQuery?: string;
  onImageClick?: (image: Image) => void;
}

const ImageGallery = ({ images, searchQuery, onImageClick }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-medium mb-2">No images found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {searchQuery
            ? `No results found for "${searchQuery}". Try a different search term or upload some reference images.`
            : "Upload your first reference image to start building your visual library!"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            {...image}
            onClick={() => onImageClick?.(image)}
          />
        ))}
      </div>

      {selectedImage && (
        <PreviewModal
          image={{ src: selectedImage.src, alt: selectedImage.alt }}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ImageGallery;
