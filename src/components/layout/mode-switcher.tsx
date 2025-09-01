'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserMode, useUserMode } from '@/store/user-mode';
import { MapPin, Briefcase } from 'lucide-react';

export function ModeSwitcher() {
  const { mode, switchMode } = useUserMode();

  const handleModeChange = (checked: boolean) => {
    switchMode(checked ? 'guide' : 'traveler');
  };

  return (
    <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-2">
      <div className="flex items-center space-x-2">
        <MapPin className={`w-4 h-4 ${mode === 'traveler' ? 'text-amber-600' : 'text-gray-400'}`} />
        <span className={`text-xs font-medium ${mode === 'traveler' ? 'text-gray-900' : 'text-gray-500'}`}>
          旅客
        </span>
      </div>
      
      <Switch
        checked={mode === 'guide'}
        onCheckedChange={handleModeChange}
        className="data-[state=checked]:bg-amber-500"
      />
      
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${mode === 'guide' ? 'text-gray-900' : 'text-gray-500'}`}>
          地陪
        </span>
        <Briefcase className={`w-4 h-4 ${mode === 'guide' ? 'text-amber-600' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}