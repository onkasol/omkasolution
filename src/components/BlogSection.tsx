import React, { useState } from 'react';
import { useCMS } from '../CMSContext';
import { BlogPost } from '../types';
import { Calendar, User, BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BlogSection: React.FC = () => {
  const { blog, settings } = useCMS();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Format blog post content to render nicely (support simple headers and lists)
  const renderBlogHTML = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('###')) {
        return <h4 key={index} className="text-lg font-bold text-white mt-6 mb-3 border-l-2 pl-3" style={{ borderColor: settings.accentColor }}>{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('#')) {
        return <h3 key={index} className="text-xl font-bold text-white mt-8 mb-4">{trimmed.replace('#', '').trim()}</h3>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return <li key={index} className="text-xs sm:text-sm text-gray-300 ml-4 list-disc mb-1.5">{trimmed.substring(1).trim()}</li>;
      }
      if (trimmed === '') {
        return <div key={index} className="h-4" />;
      }
      return <p key={index} className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">{paragraph}</p>;
    });
  };

  return (
    <section id="blog" className="py-24 bg-zinc-950 text-white relative scroll-mt-20 border-b border-white/5">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* News Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-xl">
            <span 
              className="text-xs font-mono uppercase tracking-widest block mb-3"
              style={{ color: settings.accentColor }}
            >
              {settings.blogSubtitle || "INSIGHTS & NOTICES"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight whitespace-pre-line leading-tight">
              {settings.blogTitle || "루비 디자인 트렌드 & 칼럼"}
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm mt-4 md:mt-0 leading-relaxed whitespace-pre-line">
            {settings.blogDesc || "로고 디자인 마켓의 핵심 인사이트와 효과적인 마케팅 PR 전략 및 루비솔루션의 새로운 공지사항을 연재합니다."}
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blog.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col bg-black/50 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full"
              onClick={() => setSelectedPost(post)}
            >
              {/* Media Thumbnail */}
              <div className="aspect-[16/10] w-full relative overflow-hidden bg-zinc-900 border-b border-white/5">
                <img 
                  src={post.imageUrl || "https://images.unsplash.com/photo-1541462608141-2ff030de122a?w=800&q=80"} 
                  alt={post.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Main info card */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center space-x-3 text-[10px] font-mono text-gray-500 mb-3.5">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author || '루비 기획'}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div 
                  className="flex items-center space-x-2 text-xs font-mono font-bold mt-6 pt-4 border-t border-white/5 transition-colors"
                  style={{ color: settings.accentColor }}
                >
                  <span>자세히 보기</span>
                  <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {blog.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 text-sm">등록된 칼럼이나 공지사항이 아직 존재하지 않습니다.</p>
          </div>
        )}

      </div>

      {/* DETAILED ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden max-h-[85vh] flex flex-col z-10"
              style={{
                boxShadow: `0 10px 50px ${settings.accentColor}1F`
              }}
            >
              {/* Header with image */}
              <div className="h-48 sm:h-64 relative bg-zinc-900 border-b border-white/5">
                <img 
                  src={selectedPost.imageUrl || "https://images.unsplash.com/photo-1541462608141-2ff030de122a?w=800&q=80"} 
                  alt={selectedPost.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                
                {/* Upper Meta */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
                    {selectedPost.title}
                  </h3>
                </div>

                {/* Close Button Inside Modal */}
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 p-2 bg-black/65 hover:bg-black/90 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable text body */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] flex-grow">
                {/* Authoring Info rows */}
                <div className="flex items-center space-x-6 text-xs text-gray-500 font-mono border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-gray-600" />
                    <span>작성자: {selectedPost.author || '루비 기획'}</span>
                  </div>
                </div>

                {/* Main Article content rendering */}
                <div className="markdown-body">
                  {renderBlogHTML(selectedPost.content)}
                </div>
              </div>

              {/* Close controls */}
              <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono">ONKA SOLUTION BLOG SYSTEM</span>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-bold"
                >
                  게시글 닫기
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
