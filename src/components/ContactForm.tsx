import React, { useState, useEffect } from 'react';
import { useCMS } from '../CMSContext';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, ExternalLink, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactForm: React.FC = () => {
  const { settings, addInquiry } = useCMS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const list = settings.contactCategories
      ? settings.contactCategories.split(',').map(s => s.trim()).filter(Boolean)
      : ['로고 디자인', '광고/PR', '기타 문의'];
    if (list.length > 0 && !list.includes(serviceCategory)) {
      setServiceCategory(list[0]);
    }
  }, [settings.contactCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      alert('모든 필수 항목을 기입해 주시기 바랍니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Firestore DB 저장
      await addInquiry({
        name,
        email,
        phone,
        serviceCategory,
        message
      });

      // 2. Formspree API 전송
      const response = await fetch('https://formspree.io/f/xykaljnq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          category: serviceCategory,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      setIsSuccess(true);
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      alert('의뢰 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-black text-white relative scroll-mt-20">
      
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full filter blur-[100px]" 
             style={{ backgroundColor: settings.accentColor }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span 
            className="text-xs font-mono uppercase tracking-widest block mb-3"
            style={{ color: settings.accentColor }}
          >
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 whitespace-pre-line">
            {settings.contactTitle || '새로운 성공의 궤적을 그리다'}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed whitespace-pre-line">
            {settings.contactDesc || '로고 디자인부터 타겟 맞춤 광고 매체 PR 대행까지, 루비솔루션의 디자인 사단과 마케팅 연구소가 동행할 프로젝트에 대한 의뢰를 접수합니다.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact details Card */}
            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="text-lg font-bold mb-2 text-white">직접 연락 채널</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 font-mono uppercase">OFFICE CHANNELS & WORKING HOURS</p>
              
              <div className="flex items-center space-x-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                  style={{ background: `linear-gradient(135deg, ${settings.accentColor}1A, #000)` }}
                >
                  <Mail className="w-4 h-4" style={{ color: settings.accentColor }} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">EMAIL</span>
                  <a href={`mailto:${settings.email || 'contact@ruby.solution'}`} className="text-sm font-semibold text-gray-200 hover:text-white hover:underline transition-colors block">
                    {settings.email || 'contact@ruby.solution'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                  style={{ background: `linear-gradient(135deg, ${settings.accentColor}1A, #000)` }}
                >
                  <Phone className="w-4 h-4" style={{ color: settings.accentColor }} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">TEL / HOTLINE</span>
                  <a href={`tel:${settings.phone || '02-1234-5678'}`} className="text-sm font-semibold text-gray-200 hover:text-white hover:underline transition-colors block font-mono">
                    {settings.phone || '02-1234-5678'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                  style={{ background: `linear-gradient(135deg, ${settings.accentColor}1A, #000)` }}
                >
                  <MapPin className="w-4 h-4" style={{ color: settings.accentColor }} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">OFFICE ADDRESS</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-300 block">
                    {settings.address || '서울특별시 강남구 테헤란로 518, 디타워 14층'}
                  </span>
                </div>
              </div>
            </div>

            {/* Telegram & Social glow Card */}
            <div 
              className="rounded-3xl p-8 relative overflow-hidden group border border-sky-400/10 text-white flex flex-col justify-between h-56"
              style={{
                background: 'linear-gradient(135deg, #0c1a2c 0%, #050d18 100%)',
                boxShadow: '0 4px 25px rgba(0, 162, 255, 0.1)'
              }}
            >
              <div>
                <div className="flex items-center space-x-2 text-sky-400 mb-2 font-black">
                  <svg className="w-5 h-5 fill-sky-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.19 15.51 16.03C15.37 16.8 15.08 17.06 14.81 17.09C14.21 17.15 13.76 16.7 13.18 16.32C12.27 15.73 11.76 15.37 10.88 14.79C9.86 14.12 10.52 13.75 11.1 13.15C11.25 12.99 13.9 10.57 13.95 10.36C13.96 10.33 13.96 10.22 13.9 10.17C13.84 10.12 13.75 10.14 13.68 10.15C13.59 10.17 12.2 11.09 9.49 12.92C9.09 13.19 8.73 13.33 8.41 13.32C8.06 13.31 7.38 13.12 6.88 12.96C6.26 12.76 5.76 12.65 5.8 12.31C5.83 12.13 6.07 11.95 6.54 11.76C9.43 10.51 11.36 9.68 12.33 9.28C15.1 8.12 15.67 7.92 16.05 7.92C16.13 7.92 16.31 7.94 16.43 8.04C16.53 8.12 16.56 8.24 16.57 8.32C16.58 8.41 16.6 8.62 16.64 8.8Z" />
                  </svg>
                  <span className="text-base font-extrabold font-sans">텔레그램 실시간 상담</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed max-w-sm mt-3">
                  기본 서식 작성 전, 대략적인 견적 가이드나 빠른 스케줄 선점을 원하시면 텔레그램 실시간 상담 채널을 활용하세요.
                </p>
              </div>

              <a 
                href={settings.telegramLink || "https://t.me/ruby_solution"}
                target="_blank" 
                rel="noreferrer"
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-[#24A1DE] to-[#2AABEE] text-white text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(36,161,222,0.3)] hover:scale-[1.02] active:scale-95 duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
                id="telegram-btn"
              >
                <span>루비 텔레그램 문의하기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-white/5 rounded-3xl p-8 sm:p-10 relative">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold leading-none mb-2 text-white">서식 기반 의뢰 접수</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-mono uppercase mb-6">PROJECT SPECIFICATION FORM</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="flex flex-col">
                      <label className="text-xs font-mono text-gray-400 uppercase mb-2 font-semibold">
                        의뢰인 성함 / 직함 <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="대표님"
                        className="bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="flex flex-col">
                      <label className="text-xs font-mono text-gray-400 uppercase mb-2 font-semibold">
                        연락처(휴대폰) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:font-mono transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 uppercase mb-2 font-semibold">
                      회신용 이메일 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="minsoo@enterprise.com"
                      className="bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  {/* Service Selection dropdown */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 uppercase mb-2 font-semibold">
                      필요 기획 분야 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(settings.contactCategories
                        ? settings.contactCategories.split(',').map(s => s.trim()).filter(Boolean)
                        : ['로고 디자인', '광고/PR', '기타 문의']
                      ).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setServiceCategory(cat)}
                          className={`py-3 px-1 sm:px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer truncate ${
                            serviceCategory === cat
                              ? 'text-black font-extrabold'
                              : 'bg-black/60 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                          }`}
                          style={serviceCategory === cat ? {
                            backgroundColor: settings.accentColor || '#00a2ff',
                            borderColor: 'transparent'
                          } : {}}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message details input */}
                  <div className="flex flex-col">
                    <label className="text-xs font-mono text-gray-400 uppercase mb-2 font-semibold">
                      의뢰 및 요구사항 세부설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder=""
                      className="bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors leading-relaxed resize-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-sm font-bold text-white transition-all overflow-hidden relative group cursor-pointer"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>의뢰서 안심 제출 중...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>루비 크리에이티브 파트너 제안 접수</span>
                      </span>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-500 font-mono">
                    본 접수서는 암호화된 통신 보안 로직을 거쳐 안전하게 루비 대표 단말기로 자동 보고됩니다.
                  </p>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-6"
                >
                  <CheckCircle className="w-16 h-16 text-emerald-400 animate-pulse" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">성공적으로 접수되었습니다.</h3>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                      감사합니다. 귀사의 미래 가치를 빛낼 최상급 솔루션을 기획하기 위해 루비 전담 디렉터가 24시간 내에 회신 연락 메일을 송신해 올리겠습니다.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl w-full max-w-sm text-left space-y-2 text-xs font-mono text-gray-400">
                    <p className="flex justify-between border-b border-white/5 pb-2">
                      <span>의뢰 카테고리:</span>
                      <span className="text-white font-bold">{serviceCategory}</span>
                    </p>
                    <p className="text-center text-[10px] text-gray-500 pt-1">
                      (관리자 대시보드에서 실시간 접수 여부를 바로 확인할 수 있습니다)
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                    }}
                    className="px-6 py-2.5 border border-white/10 hover:border-white/20 bg-white/5 rounded-xl text-xs font-semibold hover:text-white transition-all cursor-pointer text-gray-300"
                  >
                    새로운 의뢰 추가 제출
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
