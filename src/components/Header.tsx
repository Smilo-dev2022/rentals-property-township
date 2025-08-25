import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, User, Heart } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

const Header: React.FC = () => {
  const { toggleSidebar } = useAppContext();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">eK</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                {t('appTitle')}
              </h1>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search townships, rooms, flats..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select className="border rounded px-2 py-1 text-sm" value={locale} onChange={(e) => setLocale(e.target.value as any)}>
              <option value="en">EN</option>
              <option value="zu">ZU</option>
              <option value="xh">XH</option>
            </select>
            <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate('/') }>
              <Heart className="h-4 w-4 mr-2" />
              {t('saved')}
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:block">Hi, {user.name}</span>
                <Button variant="outline" size="sm" onClick={() => navigate('/create')}>Post</Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('signIn')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;