
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface PinterestConnectionProps {
  onConnect?: () => void;
}

const PinterestConnection = ({ onConnect }: PinterestConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [boardCount, setBoardCount] = useState(0);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Mock OAuth flow - in real implementation this would open Pinterest OAuth
    console.log('Initiating Pinterest OAuth flow...');
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setBoardCount(12); // Mock board count
      onConnect?.();
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setBoardCount(0);
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3 p-4 border border-green-500/20 bg-green-500/10 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Pinterest Connected</span>
            <Badge variant="secondary" className="text-xs">
              {boardCount} boards indexed
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Your Pinterest boards are now searchable in VisRecall
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          Connect Pinterest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Connect Your Pinterest Account
          </DialogTitle>
          <DialogDescription>
            Access your saved Pinterest boards and pins directly within VisRecall. 
            We'll never modify your boards - only read access for search.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg bg-card/50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              What you get:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Search all your saved pins with natural language</li>
              <li>• Access boards across all your devices</li>
              <li>• No need to re-upload or organize</li>
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
              <li>• We never see your Pinterest password</li>
              <li>• You can revoke access anytime</li>
              <li>• Images stay on Pinterest - we just index them</li>
            </ul>
          </div>

          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Pinterest'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By connecting, you'll be redirected to Pinterest to authorize VisRecall
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinterestConnection;
