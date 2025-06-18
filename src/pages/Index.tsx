import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ImageGallery from '@/components/ImageGallery';
import FilterBar from '@/components/FilterBar';
import ConnectReferences from '@/components/ConnectReferences';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import ProfileDropdown from '@/components/ProfileDropdown';
import UploadModal from '@/components/UploadModal';
import axios from 'axios';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [filteredImages, setFilteredImages] = useState<any[]>([]); // 
  const [selectedImage, setSelectedImage] = useState<any | null>(null); 
  

  // Hit FastAPI + ChromaDB search endpoint
  const fetchChromaResults = async (query: string, topK: number = 4): Promise<any[]> => {
    try {
      const res = await axios.get('http://localhost:8000/search', {
        params: { query, top_k: topK },
      });

      return res.data.results.map((imgPath: string, idx: number) => ({
        id: `${idx}`,
        src: `http://localhost:8000${imgPath}`,
        alt: `Search result ${idx}`,
        tags: [],
        description: '',
        dateAdded: 'just now',
      }));
    } catch (err) {
      console.error('Error fetching results:', err);
      return [];
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
    const results = await fetchChromaResults(query);
    setFilteredImages(results);
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handlePlatformConnect = (platform: string) => {
    console.log(`${platform} connected - refreshing search index...`);
  };

  const handleImageUpload = (images: any[]) => {
    setUploadedImages(prev => [...prev, ...images]);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {selectedImage && (
  <ImagePreviewModal
    image={selectedImage}
    onClose={() => setSelectedImage(null)}
  />
)}

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <img 
                  src="/lovable-uploads/ea02a446-d4ae-4185-beb0-ba4a7259b60d.png" 
                  alt="VisREcall Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VisREcall</h1>
                <p className="text-xs text-muted-foreground">AI-powered reference search</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ConnectReferences onConnect={handlePlatformConnect} />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Find your perfect reference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Describe what you're looking for in natural language. No more digging through folders or remembering exact filenames.
          </p>

          <SearchBar onSearch={handleSearch} onUpload={handleUpload} />
        </div>

        {hasSearched && (
          <div className="space-y-6">
            <FilterBar
              totalImages={filteredImages.length}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />

            {searchQuery && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing top {filteredImages.length} results for:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">"{searchQuery}"</span>
              </div>
            )}
            <ImageGallery images={filteredImages} searchQuery={searchQuery}
            onImageClick={setSelectedImage}/>
          </div>
        )}

        <footer className="mt-24 pt-12 border-t border-border text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-medium mb-3">The future of reference management</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              VisREcall uses advanced AI to understand your images and make them searchable through natural language. 
              Say goodbye to endless folder organization and hello to instant inspiration discovery.
            </p>
          </div>
        </footer>
      </main>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default Index;
