import React, { useState, useEffect } from 'react';
import { useCMS } from '../CMSContext';
import { SiteSettings, PortfolioItem, BlogPost, ContactInquiry } from '../types';
import { 
  Settings, 
  Image, 
  FileText, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  RotateCcw, 
  ExternalLink,
  BookOpen,
  Calendar,
  Gem,
  RefreshCw,
  Eye,
  Check,
  CheckSquare,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Client-side image compression to fit Firestore's 1MB document size limit
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to quality 0.7 jpeg
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};

export const AdminDashboard: React.FC = () => {
  const { 
    settings, 
    portfolio, 
    blog, 
    inquiries, 
    updateSettings,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateInquiryStatus,
    deleteInquiry,
    currentUser,
    triggerReset
  } = useCMS();

  const [activeTab, setActiveTab] = useState<'settings' | 'portfolio' | 'blog' | 'inquiries' | 'footer' | 'ai-helper' | 'mobile-preview'>('settings');
  const [iframeRefKey, setIframeRefKey] = useState<number>(0);

  // Site Settings Form state
  const [formSettings, setFormSettings] = useState<SiteSettings>(settings);
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Modals for add/edit states
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  
  const [openBlogModal, setOpenBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Portfolio Form State
  const [pId, setPId] = useState('');
  const [pTitle, setPTitle] = useState('');
  const [pClient, setPClient] = useState('');
  const [pCategory, setPCategory] = useState<'로고 디자인' | '광고/PR' | '종합 브랜딩'>('로고 디자인');
  const [pDesc, setPDesc] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');

  // Blog Form State
  const [bId, setBId] = useState('');
  const [bTitle, setBTitle] = useState('');
  const [bAuthor, setBAuthor] = useState('');
  const [bCategory, setBCategory] = useState<'공지사항' | '디자인 트렌드' | '홍보 칼럼'>('공지사항');
  const [bSummary, setBSummary] = useState('');
  const [bContent, setBContent] = useState('');
  const [bImageUrl, setBImageUrl] = useState('');

  // AI Logo Idea state
  const [aiSector, setAiSector] = useState('고급 플라워 샵 (Flower Boutique)');
  const [aiMood, setAiMood] = useState('우아한, 클래식, 보랏빛 포인트');
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Trigger modal for portfolio edit
  const handleEditPortfolioClick = (item: PortfolioItem) => {
    setEditingPortfolio(item);
    setPId(item.id);
    setPTitle(item.title);
    setPClient(item.clientName);
    setPCategory(item.category);
    setPDesc(item.description);
    setPImageUrl(item.imageUrl);
    setOpenPortfolioModal(true);
  };

  const handleNewPortfolioClick = () => {
    setEditingPortfolio(null);
    setPId('port-' + Math.random().toString(36).substr(2, 5));
    setPTitle('');
    setPClient('');
    setPCategory('로고 디자인');
    setPDesc('');
    setPImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
    setOpenPortfolioModal(true);
  };

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle || !pDesc || !pImageUrl) {
      alert('모든 필수 항목을 정밀히 입력해 주세요.');
      return;
    }

    const payload = {
      id: pId,
      title: pTitle,
      clientName: pClient || '루비솔루션 파트너스',
      category: pCategory,
      description: pDesc,
      imageUrl: pImageUrl
    };

    if (editingPortfolio) {
      await updatePortfolioItem({ ...payload, createdAt: editingPortfolio.createdAt });
    } else {
      await addPortfolioItem(payload);
    }
    setIframeRefKey(prev => prev + 1);
    setOpenPortfolioModal(false);
  };

  // Trigger modal for blog edit
  const handleEditBlogClick = (post: BlogPost) => {
    setEditingBlog(post);
    setBId(post.id);
    setBTitle(post.title);
    setBAuthor(post.author);
    setBCategory(post.category);
    setBSummary(post.summary);
    setBContent(post.content);
    setBImageUrl(post.imageUrl);
    setOpenBlogModal(true);
  };

  const handleNewBlogClick = () => {
    setEditingBlog(null);
    setBId('blog-' + Math.random().toString(36).substr(2, 5));
    setBTitle('');
    setBAuthor(currentUser?.displayName || '루비 기획실');
    setBCategory('디자인 트렌드');
    setBSummary('');
    setBContent('');
    setBImageUrl('https://images.unsplash.com/photo-1541462608141-2ff030de122a?w=800&q=80');
    setOpenBlogModal(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bSummary || !bContent) {
      alert('필수 게시글 데이터셋을 모두 완결지어 주세요.');
      return;
    }

    const payload = {
      id: bId,
      title: bTitle,
      author: bAuthor || '루비 기획실',
      category: bCategory,
      summary: bSummary,
      content: bContent,
      imageUrl: bImageUrl
    };

    if (editingBlog) {
      await updateBlogPost({ ...payload, createdAt: editingBlog.createdAt });
    } else {
      await addBlogPost(payload);
    }
    setIframeRefKey(prev => prev + 1);
    setOpenBlogModal(false);
  };

  // Update Settings handler
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formSettings);
    setIframeRefKey(prev => prev + 1);
    alert('CMS 웹사이트 설정값이 정상 변경되었습니다. 전체 레이아웃이 실시간 갱신됩니다!');
  };

  // Call server-side Gemini endpoint for logo generation help
  const runAiLogoBrainstorm = async () => {
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('/api/logobrainstorm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sector: aiSector,
          mood: aiMood
        })
      });

      if (!response.ok) {
        throw new Error('API failure');
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      // Mock result fallback if API isn't built yet
      setTimeout(() => {
        setAiResult({
          story: `${aiSector} 브랜드는 전통과 품격을 향유하는 특별한 소비층을 대변합니다. 보편적인 자연의 부드러움에 ${aiMood} 성격을 녹여내 유일무이한 상징을 기화합니다.`,
          symbolIdea: `'골든 블룸 시그니처 (Golden Bloom)' - 세밀히 조각된 얇은 세리프 형태의 원형 장미 구조 내면에 꽃과 칼날의 대조를 품은 비대칭 아방가르드 프레임워크 설계.`,
          colors: ['#3b0764 (다크 오키드)', '#a855f7 (빛나는 퍼플)', '#fcd34d (리치 골드)'],
          copywriting: `${aiSector}의 자취는 순간이 아닌 공간으로 기억될 것입니다. 한 호흡 깊숙히, 당신만이 온전히 간직할 로얄 블렌딩.`
        });
      }, 1500);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top welcome board */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center space-x-2">
              <span>RubySolution Real-Time CMS</span>
              <span className="text-xs uppercase px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono rounded-full animate-pulse">
                ADMIN CONSOLE
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              코딩 한 편 없이 럭셔리 포인트 테마 컬러, 로고 텍스트, 포트폴리오, 공지/컬럼, 접수 의뢰들을 완벽 조작합니다.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={triggerReset}
              className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 테마 데이터 리셋</span>
            </button>
            <div className="hidden sm:block text-right">
              <span className="text-xs text-gray-400 block font-medium">{currentUser?.email || 'admin@ruby.solution'}</span>
              <span className="text-[10px] text-gray-500 font-mono">가상 권한: 최고 관리자</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>기본 웹사이트 설정</span>
          </button>
          
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'portfolio' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>포트폴리오 관리 ({portfolio.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'blog' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>글/공지사항 관리 ({blog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === 'inquiries' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>접수된 의뢰서 ({inquiries.length})</span>
            {inquiries.some(i => i.status === 'unread') && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'footer' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>마지막 섹션 (푸터/회사소개) 관리자 모드</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-helper')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-purple-500/20 ${
              activeTab === 'ai-helper' ? 'bg-purple-900/45 text-purple-300 border-purple-500' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gem className="w-4 h-4 text-purple-400" />
            <span>루비 AI 로고 브레인스토머</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile-preview')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-sky-500/20 ${
              activeTab === 'mobile-preview' ? 'bg-sky-500/10 text-sky-400 border-sky-500' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>📱 실시간 모바일 미리보기</span>
          </button>

        </div>

        {/* Tab Contents Panels */}
        <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 sm:p-8">
          
          {/* TAB 1: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSave} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold">기본 사이트 메타데이터 & 테마 설정</h3>
                  <p className="text-xs text-gray-500 mt-1">웹 브라우저 타이틀, 히어로 카피라이팅, 시각 디자인 폰트 형식을 설정합니다.</p>
                </div>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer mt-4 sm:mt-0"
                >
                  <Save className="w-4 h-4" />
                  <span>설정값 전체 저장</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Visual Settings card */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-gray-500">배경 테마 및 폰트 설계</h4>
                  
                  {/* Accent Color picker */}
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">포인트 에센셜 액센트 컬러</label>
                    <div className="grid grid-cols-5 gap-2.5 mb-3">
                      {[
                        { k: '네온 블루', hex: '#00a2ff' },
                        { k: '심해 인디고', hex: '#6366f1' },
                        { k: '사이버 사이안', hex: '#06b6d4' },
                        { k: '럭셔리 골드', hex: '#eab308' },
                        { k: '벨벳 피치', hex: '#ec4899' }
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setFormSettings({ ...formSettings, accentColor: c.hex })}
                          className={`flex flex-col items-center p-2 rounded-xl border text-[10px] transition-all cursor-pointer ${
                            formSettings.accentColor === c.hex ? 'border-white text-white font-bold' : 'border-white/5 text-gray-500 hover:text-gray-300'
                          }`}
                          style={{ backgroundColor: `${c.hex}14` }}
                        >
                          <span className="w-5 h-5 rounded-full mb-1 block" style={{ backgroundColor: c.hex }} />
                          <span className="scale-90">{c.k}</span>
                        </button>
                      ))}
                    </div>

                    {/* Manual hex code */}
                    <input 
                      type="text" 
                      value={formSettings.accentColor}
                      onChange={(e) => setFormSettings({ ...formSettings, accentColor: e.target.value })}
                      placeholder="#00a2ff"
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 font-mono text-center"
                    />
                  </div>

                  {/* Font picker */}
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">기본 타이포그래피 스타일</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'sans', name: '현대적인 산세리프 (Inter)', classes: 'font-sans' },
                        { id: 'serif', name: '우아한 고전 세리프', classes: 'font-serif' },
                        { id: 'mono', name: '기하학적 모노 (JetBrains)', classes: 'font-mono' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormSettings({ ...formSettings, fontStyle: f.id as any })}
                          className={`p-3.5 border rounded-xl text-xs transition-colors cursor-pointer text-center ${
                            formSettings.fontStyle === f.id ? 'border-white text-white font-bold bg-white/5' : 'border-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className={`block text-base mb-1 ${f.classes}`}>Aa</span>
                          <span className="text-[10px] scale-90 block">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Basic text */}
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">프리뷰 웹 타이틀</label>
                    <input 
                      type="text" 
                      value={formSettings.title}
                      onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">로고 영문 서브타이틀</label>
                    <input 
                      type="text" 
                      value={formSettings.subtitle}
                      onChange={(e) => setFormSettings({ ...formSettings, subtitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                      placeholder="ONKA SOLUTION"
                    />
                  </div>
                </div>

                {/* Hero Settings card */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-gray-500">히어로 상단 캐피라이팅 및 연락처 세부정보</h4>
                  
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">메인 히어로 헤드라인 (엔터키로 줄바꿈 가능)</label>
                    <textarea 
                      rows={3}
                      value={formSettings.heroTitle}
                      onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">히어로 서브 설명문</label>
                    <textarea 
                      rows={3}
                      value={formSettings.heroSubtitle}
                      onChange={(e) => setFormSettings({ ...formSettings, heroSubtitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs leading-relaxed focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">CTA 버튼 설명</label>
                      <input 
                        type="text" 
                        value={formSettings.heroCtaText}
                        onChange={(e) => setFormSettings({ ...formSettings, heroCtaText: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">대표 문의 메일</label>
                      <input 
                        type="email" 
                        value={formSettings.email}
                        onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">핫라인 전화번호</label>
                      <input 
                        type="text" 
                        value={formSettings.phone}
                        onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500 font-mono"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">카카오상담 링크 주소</label>
                      <input 
                        type="text" 
                        value={formSettings.kakaoLink}
                        onChange={(e) => setFormSettings({ ...formSettings, kakaoLink: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">텔레그램 문의 주소</label>
                      <input 
                        type="text" 
                        value={formSettings.telegramLink || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, telegramLink: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500 font-mono"
                        placeholder="https://t.me/your_telegram_id"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2 font-mono">OFFICE 주소지</label>
                    <input 
                      type="text" 
                      value={formSettings.address}
                      onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">대표자 명시정보 (예: 루비솔루션)</label>
                      <input 
                        type="text" 
                        value={formSettings.representative || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, representative: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                        placeholder="루비솔루션"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">하단 루비솔루션 소개 문구 (줄바꿈 가능)</label>
                      <textarea 
                        rows={3}
                        value={formSettings.footerDesc || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, footerDesc: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                        placeholder="루비솔루션은 아너링크, 씨맥스, 스윅스..."
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* 독보적인 크리에이티브 대행설계 섹션 설정 */}
              <div className="border-t border-white/5 pt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: formSettings.accentColor || '#00a2ff' }} />
                    <span>독보적인 크리에이티브 대행설계 섹션 설정</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">두 번째 서비스 섹션의 헤더, 개별 서비스 항목(로고 브랜딩 / 광고 PR) 및 하단 3대 에센셜 혜택 문구를 직접 커스텀 조작합니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Section Headers */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-sky-400 font-mono">섹션 타이틀 & 설명문</h4>
                    
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">영문 대분류 (예: OUR EXPERTISE)</label>
                      <input 
                        type="text" 
                        value={formSettings.servicesSubtitle || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, servicesSubtitle: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                        placeholder="OUR EXPERTISE"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">메인 타이틀 (줄바꿈 가능)</label>
                      <textarea 
                        rows={2}
                        value={formSettings.servicesTitle || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, servicesTitle: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                        placeholder="루비솔루션의 독보적인&#13;&#10;크리에이티브 대행 설계"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">섹션 요약문 설명</label>
                      <textarea 
                        rows={3}
                        value={formSettings.servicesDesc || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, servicesDesc: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs leading-relaxed focus:outline-none focus:border-sky-500 resize-none"
                        placeholder="비즈니스 형태에 가장 잘 어울리는..."
                      />
                    </div>
                  </div>

                  {/* Service 1 Customize */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-sky-400 font-mono">서비스 1 (로고 디자인 & 브랜딩) 컬럼</h4>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">서비스 태그 (예: LOGO & BRANDING)</label>
                      <input 
                        type="text" 
                        value={formSettings.service1Tag || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service1Tag: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">서비스 제목</label>
                      <input 
                        type="text" 
                        value={formSettings.service1Title || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service1Title: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">서비스 요약설명</label>
                      <textarea 
                        rows={2}
                        value={formSettings.service1Desc || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service1Desc: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">제공 산출물 리스트 (줄바꿈 단위로 1개씩 적용)</label>
                      <textarea 
                        rows={3}
                        value={formSettings.service1Deliverables || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service1Deliverables: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 font-mono leading-normal"
                        placeholder="엔터키를 쳐서 항목을 줄바꿈으로 구분해 기입하세요."
                      />
                    </div>
                  </div>

                  {/* Service 2 Customize */}
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-sky-400 font-mono">서비스 2 (통합 광고 & PR) 컬럼</h4>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">서비스 태그 (예: ADVERTISING & PR)</label>
                      <input 
                        type="text" 
                        value={formSettings.service2Tag || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service2Tag: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">서비스 제목</label>
                      <input 
                        type="text" 
                        value={formSettings.service2Title || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service2Title: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">서비스 요약설명</label>
                      <textarea 
                        rows={2}
                        value={formSettings.service2Desc || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service2Desc: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-1.5">제공 산출물 리스트 (줄바꿈 단위로 1개씩 적용)</label>
                      <textarea 
                        rows={3}
                        value={formSettings.service2Deliverables || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, service2Deliverables: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-sky-500 font-mono leading-normal"
                        placeholder="엔터키를 쳐서 항목을 줄바꿈으로 구분해 기입하세요."
                      />
                    </div>
                  </div>
                </div>

                {/* Sub Features / Bottom 3 Highlights */}
                <div className="bg-black/25 border border-white/5 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-sky-400 font-mono">하단 3대 에센셜 혜택 카드 커스텀</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Highlight 1 */}
                    <div className="space-y-3 bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded">에센셜 혜택 1</span>
                      <div className="flex flex-col">
                        <label className="text-[11px] text-gray-400 font-semibold mb-1">제목</label>
                        <input 
                          type="text" 
                          value={formSettings.highlight1Title || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, highlight1Title: e.target.value })}
                          className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] text-gray-400 font-semibold mb-1">설명 문안</label>
                        <textarea 
                          rows={2}
                          value={formSettings.highlight1Desc || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, highlight1Desc: e.target.value })}
                          className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Highlight 2 */}
                    <div className="space-y-3 bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded">에센셜 혜택 2</span>
                      <div className="flex flex-col">
                        <label className="text-[11px] text-gray-400 font-semibold mb-1">제목</label>
                        <input 
                          type="text" 
                          value={formSettings.highlight2Title || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, highlight2Title: e.target.value })}
                          className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] text-gray-400 font-semibold mb-1">설명 문안</label>
                        <textarea 
                          rows={2}
                          value={formSettings.highlight2Desc || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, highlight2Desc: e.target.value })}
                          className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Highlight 3 */}
                    <div className="space-y-3 bg-black/40 border border-white/5 p-4 rounded-xl">
                      <span className="text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded">에센셜 혜택 3</span>
                      <div className="flex flex-col">
                        <label className="text-[11px] text-gray-400 font-semibold mb-1">제목</label>
                        <input 
                          type="text" 
                          value={formSettings.highlight3Title || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, highlight3Title: e.target.value })}
                          className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] text-gray-400 font-semibold mb-1">설명 문안</label>
                        <textarea 
                          rows={2}
                          value={formSettings.highlight3Desc || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, highlight3Desc: e.target.value })}
                          className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              <div className="h-px bg-white/5 pt-4" />
              <div className="text-center">
                <button
                  type="submit"
                  className="px-10 py-4 text-sm font-bold text-black bg-white rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  기입한 CMS 설정 즉시 적용하기
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PORTFOLIO MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold">크리에이티브 포트폴리오 관리</h3>
                  <p className="text-xs text-gray-500 mt-1">고유한 대행 실적 갤러리에 신규 항목을 추가하거나 편집/제거합니다.</p>
                </div>
                <button
                  onClick={handleNewPortfolioClick}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 작품 등록</span>
                </button>
              </div>

              {/* Portfolio Header Customizing Section */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold flex items-center space-x-2 text-white">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: formSettings.accentColor || '#00a2ff' }} />
                    <span>포트폴리오 섹션 타이틀 및 설명 커스텀 기획</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">세 번째 포트폴리오 메인 구역의 문장들을 변경합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">영문 대분류 (예: PORTFOLIO SHOWCASE)</label>
                    <input 
                      type="text" 
                      value={formSettings.portfolioSubtitle || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, portfolioSubtitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      placeholder="PORTFOLIO SHOWCASE"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">메인 구역 타이틀 (줄바꿈 가능)</label>
                    <textarea 
                      rows={2}
                      value={formSettings.portfolioTitle || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, portfolioTitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                      placeholder="가치를 직관으로 교체하는 작품들"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">구역 요약 설명문 (줄바꿈 가능)</label>
                    <textarea 
                      rows={2}
                      value={formSettings.portfolioDesc || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, portfolioDesc: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                      placeholder="미적 아름다움은 기본입니다..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={async () => {
                      await updateSettings(formSettings);
                      alert('포트폴리오 구역의 헤더 소개 문구가 안전하게 변경되었습니다!');
                    }}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-xs font-bold rounded-lg text-white transition-all cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95 duration-200"
                    style={{ backgroundColor: formSettings.accentColor }}
                  >
                    소개 문안 저장하기
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-500 font-mono uppercase">
                      <th className="py-3 px-4">작품 이미지</th>
                      <th className="py-3 px-4">프로젝트 네임 / 분류</th>
                      <th className="py-3 px-4">고객사 명</th>
                      <th className="py-3 px-4">제작 종결일</th>
                      <th className="py-3 px-4 text-right">관리 작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {portfolio.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-12 h-9 object-cover rounded-md border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{item.title}</div>
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5"
                            style={{ color: settings.accentColor }}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-xs">{item.clientName}</td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-xs">{item.createdAt}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button 
                            onClick={() => handleEditPortfolioClick(item)}
                            className="p-1 px-2.5 bg-white/5 border border-white/5 rounded-lg text-xs text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>수정</span>
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('이 포트폴리오 슬라이드를 영구 삭제하시겠습니까?')) {
                                deletePortfolioItem(item.id);
                              }
                            }}
                            className="p-1 px-2.5 bg-red-950/45 border border-red-500/20 rounded-lg text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>제거</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BLOG MANAGEMENT */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold">인사이트 공지 및 마케팅 PR 칼럼 배포</h3>
                  <p className="text-xs text-gray-500 mt-1">방문객을 사로잡을 전문 칼럼과 공식 공지사항을 기록합니다.</p>
                </div>
                <button
                  onClick={handleNewBlogClick}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 칼럼 퍼블리싱</span>
                </button>
              </div>

              {/* Blog Header Customizing Section */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold flex items-center space-x-2 text-white">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: formSettings.accentColor || '#00a2ff' }} />
                    <span>글 및 공지사항 섹션 타이틀 및 설명 커스텀 기획</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">네 번째 글 및 공지사항 메인 구역의 문장들을 직접 변경합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">영문 대분류 (예: INSIGHTS & NOTICES)</label>
                    <input 
                      type="text" 
                      value={formSettings.blogSubtitle || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, blogSubtitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      placeholder="INSIGHTS & NOTICES"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">메인 구역 타이틀 (줄바꿈 가능)</label>
                    <textarea 
                      rows={2}
                      value={formSettings.blogTitle || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, blogTitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                      placeholder="루비 디자인 트렌드 & 칼럼"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">구역 요약 설명문 (줄바꿈 가능)</label>
                    <textarea 
                      rows={2}
                      value={formSettings.blogDesc || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, blogDesc: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
                      placeholder="로고 디자인 마켓의 핵심 인사이트와..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={async () => {
                      await updateSettings(formSettings);
                      alert('글 및 공지사항 구역의 헤더 소개 문구가 안전하게 변경되었습니다!');
                    }}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-xs font-bold rounded-lg text-white transition-all cursor-pointer shadow-lg hover:scale-[1.01] active:scale-95 duration-200"
                    style={{ backgroundColor: formSettings.accentColor }}
                  >
                    소개 문안 저장하기
                  </button>
                </div>
              </div>

              {/* Blog table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-500 font-mono uppercase">
                      <th className="py-3 px-4">대표 썸네일</th>
                      <th className="py-3 px-4">칼럼 제목</th>
                      <th className="py-3 px-4">담당 부서/저자</th>
                      <th className="py-3 px-4 text-right">기능 단축키</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {blog.map((post) => (
                      <tr key={post.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-12 h-9 object-cover rounded-md border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white line-clamp-1">{post.title}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-xs">{post.author}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button 
                            onClick={() => handleEditBlogClick(post)}
                            className="p-1 px-2.5 bg-white/5 border border-white/5 rounded-lg text-xs text-gray-300 hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>편집</span>
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('이 칼럼 아티클을 전면 삭제하시겠습니까?')) {
                                deleteBlogPost(post.id);
                              }
                            }}
                            className="p-1 px-2.5 bg-red-950/45 border border-red-500/20 rounded-lg text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>제거</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VISITORS INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold">접수된 비즈니스 파트너십 의뢰서</h3>
                <p className="text-xs text-gray-500 mt-1">의뢰 양식으로 유입된 고객사의 맞춤 상담 접수 및 처리 상태입니다.</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-gray-500 text-sm">현재 새로 인입된 의뢰 문의 목록이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="bg-black border border-white/10 rounded-2xl p-6 space-y-4 relative overflow-hidden"
                    >
                      {/* Inquiry status badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3.5">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-white">{inq.name} 파트너님</span>
                          <span className="text-xs font-mono text-gray-500">[{inq.serviceCategory}]</span>
                          <span className="text-[10px] text-gray-500 font-mono">신청시각: {new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Dropdown/Toggle status */}
                          <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl">
                            {(['unread', 'read', 'replied'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => updateInquiryStatus(inq.id, st)}
                                className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-lg transition-colors cursor-pointer ${
                                  inq.status === st 
                                    ? st === 'unread' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : st === 'read' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                              >
                                {st === 'unread' ? '접수신규' : st === 'read' ? '조회읽음' : '메일회신완료'}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              if (confirm('이 의뢰 내역을 수거함에서 삭제처리 합니까?')) {
                                deleteInquiry(inq.id);
                              }
                            }}
                            className="p-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="안심 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-gray-400 bg-white/5 p-4 rounded-xl">
                        <p>연락처: <span className="text-white font-bold">{inq.phone}</span></p>
                        <p>이메일: <a href={`mailto:${inq.email}`} className="text-white hover:underline font-bold">{inq.email}</a></p>
                      </div>

                      {/* Text */}
                      <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-purple-500/60 font-sans">
                        {inq.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI BRAINSTOMER PORTLET */}
          {activeTab === 'ai-helper' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-purple-400" />
                  <span>루비 AI 로고 & PR 브레인스토머 (Google Gemini)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">가상의 클라이언트 정보와 무드를 기재하면 루비 AI 특화엔진이 어울리는 브랜드 비전과 심볼 구상, 기획 카피를 창의적으로 추천배송합니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Inputs left */}
                <div className="md:col-span-1 bg-black border border-white/10 p-5 rounded-2xl space-y-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">클라이언트 업종/성격</label>
                    <input 
                      type="text" 
                      value={aiSector}
                      onChange={(e) => setAiSector(e.target.value)}
                      placeholder="친환경 패션 아쿠아 어패럴"
                      className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-1.5">선호하는 디자이너 무드</label>
                    <input 
                      type="text" 
                      value={aiMood}
                      onChange={(e) => setAiMood(e.target.value)}
                      placeholder="사이버펑크, 정교함, 아쿠아블루"
                      className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>

                  <button
                    onClick={runAiLogoBrainstorm}
                    disabled={isAiLoading}
                    className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI 제안 뇌 회로 작동 중...</span>
                      </>
                    ) : (
                      <>
                        <Gem className="w-3.5 h-3.5" />
                        <span>AI 로고 시나리오 제안받기</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Response right */}
                <div className="md:col-span-2 bg-black border border-white/10 p-6 rounded-2xl min-h-[250px] relative flex flex-col justify-between">
                  {aiResult ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-4 text-xs sm:text-sm"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">1. BRAND STORY / 브랜드 지향 가치</h4>
                        <p className="text-gray-300 leading-relaxed font-sans">{aiResult.story}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">2. VISUAL LOGO SYMBOL / 추천 심올 콘셉트</h4>
                        <p className="text-gray-200 leading-relaxed font-semibold font-sans">{aiResult.symbolIdea}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 font-mono">3. KEY COPYWRITING / 광고 헤드카피 추천</h4>
                        <div className="bg-purple-500/15 border-l-2 border-purple-500 p-3 italic text-gray-200 font-sans leading-relaxed">
                          "{aiResult.copywriting}"
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-gray-600 font-mono">RECOMMENDED HEX COLS:</span>
                        <div className="flex space-x-2">
                          {aiResult.colors?.map((colStr: string) => (
                            <span key={colStr} className="text-[9px] font-mono select-all bg-white/5 px-2 py-0.5 rounded text-gray-400">
                              {colStr}
                            </span>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-gray-500 space-y-2">
                      <Gem className="w-8 h-8 text-zinc-700 animate-pulse" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">입력한 세그먼트에 맞는 AI 콘셉트 가이딩이 출력됩니다.</p>
                        <p className="text-[10px] text-gray-600 mt-1">루비솔루션의 감각을 배팅해 브랜드를 즉시 브레인스톰 시뮬레이트 하세요.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FOOTER & LAST SECTION EDIT MODE */}
          {activeTab === 'footer' && (
            <form onSubmit={handleSettingsSave} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  <span>마지막 섹션 (푸터/회사소개) 관리자 모드</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  홈페이지 최하단 마지막 섹션인 푸터 영역의 문구와 사업자 정식 정보를 커스텀 관리합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form fields */}
                <div className="lg:col-span-7 bg-black/50 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6">
                  
                  {/* Contact section titles */}
                  <div className="border-b border-white/5 pb-2.5">
                    <h4 className="text-[10px] font-bold text-purple-400 font-mono tracking-wider uppercase">의뢰/연락 섹션 (GET IN TOUCH) 문구 설정</h4>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">의뢰 섹션 메인 타이틀 *</label>
                    <input 
                      type="text" 
                      required
                      value={formSettings.contactTitle || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, contactTitle: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white"
                      placeholder="새로운 성공의 궤적을 그리다"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">의뢰 섹션 상세 설명 (줄바꿈 가능) *</label>
                    <textarea 
                      rows={3}
                      required
                      value={formSettings.contactDesc || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, contactDesc: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white resize-y leading-relaxed"
                      placeholder="로고 디자인부터 타겟 맞춤 광고 매체 PR 대행까지..."
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">필요 기획 분야 카테고리 (쉼표로 구분) *</label>
                    <input 
                      type="text" 
                      required
                      value={formSettings.contactCategories || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, contactCategories: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white font-mono"
                      placeholder="로고 디자인, 광고/PR, 기타 문의"
                    />
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-normal">
                      고객이 의뢰 시 선택할 각 기획 옵션을 쉼표(,)로 구분해서 작성해 주세요. (예: 로고 디자인, 일대일 브랜딩, 광고/PR, 프라이빗 언론)
                    </p>
                  </div>

                  <div className="border-b border-white/5 pb-2.5 pt-2">
                    <h4 className="text-[10px] font-bold text-purple-400 font-mono tracking-wider uppercase">법인(회사) 명의 & 푸터 정보 설정</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">대표 브랜드명 / 푸터 타이틀 *</label>
                      <input 
                        type="text" 
                        required
                        value={formSettings.footerTitle || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, footerTitle: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white"
                        placeholder="루비솔루션"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">대표자명 / 명시자 *</label>
                      <input 
                        type="text" 
                        required
                        value={formSettings.representative || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, representative: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white"
                        placeholder="루비솔루션"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">하단 루비솔루션 소개 문구 (줄바꿈 가능) *</label>
                    <textarea 
                      rows={6}
                      required
                      value={formSettings.footerDesc || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, footerDesc: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white resize-y leading-relaxed"
                      placeholder="루비솔루션 관련 소개 및 정식 계약 등..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">대표 연락처 / 문의전화</label>
                      <input 
                        type="text" 
                        value={formSettings.phone || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white font-mono"
                        placeholder="02-1234-5678"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-400 font-semibold mb-2">대표 메일</label>
                      <input 
                        type="email" 
                        value={formSettings.email || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                        className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white font-mono"
                        placeholder="contact@ruby.solution"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 font-semibold mb-2">본사 주소 주소지</label>
                    <input 
                      type="text" 
                      value={formSettings.address || ''}
                      onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                      className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 text-white"
                      placeholder="서울특별시 강남구 테헤란로 518, 디타워 14층"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-semibold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                      <span>하단 정보 및 소개 변경사항 저장</span>
                    </button>
                  </div>
                </div>

                {/* Practical Preview card */}
                <div className="lg:col-span-5 bg-black/30 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs font-mono tracking-widest text-gray-400 uppercase">하단 마지막 섹션 실시간 적용 시뮬레이터</h4>
                  <div className="border border-white/10 rounded-xl p-5 bg-black space-y-5">
                    
                    {/* GET IN TOUCH Section Preview */}
                    <div className="p-3 bg-zinc-950 border border-white/10 rounded-xl space-y-2.5">
                      <span className="text-[8px] font-mono tracking-widest text-purple-400 uppercase block">GET IN TOUCH</span>
                      <h5 className="text-xs font-black text-white whitespace-pre-line">{formSettings.contactTitle || "새로운 성공의 궤적을 그리다"}</h5>
                      <p className="text-[9px] text-gray-400 leading-relaxed whitespace-pre-line border-l border-purple-500/40 pl-1.5">
                        {formSettings.contactDesc || "로고 디자인부터 타겟 맞춤 광고 매체 PR 대행까지..."}
                      </p>
                      
                      {/* Interactive Categories Simulation */}
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[7.5px] font-mono text-gray-500 uppercase block font-semibold">필요 기획 분야 시뮬레이션</span>
                        <div className="flex flex-wrap gap-1">
                          {(formSettings.contactCategories
                            ? formSettings.contactCategories.split(',').map(s => s.trim()).filter(Boolean)
                            : ['로고 디자인', '광고/PR', '기타 문의']
                          ).map((cat, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 bg-purple-900/40 border border-purple-500/20 text-[8.5px] text-purple-300 rounded-md font-bold truncate max-w-[100px]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                      <div className="w-6 h-6 rounded-md bg-purple-600/30 flex items-center justify-center">
                        <Gem className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <span className="text-xs font-bold text-white">{formSettings.footerTitle || "루비솔루션(RubySolution)"}</span>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-relaxed whitespace-pre-line border-l-2 border-purple-500/50 pl-2">
                      {formSettings.footerDesc || "마지막 섹션의 브랜드 설명이 이곳에 표시됩니다."}
                    </p>

                    <div className="pt-2 border-t border-white/5 space-y-1.5 text-[9px] text-gray-500 font-mono">
                      <p className="font-bold text-gray-300">대표자: {formSettings.representative || "미설정"}</p>
                      <p>주소: {formSettings.address || "미설정"}</p>
                      <p>이메일/연락처: {formSettings.email || "미설정"} | {formSettings.phone || "미설정"}</p>
                    </div>

                  </div>
                  <div className="bg-purple-950/10 border border-purple-500/20 rounded-xl p-3.5 text-[10px] text-purple-300 leading-normal">
                    💡 <strong>실시간 시뮬레이션:</strong> 위에 입력 중인 값은 홈페이지 하단 마지막 섹션에 실시간으로 업데이트되어 표기됩니다.
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 7: MOBILE LIVE PREVIEW DEVICE SIMULATOR */}
          {activeTab === 'mobile-preview' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center space-x-2">
                      <svg className="w-5 h-5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>📱 실시간 모바일 디바이스 미리보기 (Simulator)</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      CMS 설정 및 포트폴리오/컬럼 수정 사항이 실시간으로 모바일 단말 프레임에 반응형 최적화 표출되는지 시뮬레이트합니다.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setIframeRefKey(prev => prev + 1)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>기기 화면 동기화</span>
                    </button>
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>새 탭으로 열기</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual simulator guide & instructions */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-gradient-to-br from-zinc-950 to-purple-950/20 border border-white/5 rounded-3xl p-6 space-y-5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-sky-400 font-bold block">RUBY SIMULATOR v2.1</span>
                    <h4 className="text-sm font-bold text-white leading-normal">모바일 뷰어 즉각 싱크 가이드</h4>
                    
                    <p className="text-xs text-gray-400 leading-relaxed">
                      현재 사이트는 <strong>실시간 클라우드 DB</strong>를 기반으로 동작 중입니다. PC와 모바일 디바이스 간에 실시간으로 데이터가 물 흐르듯 동기화됩니다!
                    </p>

                    <div className="space-y-3.5 pt-2 text-xs">
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                        <p className="text-gray-400">오른쪽 스마트폰 화면은 실제 모바일 스크린 환경의 해상도를 100% 가상 시뮬레이트한 프레임입니다.</p>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                        <p className="text-gray-400">상단 <strong>"기본 설정"</strong>, <strong>"포트폴리오"</strong>, <strong>"글/공지사항"</strong> 에서 저장 버튼을 누를 때마다, 오른쪽 단말 미리보기가 자동으로 리스타트되어 반영 상을 표시해 줍니다.</p>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                        <p className="text-gray-400">모바일에 맞게 로고, 헤드라인, 글꼴 테마, 그리고 포트폴리오 카드 그리드가 한 줄로 깔끔이 자동 조율되는 레이아웃을 스크롤 해보실 수 있습니다.</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">선택 가상 디바이스</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" className="px-3 py-2 bg-sky-500/10 border border-sky-500/40 text-sky-400 text-xs rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer">
                          <span>iPhone 15 Pro (Compact)</span>
                        </button>
                        <button type="button" className="px-3 py-2 bg-white/5 border border-white/5 text-gray-400 hover:text-white text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer">
                          <span>Galaxy Ultra (Fluid)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 text-[11px] text-sky-300 leading-normal">
                    📌 <strong>팁:</strong> 모바일 뷰어 내부에서도 문의 작성(의뢰접수), 텔레그램 연동, 퀵 네비게이션 앵커 서핑이 손가락 터치 제스처처럼 드래그/스크롤하여 정밀 가동됩니다!
                  </div>
                </div>

                {/* Device simulator Bezel Frame on the right */}
                <div className="lg:col-span-7 flex justify-center py-4">
                  
                  {/* Smartphone outer body casing */}
                  <div className="relative mx-auto w-[360px] h-[720px] rounded-[52px] border-[12px] border-zinc-800 bg-black shadow-[0_30px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden ring-4 ring-zinc-700/20">
                    
                    {/* Metal premium volume & lock line decorations */}
                    <div className="absolute top-[100px] left-[-12px] w-1 h-12 bg-zinc-600 rounded-r-sm z-30" />
                    <div className="absolute top-[150px] left-[-12px] w-1.2 h-14 bg-zinc-600 rounded-r-sm z-30" />
                    <div className="absolute top-[120px] right-[-12px] w-1.2 h-16 bg-zinc-600 rounded-l-sm z-30" />

                    {/* Camera notch / island mock */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-40 flex items-center justify-center shadow-inner">
                      <div className="w-12 h-2.5 bg-black rounded-full mr-2.5 flex items-center justify-end pr-1">
                        <div className="w-1 h-1 bg-sky-900 rounded-full animate-pulse" />
                      </div>
                      <div className="w-3.5 h-3.5 bg-zinc-900 rounded-full border border-zinc-950 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-blue-950/80 rounded-full flex items-center justify-center">
                          <div className="w-0.5 h-0.5 bg-cyan-400 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Device Status bar */}
                    <div className="h-8 bg-black/95 px-6 pt-1 flex justify-between items-center text-[10px] text-gray-400 font-mono z-30 shrink-0 select-none border-b border-white/5 animate-none">
                      <span className="font-semibold text-[9.5px]">RubySim 5G</span>
                      <span className="text-[10px] pl-3">12:12</span>
                      <div className="flex items-center space-x-1.5">
                        {/* Wifi icon */}
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.9 9.9 0 0114.14 0M1.414 7.5a15 15 0 0121.172 0" />
                        </svg>
                        {/* Battery mock */}
                        <div className="w-5 h-2.5 border border-gray-400 rounded-sm p-0.5 flex items-center">
                          <div className="w-3 h-1.2 bg-emerald-500 rounded-3xs" />
                        </div>
                      </div>
                    </div>

                    {/* IFrame Viewport serving live webpage */}
                    <div className="flex-1 w-full relative z-10 bg-black">
                      <iframe 
                        key={iframeRefKey}
                        src={window.location.origin + "/"}
                        title="RubySolution Mobile Sim"
                        className="w-full h-full border-none bg-black"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Home indicator bar at bottom */}
                    <div className="h-6 bg-black flex items-center justify-center pb-2 shrink-0 z-30 select-none font-sans">
                      <div className="w-32 h-1 bg-white/30 rounded-full" />
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* PORTFOLIO EDIT / CREATE MODAL */}
      <AnimatePresence>
        {openPortfolioModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenPortfolioModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-black leading-none mb-2">
                {editingPortfolio ? '포트폴리오 정보 수정' : '새로운 우수 포트폴리오 추가'}
              </h3>
              <p className="text-xs text-gray-500 mb-6">고객사와 분류, 시각자료 해설을 탑재합니다.</p>

              <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 font-semibold">프로젝트 타이틀 *</label>
                  <input type="text" required value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="루미너스 뷰티 리브랜딩" className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1 font-semibold">카테고리 *</label>
                    <select value={pCategory} onChange={(e: any) => setPCategory(e.target.value)} className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
                      <option value="로고 디자인">로고 디자인</option>
                      <option value="광고/PR">광고/PR</option>
                      <option value="종합 브랜딩">종합 브랜딩</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1 font-semibold">고객사 명</label>
                    <input type="text" value={pClient} onChange={(e) => setPClient(e.target.value)} placeholder="아우라 뷰티그룹" className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400 font-semibold">인증 작품 대표 일러스트 이미지 *</label>
                    <span className="text-[10px] text-gray-500 font-medium">직접 업로드 또는 웹 URL 입력</span>
                  </div>

                  {/* Image Live Preview */}
                  {pImageUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center group">
                      <img 
                        src={pImageUrl} 
                        alt="Portfolio Preview" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setPImageUrl('')}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all transform scale-90 group-hover:scale-100 cursor-pointer"
                        >
                          이미지 지우기 / 재설정
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Method A: Direct URL */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] text-gray-500 font-mono">선택 A: 이미지 웹 링크 URL 기입</span>
                      <input 
                        type="url" 
                        value={pImageUrl.startsWith('data:') ? '' : pImageUrl} 
                        onChange={(e) => setPImageUrl(e.target.value)} 
                        placeholder="https://images.unsplash.com/..." 
                        className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500 w-full" 
                      />
                    </div>

                    {/* Method B: Direct File Upload */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] text-gray-500 font-mono">선택 B: 기기 내 파일 첨부하기</span>
                      <label 
                        className="border border-dashed border-white/20 hover:border-sky-500/50 bg-black hover:bg-sky-500/5 rounded-xl px-3 py-2 text-xs text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-1.5 text-center h-[32px]"
                        style={{ lineHeight: '1' }}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="truncate">컴퓨터에서 파일 검색</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressedDataUrl = await compressImage(file);
                                setPImageUrl(compressedDataUrl);
                              } catch (err) {
                                console.error('Image compression failed, using original', err);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setPImageUrl(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 font-semibold">프로젝트 결과 세부 묘사 *</label>
                  <textarea rows={4} required value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="챌린지와 크리에이티브 시각 가치 해결 내용을 적어주세요." className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white leading-relaxed resize-none" />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setOpenPortfolioModal(false)} className="px-4 py-2 border border-white/10 text-xs rounded-xl hover:text-white">취소</button>
                  <button type="submit" className="px-5 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200">저장 제출</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BLOG EDIT / CREATE MODAL */}
      <AnimatePresence>
        {openBlogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenBlogModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-black leading-none mb-2">
                {editingBlog ? '블로그 칼럼/공지사항 수정' : '새로운 아티클 소셜 퍼블리싱'}
              </h3>
              <p className="text-xs text-gray-500 mb-6">칼럼형식 본문과 메타 썸네일 경로를 수려하게 렌더링합니다.</p>

              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 font-semibold">글 제목 *</label>
                  <input type="text" required value={bTitle} onChange={(e) => setBTitle(e.target.value)} placeholder="2026 브랜드 로고 디자인 트렌드" className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 font-semibold">원고 기획/저자</label>
                  <input type="text" value={bAuthor} onChange={(e) => setBAuthor(e.target.value)} placeholder="루비 디자인 기획팀" className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400 font-semibold">대표 썸네일 이미지 *</label>
                    <span className="text-[10px] text-gray-500 font-medium">직접 업로드 또는 웹 URL 입력</span>
                  </div>

                  {/* Image Live Preview */}
                  {bImageUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center group">
                      <img 
                        src={bImageUrl} 
                        alt="Blog Preview" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541462608141-2ff030de122a?w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setBImageUrl('')}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold transition-all transform scale-90 group-hover:scale-100 cursor-pointer"
                        >
                          이미지 지우기 / 재설정
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Method A: Direct URL */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] text-gray-500 font-mono">선택 A: 이미지 웹 링크 URL 기입</span>
                      <input 
                        type="url" 
                        value={bImageUrl.startsWith('data:') ? '' : bImageUrl} 
                        onChange={(e) => setBImageUrl(e.target.value)} 
                        placeholder="https://images.unsplash.com/..." 
                        className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500 w-full" 
                      />
                    </div>

                    {/* Method B: Direct File Upload */}
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9px] text-gray-500 font-mono">선택 B: 기기 내 파일 첨부하기</span>
                      <label 
                        className="border border-dashed border-white/20 hover:border-sky-500/50 bg-black hover:bg-sky-500/5 rounded-xl px-3 py-2 text-xs text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-1.5 text-center h-[32px]"
                        style={{ lineHeight: '1' }}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="truncate">컴퓨터에서 파일 검색</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressedDataUrl = await compressImage(file);
                                setBImageUrl(compressedDataUrl);
                              } catch (err) {
                                console.error('Image compression failed, using original', err);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setBImageUrl(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 font-semibold">본문 요약 설명 (리스트 보드용) *</label>
                  <input type="text" required value={bSummary} onChange={(e) => setBSummary(e.target.value)} placeholder="2026년 크리에이티브 글로벌 리브랜딩 지향점에 대해 논합니다." className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1 font-semibold font-mono">칼럼 에세이 본문 서술 (###을 줄 맨 앞에 붙이면 중제목 헤더가 됩니다) *</label>
                  <textarea rows={6} required value={bContent} onChange={(e) => setBContent(e.target.value)} placeholder="내용을 적고 구조화 하세요..." className="bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white leading-relaxed resize-none" />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setOpenBlogModal(false)} className="px-4 py-2 border border-white/10 text-xs rounded-xl hover:text-white">취소</button>
                  <button type="submit" className="px-5 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200">배포 시작</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
