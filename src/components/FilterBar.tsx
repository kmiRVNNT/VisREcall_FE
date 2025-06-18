
import React from 'react';
import { Filter, Calendar, Palette, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  totalImages: number;
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const FilterBar = ({ totalImages, activeFilters, onFilterChange }: FilterBarProps) => {
  const filterOptions = [
    { id: 'recent', label: 'Recent', icon: Calendar },
    { id: 'portraits', label: 'Portraits', icon: Image },
    { id: 'landscapes', label: 'Landscapes', icon: Image },
    { id: 'colorful', label: 'Colorful', icon: Palette },
    { id: 'monochrome', label: 'Monochrome', icon: Palette },
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{totalImages} images</span>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            {activeFilters.map(filter => (
              <Badge 
                key={filter} 
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => toggleFilter(filter)}
              >
                {filterOptions.find(f => f.id === filter)?.label} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeFilters.includes(id) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter(id)}
            className="text-sm"
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
