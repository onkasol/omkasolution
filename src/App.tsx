import React, { useState, useEffect } from 'react';
import { CMSProvider, useCMS } from './CMSContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { PortfolioList } from './components/PortfolioList';
import { BlogSection } from './components/BlogSection';
import { ContactForm } from './components/ContactForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Gem, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { settings, isAdminMode, setIsAdminMode } = useCMS();
  const [activeSection, setActiveSection] = useState('hero');

  // Dynamically update document title based on CMS Settings
  useEffect(() => {
    if (settings && settings.title) {
      document.title = settings.title;
    }
  }, [settings]);

  // Smooth scroll handler
  const scrollToSection = (sectionId: string) => {
    setIsAdminMode(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
      }
    }, 100);
  };

  // Scroll spy to update header active highlights
  useEffect(() => {
    const handleScroll = () => {
      if (isAdminMode) return;
      const sections = ['hero', 'services', 'portfolio', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminMode]);

  // Choose font family style dynamically
  const getFontClass = () => {
    switch (settings.fontStyle) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-white ${getFontClass()}`}>
      
      {/* Dynamic site-wide accent color variables */}
      <Header onNavigate={scrollToSection} activeSection={activeSection} />

      <main>
        {isAdminMode ? (
          <div className="bg-zinc-950 min-h-[calc(100vh-80px)]">
            <AdminDashboard />
          </div>
        ) : (
          <>
            <Hero onNavigate={scrollToSection} />
            <Services />
            <PortfolioList />
            <BlogSection />
            <ContactForm />
          </>
        )}
      </main>

      {/* LUXURY AGENCY FOOTER */}
      <footer className="bg-black text-gray-400 border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${settings.accentColor}dd, #1b0735)` }}
              >
                <Gem className="w-4 h-4 text-white animate-pulse" />
              </div>
              <span className="text-base font-bold text-white tracking-wide">
                {settings.footerTitle || "루비솔루션(RubySolution)"}
              </span>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm whitespace-pre-line">
              {settings.footerDesc || "루비솔루션은 감각적인 비주얼 철학과 통합 디바이스 최적화, 압도적인 언론 미디어 PR 대행 실적을 바탕으로 고객 브랜드의 독보적인 탄생을 격조 높게 수호합니다."}
            </p>
            
            <div className="text-[10px] text-gray-600 font-mono flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: settings.accentColor }} />
              <span>본 웹사이트는 루비 CMS 보안가이드가 정방 실시간 작동합니다.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-gray-300 font-semibold">퀵 내비게이션</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => scrollToSection('hero')} className="text-left py-1 hover:text-white transition-colors cursor-pointer">홈페이지</button>
              <button onClick={() => scrollToSection('services')} className="text-left py-1 hover:text-white transition-colors cursor-pointer">제공 서비스</button>
              <button onClick={() => scrollToSection('portfolio')} className="text-left py-1 hover:text-white transition-colors cursor-pointer">포트폴리오</button>
              <button onClick={() => scrollToSection('blog')} className="text-left py-1 hover:text-white transition-colors cursor-pointer">소식/칼럼</button>
              <button onClick={() => scrollToSection('contact')} className="text-left py-1 hover:text-white transition-colors cursor-pointer text-purple-300 font-bold" style={{ color: settings.accentColor }}>의뢰 접수</button>
              <button onClick={() => setIsAdminMode(true)} className="text-left py-1 hover:text-white transition-colors cursor-pointer font-bold">CMS 대시보드</button>
            </div>
          </div>

          {/* Business details */}
          <div className="col-span-1 md:col-span-5 space-y-3.5 text-xs">
            <h4 className="text-xs uppercase font-mono tracking-widest text-gray-300 font-semibold">사업자 법적 명시정보</h4>
            <div className="space-y-1.5 text-gray-500 font-medium font-sans">
              <p className="font-semibold text-gray-400">루비솔루션(RubySolution) | 대표자: {settings.representative || "크리에이티브 디렉터단"}</p>
              <p>본사 주소: {settings.address || '서울특별시 강남구 테헤란로 518, 디타워 14층'}</p>
              <p>대표 메일: {settings.email || 'contact@ruby.solution'} &nbsp;|&nbsp; 문의: {settings.phone || '02-1234-5678'}</p>
              <p className="pt-2 text-[10px] text-gray-600 font-mono uppercase">
                COPYRIGHT © {new Date().getFullYear()} RUBY SOLUTION. All Rights Reserved. &nbsp;|&nbsp; DESIGN BY RUBY
              </p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}
