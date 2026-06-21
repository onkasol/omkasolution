import React, { useState, useEffect } from 'react';
import { useCMS } from '../CMSContext';
import { motion } from 'motion/react';
import { Gem, Lock, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

export const AdminPasscode: React.FC = () => {
  const { setHasPinUnlocked, setIsAdminMode, settings } = useCMS();
  const [pin, setPin] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Handle typing passcode
  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setErrorMessage('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage('');
  };

  // Listen to physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;
      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  // Live validation when PIN reaches 6 digits
  useEffect(() => {
    if (pin.length === 6) {
      if (pin === '121212') {
        setIsSuccess(true);
        setErrorMessage('');
        setTimeout(() => {
          sessionStorage.setItem('ruby_admin_unlocked', 'true');
          setHasPinUnlocked(true);
          setIsAdminMode(true);
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);
      } else {
        // Error shake activation
        setErrorCount(prev => prev + 1);
        setErrorMessage('비밀번호(PIN)가 일치하지 않습니다. 다시 입력해 주세요.');
        // Briefly delay clear
        setTimeout(() => {
          setPin('');
        }, 500);
      }
    }
  }, [pin]);

  const handleGoHome = () => {
    // Navigate home by putting empty hash
    window.location.hash = '';
    window.history.pushState(null, '', '/');
    // Force state recheck via fake popstate / hashchange trigger
    window.dispatchEvent(new Event('hashchange'));
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-black flex flex-col items-center justify-center px-4 z-50">
      
      {/* Background radial overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${settings.accentColor} 0%, transparent 70%)`
        }}
      />

      <motion.div 
        key={errorCount}
        initial={{ x: errorCount > 0 ? [-10, 10, -10, 10, 0] : 0, scale: 0.95, opacity: 0 }}
        animate={{ x: 0, scale: 1, opacity: 1 }}
        transition={{ duration: errorCount > 0 ? 0.3 : 0.5 }}
        className="max-w-md w-full bg-zinc-950/80 border border-white/5 backdrop-blur-xl rounded-3xl p-10 text-center relative shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-10"
      >
        
        {/* Safe Back Link */}
        <button 
          onClick={handleGoHome}
          className="absolute left-6 top-6 flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>홈페이지</span>
        </button>

        {/* Dynamic Logo Indicator */}
        <div className="flex justify-center mb-6">
          <motion.div 
            animate={isSuccess ? { scale: [1, 1.2, 1], rotate: 360 } : {}}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
            style={{ 
              background: isSuccess 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : `linear-gradient(135deg, ${settings.accentColor}dd, #180933)` 
            }}
          >
            {isSuccess ? (
              <Check className="w-7 h-7 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-white" />
            )}
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-widest">
          루비솔루션 최고관리자
        </h3>
        <p className="text-xs text-gray-500 font-mono tracking-wider mt-1.5 uppercase">
          Ruby CMS Security Portal
        </p>

        {/* PIN circle values */}
        <div className="flex justify-center space-x-3.5 my-8">
          {[...Array(6)].map((_, idx) => (
            <div 
              key={idx}
              className={`w-4.5 h-4.5 rounded-full border-2 transition-all duration-150 ${
                idx < pin.length 
                  ? isSuccess 
                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : `bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]`
                  : 'border-white/20 bg-transparent'
              }`}
              style={idx < pin.length && !isSuccess ? { 
                backgroundColor: settings.accentColor,
                borderColor: settings.accentColor
              } : {}}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMessage ? (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-rose-400 mb-6 bg-rose-500/10 py-2.5 rounded-xl border border-rose-500/20"
          >
            {errorMessage}
          </motion.p>
        ) : (
          <p className="text-xs text-gray-400 mb-6 font-medium">
            비밀번호 6자리를 입력하여 관리 권한을 인증하세요.
          </p>
        )}

        {/* Numeric PIN buttons */}
        <div className="grid grid-cols-3 gap-3.5 max-w-[280px] mx-auto mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={isSuccess}
              className="aspect-square flex items-center justify-center text-lg font-bold text-white/90 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-2xl active:scale-95 transition-all duration-150 cursor-pointer select-none font-mono"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={isSuccess || pin.length === 0}
            className="aspect-square flex items-center justify-center text-xs font-semibold text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-2xl active:scale-95 transition-all duration-150 cursor-pointer select-none"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            disabled={isSuccess}
            className="aspect-square flex items-center justify-center text-lg font-bold text-white/90 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-2xl active:scale-95 transition-all duration-150 cursor-pointer select-none font-mono"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={isSuccess || pin.length === 0}
            className="aspect-square flex items-center justify-center text-xs font-semibold text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-2xl active:scale-95 transition-all duration-150 cursor-pointer select-none"
          >
            DELETE
          </button>
        </div>

      </motion.div>

      <div className="text-[10px] text-gray-600 font-mono mt-8 flex items-center space-x-1.5 z-10">
        <ShieldCheck className="w-3.5 h-3.5" style={{ color: settings.accentColor }} />
        <span>루비솔루션 하이퍼 세큐리티 인증 모듈 v2.4</span>
      </div>

    </div>
  );
};
