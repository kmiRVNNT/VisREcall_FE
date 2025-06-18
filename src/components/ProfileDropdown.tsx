
import React from 'react';
import { User, LogIn, UserPlus, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileDropdown = () => {
  const isLoggedIn = false; // This would come from your auth state

  const handleLogin = () => {
    console.log('Login clicked');
    // In a real app, this would open a login modal or redirect
  };

  const handleSignup = () => {
    console.log('Signup clicked');
    // In a real app, this would open a signup modal or redirect
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    // In a real app, this would navigate to settings page
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // In a real app, this would handle logout
  };

  if (!isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-border hover:bg-secondary">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
          <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignup} className="cursor-pointer">
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-border hover:bg-secondary">
          <User className="h-4 w-4 mr-2" />
          John Doe
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
