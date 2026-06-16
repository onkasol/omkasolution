import React, { useState } from 'react';
import { useCMS } from '../CMSContext';
import { Gem, ArrowDown, Shield, Award, Users } from 'lucide-react';
import { motion } from 'motion/react';
import casinoBgUrl from '../assets/images/casino_background_1781013784535.png';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { settings } = useCMS();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Calculate deviation coordinate (-0.5 to 0.5)
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Create formatted lines supporting \n
  const renderHeroTitle = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <section 
      id="hero" 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center overflow-hidden bg-black text-white px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Immersive Casino Backdrop & Cyber grid */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Interactive Casino Image Backdrop */}
        <motion.div
          className="absolute inset-x-[-4%] inset-y-[-4%] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${casinoBgUrl})`,
          }}
          animate={{
            x: mousePos.x * 20,
            y: mousePos.y * 20,
            scale: 1.03
          }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 22,
            mass: 0.5
          }}
        />
        
        {/* Darkening & Blur filter layer */}
        <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[6px]" />

        {/* Ambient color glow centered to match customized theme */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full filter blur-[130px] lg:blur-[180px] opacity-30 mix-blend-screen transition-all duration-1000"
          style={{ 
            background: `radial-gradient(circle, ${settings.accentColor || '#00a2ff'} 0%, rgba(0,100,255,0.2) 50%, rgba(0,0,0,0) 75%)` 
          }}
        />
        <div 
          className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full filter blur-[120px] opacity-25 mix-blend-screen bg-sky-500/20"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Upper Micro Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm"
        >
          <Gem className="w-3.5 h-3.5" style={{ color: settings.accentColor || '#e11d48' }} />
          <span className="text-xs uppercase tracking-widest font-mono text-gray-300">
            {settings.subtitle || 'Premium Branding Agency'}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.2] lg:leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400"
        >
          {renderHeroTitle(settings.heroTitle || '생각을 구체화하는 감각적 디자인')}
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mb-10"
        >
          {settings.heroSubtitle || '최고의 로고 디자인과 창의적인 마케팅 솔루션을 통해 고객의 브랜드를 한 차원 높이 끌어 올립니다.'}
        </motion.p>

        {/* CTA Elements */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center mb-20"
        >
          <button
            onClick={() => {
              if (settings.telegramLink) {
                window.open(settings.telegramLink, '_blank');
              } else {
                window.open('https://t.me/ruby_solution', '_blank');
              }
            }}
            className="flex items-center justify-center px-10 py-4.5 rounded-full text-base font-bold transition-all relative overflow-hidden group cursor-pointer text-white shadow-[0_0_30px_rgba(0,162,255,0.4)] scale-100 hover:scale-[1.03] active:scale-95 border border-[#24A1DE]/40 bg-gradient-to-r from-[#24A1DE] via-[#2AABEE] to-[#24A1DE] bg-[size:200%_auto] hover:bg-right duration-500"
          >
            <svg className="w-5.5 h-5.5 mr-3 text-white fill-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.19 15.51 16.03C15.37 16.8 15.08 17.06 14.81 17.09C14.21 17.15 13.76 16.7 13.18 16.32C12.27 15.73 11.76 15.37 10.88 14.79C9.86 14.12 10.52 13.75 11.1 13.15C11.25 12.99 13.9 10.57 13.95 10.36C13.96 10.33 13.96 10.22 13.9 10.17C13.84 10.12 13.75 10.14 13.68 10.15C13.59 10.17 12.2 11.09 9.49 12.92C9.09 13.19 8.73 13.33 8.41 13.32C8.06 13.31 7.38 13.12 6.88 12.96C6.26 12.76 5.76 12.65 5.8 12.31C5.83 12.13 6.07 11.95 6.54 11.76C9.43 10.51 11.36 9.68 12.33 9.28C15.1 8.12 15.67 7.92 16.05 7.92C16.13 7.92 16.31 7.94 16.43 8.04C16.53 8.12 16.56 8.24 16.57 8.32C16.58 8.41 16.6 8.62 16.64 8.8Z" />
            </svg>
            <span className="relative tracking-wide font-sans">{settings.heroCtaText || '실시간 텔레그램 문의'}</span>
          </button>
        </motion.div>

        {/* Elegant Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full grid grid-cols-3 gap-4 border-t border-white/5 pt-12 text-center"
        >
          <div className="flex flex-col items-center">
            <Award className="w-5 h-5 mb-2 text-gray-500" style={{ color: `${settings.accentColor}cc` }} />
            <span className="text-2xl font-bold text-white tracking-tight">99.8%</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono mt-0.5">클라이언트 만족도</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/5">
            <Users className="w-5 h-5 mb-2 text-gray-500" style={{ color: `${settings.accentColor}cc` }} />
            <span className="text-2xl font-bold text-white tracking-tight">400+</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono mt-0.5">완수 프로젝트 수</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-5 h-5 mb-2 text-gray-500" style={{ color: `${settings.accentColor}cc` }} />
            <span className="text-2xl font-bold text-white tracking-tight">100%</span>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-mono mt-0.5">지적재산권 독점수호</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Arrow down */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-40 hover:opacity-100 transition-opacity z-10 cursor-pointer" onClick={() => onNavigate('services')}>
        <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 mb-2">SCROLL DOWN</span>
        <ArrowDown className="w-4 h-4 text-gray-400" />
      </div>
    </section>
  );
};
