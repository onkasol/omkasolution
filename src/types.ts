export interface SiteSettings {
  title: string;
  subtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  accentColor: string; // e.g., '#cd5c5c' or '#a855f7'
  fontStyle: 'sans' | 'serif' | 'mono';
  email: string;
  phone: string;
  address: string;
  kakaoLink: string;
  instagramLink: string;
  telegramLink?: string;
  servicesSubtitle?: string;
  servicesTitle?: string;
  servicesDesc?: string;
  service1Tag?: string;
  service1Title?: string;
  service1Desc?: string;
  service1Deliverables?: string;
  service2Tag?: string;
  service2Title?: string;
  service2Desc?: string;
  service2Deliverables?: string;
  highlight1Title?: string;
  highlight1Desc?: string;
  highlight2Title?: string;
  highlight2Desc?: string;
  highlight3Title?: string;
  highlight3Desc?: string;
  portfolioSubtitle?: string;
  portfolioTitle?: string;
  portfolioDesc?: string;
  blogSubtitle?: string;
  blogTitle?: string;
  blogDesc?: string;
  footerDesc?: string;
  footerTitle?: string;
  representative?: string;
  contactTitle?: string;
  contactDesc?: string;
  contactCategories?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: '로고 디자인' | '광고/PR' | '종합 브랜딩';
  clientName: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: '공지사항' | '디자인 트렌드' | '홍보 칼럼';
  author: string;
  content: string;
  summary: string;
  imageUrl: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}
