import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, PortfolioItem, BlogPost, ContactInquiry } from './types';
import { defaultSettings, defaultPortfolio, defaultBlog, defaultInquiries } from './defaultData';
import { db, isRealFirebase, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface CMSContextType {
  settings: SiteSettings;
  portfolio: PortfolioItem[];
  blog: BlogPost[];
  inquiries: ContactInquiry[];
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  currentUser: any;
  loading: boolean;
  isAdminPath: boolean;
  hasPinUnlocked: boolean;
  setHasPinUnlocked: (unlocked: boolean) => void;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, 'createdAt'>) => Promise<void>;
  updatePortfolioItem: (item: PortfolioItem) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, 'createdAt'>) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  triggerReset: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Path / routing detection for admin
  const [isAdminPath, setIsAdminPath] = useState<boolean>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || path.endsWith('/admin') || hash === '#/admin' || hash === '#admin';
  });

  const [hasPinUnlocked, setHasPinUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('ruby_admin_unlocked') === 'true';
  });

  // Automatically monitor and sync URL updates for Hidden Admin access
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const onAdmin = path === '/admin' || path.endsWith('/admin') || hash === '#/admin' || hash === '#admin';
      setIsAdminPath(onAdmin);

      // Force admin mode based on authentication and URL matching
      const unlocked = sessionStorage.getItem('ruby_admin_unlocked') === 'true';
      if (onAdmin && unlocked) {
        setIsAdminMode(true);
      } else if (!onAdmin) {
        setIsAdminMode(false);
      }
    };

    checkPath();

    window.addEventListener('popstate', checkPath);
    window.addEventListener('hashchange', checkPath);
    return () => {
      window.removeEventListener('popstate', checkPath);
      window.removeEventListener('hashchange', checkPath);
    };
  }, []);

  // Authentication monitoring
  useEffect(() => {
    let unsubscribeAuth: any = () => {};
    
    if (isRealFirebase && auth) {
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });
    } else {
      // Mock auth recovery
      const localUser = localStorage.getItem('ruby_mock_user');
      if (localUser) {
        setCurrentUser(JSON.parse(localUser));
      }
    }

    return () => unsubscribeAuth();
  }, []);

  // Syncing / Loading Database State
  useEffect(() => {
    setLoading(true);

    if (isRealFirebase && db) {
      console.log('Attaching realtime Firestore sync listeners...');
      
      // 1. Sync Settings
      const unsubSettings = onSnapshot(doc(db, 'settings', 'site_config'), (snapshot) => {
        if (snapshot.exists()) {
          const loaded = snapshot.data() as SiteSettings;
          // Check if we need to migrate or append telegramLink/services/portfolio/blog/footer settings
          if (loaded.accentColor === '#a855f7' || !loaded.telegramLink || loaded.heroCtaText === '프로젝트 의뢰하기' || !loaded.servicesTitle || !loaded.portfolioTitle || !loaded.blogTitle || !loaded.footerDesc || !loaded.footerTitle || !loaded.representative || !loaded.contactTitle || !loaded.contactDesc || !loaded.contactCategories) {
            const migrated = {
              ...defaultSettings,
              ...loaded,
              accentColor: loaded.accentColor === '#a855f7' ? '#00a2ff' : loaded.accentColor,
              heroCtaText: loaded.heroCtaText === '프로젝트 의뢰하기' ? '텔레그램 문의하기' : loaded.heroCtaText,
              telegramLink: loaded.telegramLink || 'https://t.me/ruby_solution',
              footerDesc: loaded.footerDesc || defaultSettings.footerDesc,
              footerTitle: loaded.footerTitle || defaultSettings.footerTitle,
              representative: loaded.representative || defaultSettings.representative,
              contactTitle: loaded.contactTitle || defaultSettings.contactTitle,
              contactDesc: loaded.contactDesc || defaultSettings.contactDesc,
              contactCategories: loaded.contactCategories || defaultSettings.contactCategories
            };
            setSettings(migrated);
            setDoc(doc(db, 'settings', 'site_config'), migrated)
              .catch(err => console.error('Error writing migrated settings to Firestore:', err));
          } else {
            setSettings(loaded);
          }
        } else {
          // Auto-seed default settings
          setDoc(doc(db, 'settings', 'site_config'), defaultSettings)
            .then(() => setSettings(defaultSettings))
            .catch(err => console.error('Error seeding settings:', err));
        }
      }, (error) => {
        console.error('Snapshot listen failed on settings:', error);
      });

      // 2. Sync Portfolio
      const unsubPortfolio = onSnapshot(collection(db, 'portfolio'), (snapshot) => {
        const items: PortfolioItem[] = [];
        snapshot.forEach((snapDoc) => {
          items.push(snapDoc.data() as PortfolioItem);
        });
        
        if (items.length === 0) {
          // Seed portfolio initial data
          Promise.all(
            defaultPortfolio.map(item => setDoc(doc(db, 'portfolio', item.id), item))
          ).catch(err => console.error('Error seeding portfolio:', err));
          setPortfolio(defaultPortfolio);
        } else {
          setPortfolio(items.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
        }
      }, (error) => {
        console.error('Snapshot listen failed on portfolio:', error);
      });

      // 3. Sync Blog
      const unsubBlog = onSnapshot(collection(db, 'blog'), (snapshot) => {
        const items: BlogPost[] = [];
        snapshot.forEach((snapDoc) => {
          items.push(snapDoc.data() as BlogPost);
        });
        
        if (items.length === 0) {
          // Seed blog initial data
          Promise.all(
            defaultBlog.map(post => setDoc(doc(db, 'blog', post.id), post))
          ).catch(err => console.error('Error seeding blog:', err));
          setBlog(defaultBlog);
        } else {
          setBlog(items.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
        }
      }, (error) => {
        console.error('Snapshot listen failed on blog:', error);
      });

      // 4. Sync Inquiries
      const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
        const items: ContactInquiry[] = [];
        snapshot.forEach((snapDoc) => {
          items.push(snapDoc.data() as ContactInquiry);
        });
        setInquiries(items.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
        setLoading(false);
      }, (error) => {
        console.error('Snapshot listen failed on inquiries:', error);
        setLoading(false);
      });

      return () => {
        unsubSettings();
        unsubPortfolio();
        unsubBlog();
        unsubInquiries();
      };
    } else {
      // Local Storage Fallback Mode
      console.log('Restoring CMS data from LocalStorage...');
      
      const storedSettings = localStorage.getItem('onka_cms_settings');
      const storedPortfolio = localStorage.getItem('onka_cms_portfolio');
      const storedBlog = localStorage.getItem('onka_cms_blog');
      const storedInquiries = localStorage.getItem('onka_cms_inquiries');

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        localStorage.setItem('onka_cms_settings', JSON.stringify(defaultSettings));
        setSettings(defaultSettings);
      }

      if (storedPortfolio) {
        setPortfolio(JSON.parse(storedPortfolio));
      } else {
        localStorage.setItem('onka_cms_portfolio', JSON.stringify(defaultPortfolio));
        setPortfolio(defaultPortfolio);
      }

      if (storedBlog) {
        setBlog(JSON.parse(storedBlog));
      } else {
        localStorage.setItem('onka_cms_blog', JSON.stringify(defaultBlog));
        setBlog(defaultBlog);
      }

      if (storedInquiries) {
        setInquiries(JSON.parse(storedInquiries));
      } else {
        localStorage.setItem('onka_cms_inquiries', JSON.stringify(defaultInquiries));
        setInquiries(defaultInquiries);
      }

      setLoading(false);
    }
  }, []);

  // Update site-wide CMS settings
  const updateSettings = async (newSettings: SiteSettings) => {
    // Update local state immediately for instant feedback
    setSettings(newSettings);
    if (isRealFirebase && db) {
      const path = 'settings/site_config';
      try {
        await setDoc(doc(db, 'settings', 'site_config'), newSettings);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      localStorage.setItem('onka_cms_settings', JSON.stringify(newSettings));
    }
  };

  // Add Portfolio Item
  const addPortfolioItem = async (item: Omit<PortfolioItem, 'createdAt'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newItem: PortfolioItem = {
      ...item,
      createdAt: todayStr
    };

    if (isRealFirebase && db) {
      const path = `portfolio/${newItem.id}`;
      try {
        await setDoc(doc(db, 'portfolio', newItem.id), newItem);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      const updatedList = [newItem, ...portfolio];
      localStorage.setItem('onka_cms_portfolio', JSON.stringify(updatedList));
      setPortfolio(updatedList);
    }
  };

  // Update Portfolio Item
  const updatePortfolioItem = async (item: PortfolioItem) => {
    if (isRealFirebase && db) {
      const path = `portfolio/${item.id}`;
      try {
        await setDoc(doc(db, 'portfolio', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const updatedList = portfolio.map(i => i.id === item.id ? item : i);
      localStorage.setItem('onka_cms_portfolio', JSON.stringify(updatedList));
      setPortfolio(updatedList);
    }
  };

  // Delete Portfolio Item
  const deletePortfolioItem = async (id: string) => {
    if (isRealFirebase && db) {
      const path = `portfolio/${id}`;
      try {
        await deleteDoc(doc(db, 'portfolio', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const updatedList = portfolio.filter(i => i.id !== id);
      localStorage.setItem('onka_cms_portfolio', JSON.stringify(updatedList));
      setPortfolio(updatedList);
    }
  };

  // Add Blog Post
  const addBlogPost = async (post: Omit<BlogPost, 'createdAt'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newPost: BlogPost = {
      ...post,
      createdAt: todayStr
    };

    if (isRealFirebase && db) {
      const path = `blog/${newPost.id}`;
      try {
        await setDoc(doc(db, 'blog', newPost.id), newPost);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      const updatedList = [newPost, ...blog];
      localStorage.setItem('onka_cms_blog', JSON.stringify(updatedList));
      setBlog(updatedList);
    }
  };

  // Update Blog Post
  const updateBlogPost = async (post: BlogPost) => {
    if (isRealFirebase && db) {
      const path = `blog/${post.id}`;
      try {
        await setDoc(doc(db, 'blog', post.id), post);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const updatedList = blog.map(p => p.id === post.id ? post : p);
      localStorage.setItem('onka_cms_blog', JSON.stringify(updatedList));
      setBlog(updatedList);
    }
  };

  // Delete Blog Post
  const deleteBlogPost = async (id: string) => {
    if (isRealFirebase && db) {
      const path = `blog/${id}`;
      try {
        await deleteDoc(doc(db, 'blog', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const updatedList = blog.filter(p => p.id !== id);
      localStorage.setItem('onka_cms_blog', JSON.stringify(updatedList));
      setBlog(updatedList);
    }
  };

  // Add Contact Inquiry (For customer submissions)
  const addInquiry = async (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => {
    const randomId = 'inquiry-' + Math.random().toString(36).substr(2, 9);
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: randomId,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    if (isRealFirebase && db) {
      const path = `inquiries/${newInquiry.id}`;
      try {
        await setDoc(doc(db, 'inquiries', newInquiry.id), newInquiry);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      const updatedList = [newInquiry, ...inquiries];
      localStorage.setItem('onka_cms_inquiries', JSON.stringify(updatedList));
      setInquiries(updatedList);
    }
  };

  // Update Inquiry Status (Admin reading or replying)
  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    let found = inquiries.find(i => i.id === id);
    if (!found) return;

    const updatedInquiry: ContactInquiry = { ...found, status };

    if (isRealFirebase && db) {
      const path = `inquiries/${id}`;
      try {
        await setDoc(doc(db, 'inquiries', id), updatedInquiry);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const updatedList = inquiries.map(i => i.id === id ? updatedInquiry : i);
      localStorage.setItem('onka_cms_inquiries', JSON.stringify(updatedList));
      setInquiries(updatedList);
    }
  };

  // Delete Inquiry
  const deleteInquiry = async (id: string) => {
    if (isRealFirebase && db) {
      const path = `inquiries/${id}`;
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const updatedList = inquiries.filter(i => i.id !== id);
      localStorage.setItem('onka_cms_inquiries', JSON.stringify(updatedList));
      setInquiries(updatedList);
    }
  };

  // Reset to default CMS presets
  const triggerReset = async () => {
    if (window.confirm('모든 데이터를 최초의 웅장한 루비솔루션 기본 테마 데이터로 온전히 복구하시겠습니까? (이 작업은 되돌릴 수 없습니다)')) {
      if (isRealFirebase && db) {
        try {
          // Overwrite Settings
          await setDoc(doc(db, 'settings', 'site_config'), defaultSettings);
          
          // Overwrite Portfolio items
          for (const item of defaultPortfolio) {
            await setDoc(doc(db, 'portfolio', item.id), item);
          }

          // Overwrite Blog posts
          for (const post of defaultBlog) {
            await setDoc(doc(db, 'blog', post.id), post);
          }

          // Overwrite Inquiries
          for (const inq of defaultInquiries) {
            await setDoc(doc(db, 'inquiries', inq.id), inq);
          }

          alert('클라우드 DB에 모든 루비 에센셜 데이터 복구가 완료되었습니다!');
        } catch (e) {
          console.error(e);
          alert('데이터 복구 중 오류가 발생했습니다: ' + (e instanceof Error ? e.message : String(e)));
        }
      } else {
        localStorage.setItem('onka_cms_settings', JSON.stringify(defaultSettings));
        localStorage.setItem('onka_cms_portfolio', JSON.stringify(defaultPortfolio));
        localStorage.setItem('onka_cms_blog', JSON.stringify(defaultBlog));
        localStorage.setItem('onka_cms_inquiries', JSON.stringify(defaultInquiries));
        setSettings(defaultSettings);
        setPortfolio(defaultPortfolio);
        setBlog(defaultBlog);
        setInquiries(defaultInquiries);
        alert('로컬 가상 스토리지의 루비 테마 데이터가 즉시 초기화되었습니다!');
      }
    }
  };

  return (
    <CMSContext.Provider value={{
      settings,
      portfolio,
      blog,
      inquiries,
      isAdminMode,
      setIsAdminMode,
      currentUser,
      loading,
      isAdminPath,
      hasPinUnlocked,
      setHasPinUnlocked,
      updateSettings,
      addPortfolioItem,
      updatePortfolioItem,
      deletePortfolioItem,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addInquiry,
      updateInquiryStatus,
      deleteInquiry,
      triggerReset
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
