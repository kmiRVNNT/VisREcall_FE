
import React, { useState, useEffect } from 'react';
import { Search, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onUpload: () => void;
}

const SearchBar = ({ onSearch, onUpload }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  // Arrays of words to randomly combine for suggestions
  const adjectives = ['dramatic', 'moody', 'soft', 'vibrant', 'ethereal', 'bold', 'vintage', 'modern', 'abstract', 'realistic'];
  const subjects = ['lighting', 'portrait', 'landscape', 'cityscape', 'forest', 'ocean', 'mountain', 'character', 'architecture', 'nature'];
  const styles = ['photography', 'painting', 'illustration', 'sketch', 'watercolor', 'oil painting', 'digital art', 'concept art', 'line art', 'sculpture'];
  const moods = ['cinematic', 'dreamy', 'mysterious', 'energetic', 'peaceful', 'dynamic', 'romantic', 'futuristic', 'nostalgic', 'surreal'];

  const generateRandomSuggestions = () => {
    const newSuggestions: string[] = [];
    for (let i = 0; i < 5; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const style = styles[Math.floor(Math.random() * styles.length)];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      
      // Create different phrase patterns
      const patterns = [
        `${adj} ${subject} ${style}`,
        `${mood} ${subject}`,
        `${adj} ${style} with ${subject}`,
        `${mood} ${adj} ${subject}`,
        `${subject} in ${adj} style`
      ];
      
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      newSuggestions.push(pattern);
    }
    setSuggestions(newSuggestions);
  };

  useEffect(() => {
    generateRandomSuggestions();
    // Regenerate suggestions every 10 seconds
    const interval = setInterval(generateRandomSuggestions, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Describe what you're looking for... (e.g., 'moody forest lighting' or 'dynamic action poses')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-32 py-6 text-lg bg-card border-border focus:border-primary transition-colors"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button
              type="button"
              onClick={onUpload}
              variant="outline"
              size="sm"
              className="border-border hover:bg-secondary"
            >
              <Camera className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Try:</span>
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion}-${index}`}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
