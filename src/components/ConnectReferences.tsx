
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, AlertCircle, Image, Cloud, Camera, Palette } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const platforms: Platform[] = [
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: <Image className="h-4 w-4" />,
    color: 'bg-red-500',
    description: 'Access your saved pins and boards'
  },
  {
    id: 'googledrive',
    name: 'Google Drive',
    icon: <Cloud className="h-4 w-4" />,
    color: 'bg-blue-500',
    description: 'Index images from your Drive folders'
  },
  {
    id: 'flickr',
    name: 'Flickr',
    icon: <Camera className="h-4 w-4" />,
    color: 'bg-pink-500',
    description: 'Search your Flickr photo collections'
  },
  {
    id: 'deviantart',
    name: 'DeviantArt',
    icon: <Palette className="h-4 w-4" />,
    color: 'bg-green-500',
    description: 'Access your favorites and collections'
  }
];

interface ConnectReferencesProps {
  onConnect?: (platform: string) => void;
}

const ConnectReferences = ({ onConnect }: ConnectReferencesProps) => {
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());
  const [connectingPlatforms, setConnectingPlatforms] = useState<Set<string>>(new Set());
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({});

  const handleConnect = async (platformId: string) => {
    setConnectingPlatforms(prev => new Set([...prev, platformId]));
    
    console.log(`Initiating ${platformId} OAuth flow...`);
    
    // Simulate connection delay
    setTimeout(() => {
      setConnectedPlatforms(prev => new Set([...prev, platformId]));
      setConnectingPlatforms(prev => {
        const newSet = new Set(prev);
        newSet.delete(platformId);
        return newSet;
      });
      
      // Mock item counts for different platforms
      const mockCounts = {
        pinterest: 127,
        googledrive: 89,
        flickr: 234,
        deviantart: 56
      };
      
      setPlatformCounts(prev => ({
        ...prev,
        [platformId]: mockCounts[platformId as keyof typeof mockCounts] || 0
      }));
      
      onConnect?.(platformId);
    }, 2000);
  };

  const handleDisconnect = (platformId: string) => {
    setConnectedPlatforms(prev => {
      const newSet = new Set(prev);
      newSet.delete(platformId);
      return newSet;
    });
    setPlatformCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[platformId];
      return newCounts;
    });
  };

  const connectedCount = connectedPlatforms.size;
  const totalImages = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);

  if (connectedCount > 0) {
    return (
      <div className="flex items-center gap-3 p-4 border border-green-500/20 bg-green-500/10 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">References Connected</span>
            <Badge variant="secondary" className="text-xs">
              {connectedCount} platform{connectedCount !== 1 ? 's' : ''} • {totalImages} images
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Your reference libraries are now searchable in VisRecall
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Manage
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Connected Platforms</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {platforms.map(platform => {
                const isConnected = connectedPlatforms.has(platform.id);
                const count = platformCounts[platform.id];
                
                return (
                  <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${platform.color} text-white`}>
                        {platform.icon}
                      </div>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {isConnected ? `${count} images indexed` : platform.description}
                        </div>
                      </div>
                    </div>
                    {isConnected ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleConnect(platform.id)}
                        disabled={connectingPlatforms.has(platform.id)}
                      >
                        {connectingPlatforms.has(platform.id) ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          Connect References
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Connect Your Reference Libraries
          </DialogTitle>
          <DialogDescription>
            Access your saved images from multiple platforms directly within VisRecall. 
            We'll never modify your collections - only read access for search.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            {platforms.map(platform => (
              <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${platform.color} text-white`}>
                    {platform.icon}
                  </div>
                  <div>
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-xs text-muted-foreground">{platform.description}</div>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleConnect(platform.id)}
                  disabled={connectingPlatforms.has(platform.id)}
                >
                  {connectingPlatforms.has(platform.id) ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>

          <div className="p-4 border border-border rounded-lg bg-card/50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              What you get:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Search all your saved references with natural language</li>
              <li>• Access collections across all your devices</li>
              <li>• No need to re-upload or reorganize</li>
              <li>• Artist-specific search terms that understand your workflow</li>
            </ul>
          </div>

          <div className="p-4 border border-amber-500/20 bg-amber-500/10 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Privacy & Security:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Read-only access via secure OAuth 2.0</li>
              <li>• We never see your passwords</li>
              <li>• You can revoke access anytime</li>
              <li>• Images stay on their original platforms</li>
            </ul>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            By connecting, you'll be redirected to each platform to authorize VisRecall
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectReferences;
