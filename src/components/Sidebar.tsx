import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Home, Plus, User, Settings, MapPin } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const navigate = useNavigate();

  if (!sidebarOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform md:hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">eK</span>
              </div>
              <h2 className="text-lg font-bold">eKasi Rentals</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/'); toggleSidebar(); }}>
              <Home className="h-4 w-4 mr-3" />
              Browse Listings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/map'); toggleSidebar(); }}>
              <MapPin className="h-4 w-4 mr-3" />
              Map View
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/create'); toggleSidebar(); }}>
              <Plus className="h-4 w-4 mr-3" />
              Post Listing
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/auth'); toggleSidebar(); }}>
              <User className="h-4 w-4 mr-3" />
              My Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;