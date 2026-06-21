import React from 'react';
import { useCMS } from '../CMSContext';
import { loginWithGoogle, logout } from '../firebase';
import { LayoutDashboard, LogOut, Gem, Globe } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { settings, isAdminMode, setIsAdminMode, currentUser, isAdminPath, hasPinUnlocked } = useCMS();

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      // Clear admin path/hash to navigate to normal homepage
      window.location.hash = '';
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new Event('hashchange'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      setIsAdminMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Google Sign-in failed or cancelled. Proceeding in passcode-only mode.');
      setIsAdminMode(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem('ruby_admin_unlocked');
      setIsAdminMode(false);
      // Redirect to home root
      window.location.hash = '';
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new Event('hashchange'));
    } catch (err) {
      console.error(err);
    }
  };

  // Choose font family based on CMS settings
  const getFontClass = () => {
    switch (settings.fontStyle) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/85 border-b border-white/5 backdrop-blur-md h-20 flex items-center">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand Title */}
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => { 
            setIsAdminMode(false); 
            window.location.hash = '';
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('hashchange'));
            onNavigate('hero'); 
          }}
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${settings.accentColor}dd, #12052b)` 
            }}
          >
            <Gem className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span 
              className={`text-lg font-bold tracking-wider text-white ${getFontClass()}`}
            >
              {settings.title || '루비솔루션'}
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
              {settings.subtitle || 'RUBY SOLUTION'}
            </span>
          </div>
        </div>

        {/* Real-time CMS Admin Control Widgets */}
        {isAdminPath && hasPinUnlocked && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAdminToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isAdminMode 
                  ? 'bg-white text-black hover:bg-gray-100' 
                  : 'text-white border border-white/10 hover:border-white/30 hover:bg-white/5'
              }`}
              style={isAdminMode ? {} : { 
                boxShadow: `0 0 10px ${settings.accentColor}1A`
              }}
            >
              {isAdminMode ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>홈페이지로 가기</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" style={{ color: settings.accentColor }} />
                  <span>CMS 관리자 모드</span>
                </>
              )}
            </button>

            {currentUser && (
              <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src={currentUser.photoURL || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=50&h=50&fit=crop"} 
                    alt="Admin" 
                    className="w-7 h-7 rounded-full border border-white/20"
                  />
                  <span className="text-xs text-gray-300 font-medium hidden sm:inline-block">
                    {currentUser.displayName || '관리자'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
