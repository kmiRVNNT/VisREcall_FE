import React from 'react';

interface Props {
  image: any;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<Props> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="relative">
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
        />
        {image.description && (
          <p className="mt-4 text-white text-sm text-center max-w-md mx-auto">
            {image.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
