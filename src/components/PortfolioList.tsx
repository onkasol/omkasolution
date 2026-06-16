import React, { useState } from 'react';
import { useCMS } from '../CMSContext';
import { PortfolioItem } from '../types';
import { Grid, Eye, Calendar, User, ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PortfolioList: React.FC = () => {
  const { portfolio, settings } = useCMS();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-black text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span 
            className="text-xs font-mono uppercase tracking-widest block mb-3"
            style={{ color: settings.accentColor }}
          >
            {settings.portfolioSubtitle || "PORTFOLIO SHOWCASE"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 whitespace-pre-line leading-tight">
            {settings.portfolioTitle || "가치를 직관으로 교체하는 작품들"}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed whitespace-pre-line">
            {settings.portfolioDesc || "미적 아름다움은 기본입니다. 루비솔루션의 비주얼 포트폴리오는 비즈니스 돌파의 핵심 단서와 감동적 일체감을 자극합니다."}
          </p>
        </div>

        {/* Portfolio Dynamic Grid List */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {portfolio.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image Container */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-950 border-b border-white/5 flex items-center justify-center">
                  {/* Blurred Backdrop for Premium Gallery Aesthetic */}
                  <img 
                    src={item.imageUrl} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-lg scale-110 pointer-events-none"
                    loading="lazy"
                  />
                  {/* Actual Uncropped Image */}
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="relative z-10 max-w-full max-h-full object-contain p-2.5 transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <div 
                       className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      <Eye className="w-5 h-5 text-black font-black" />
                    </div>
                  </div>
                </div>

                {/* Info Overlay */}
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <span 
                      className="text-[10px] font-mono tracking-wider uppercase mb-1.5 inline-block"
                      style={{ color: settings.accentColor }}
                    >
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 text-[11px] text-gray-500 font-mono">
                    <span>{item.clientName || '루비 파트너스'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state conditional */}
        {portfolio.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 text-sm">해당 분류의 작품 포트폴리오를 준비 중입니다.</p>
          </div>
        )}

      </div>

      {/* LIGHTBOX LAYOUT MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row z-10"
              style={{
                boxShadow: `0 10px 50px ${settings.accentColor}1F`
              }}
            >
              {/* Image side */}
              <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto leading-none bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[420px]">
                {/* Blurred backdrop accent */}
                <img 
                  src={selectedItem.imageUrl} 
                  alt="" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xl scale-110 pointer-events-none"
                />
                {/* Genuine Uncropped Product Image */}
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title} 
                  referrerPolicy="no-referrer"
                  className="relative z-10 max-w-full max-h-[40vh] md:max-h-[60vh] object-contain p-4"
                />
                
                {/* Mobile close button on top of image */}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="md:hidden absolute top-4 right-4 p-2 bg-black/70 rounded-full border border-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description Details side */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-none">
                {/* Close Button Desktop */}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="hidden md:flex self-end p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors absolute top-6 right-6 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="pr-0 md:pr-4 mt-2">
                  <span 
                    className="text-xs font-mono tracking-wider uppercase mb-2 inline-block font-bold"
                    style={{ color: settings.accentColor }}
                  >
                    {selectedItem.category}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-4">
                    {selectedItem.title}
                  </h3>

                  <div className="h-px bg-white/10 my-4" />

                  {/* Metadata labels row */}
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>고객사: {selectedItem.clientName || '루비 프렌즈'}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-2">
                    CREATIVE CHALLENGE & ANSWER
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono tracking-wide">ID: {selectedItem.id}</span>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border border-white/10 hover:border-white/20 bg-white/5 text-xs font-bold rounded-lg transition-colors text-white cursor-pointer"
                  >
                    상세 닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
