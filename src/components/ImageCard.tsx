import React, { useState } from 'react';
import { Heart, Download, Eye, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ImageCardProps {
  id: string;
  src: string;
  alt: string;
  tags: string[];
  description: string;
  dateAdded: string;
  liked?: boolean;
  onClick?: () => void;
}

const ImageCard = ({
  id,
  src,
  alt,
  tags,
  description,
  dateAdded,
  liked = false,
  onClick,
}: ImageCardProps) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 animate-scale-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={src}
          alt={alt}
          onClick={onClick}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
        />

        <div className={`absolute inset-0 image-hover-overlay pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />

        <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <a href={src} download target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={e => e.stopPropagation()}
            >
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-secondary hover:bg-accent cursor-pointer transition-colors"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 4} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
