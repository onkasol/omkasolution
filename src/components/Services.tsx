import React from 'react';
import { useCMS } from '../CMSContext';
import { Paintbrush, MessageSquare, Compass, BarChart4, ChevronRight, Laptop, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const Services: React.FC = () => {
  const { settings } = useCMS();

  const serviceList = [
    {
      title: "Premium Logo Design",
      koreanTitle: settings.service1Title || "프리미엄 로고 디자인 & 브랜딩",
      icon: Paintbrush,
      description: settings.service1Desc || "브랜드가 가진 단 하나의 철학을 정교하고 럭셔리하게 시각화합니다. 온카솔루션의 로고 디자인은 단순 기호 축소를 넘어, 수십 년 간 지속될 가치를 창조합니다.",
      deliverables: (settings.service1Deliverables || "워드마크, 그래픽 심볼, 시그니처 콤비네이션 설계\n풀 패키지 브랜딩 가이드북 (색상, 서체, 비율 규칙 구성)\nBI 어플리케이션 시스템 (비즈니스 서식류, 명함, 봉투 구성)\n독점적 지적재산 특허상표 사전 출원 검토 및 정밀 가이드").split('\n').filter(Boolean),
      tag: settings.service1Tag || "LOGO & BRANDING"
    },
    {
      title: "Advertising & PR",
      koreanTitle: settings.service2Title || "통합 광고 & PR 대행 솔루션",
      icon: MessageSquare,
      description: settings.service2Desc || "감각적인 비주얼에 데이터를 결합하여 마케팅 파급력을 극대화합니다. 대중의 반응을 설계하고 미디어 버즈를 유도하는 웅장한 PR 로드맵이 제공됩니다.",
      deliverables: (settings.service2Deliverables || "통합 브랜드 스토리 메이킹 & 차별화 바이럴 슬로건 카피 수립\n온·오프라인 크리에이티브 키-비주얼(Key-Visual) 그래픽 광고안 제작\n메이저 언론 보도 배포 및 공신력 기반 언론 연합 PR 대행\n인플루언서 연계 소셜 미디어 인스턴트 기획 및 통합 퍼포먼스 마케팅").split('\n').filter(Boolean),
      tag: settings.service2Tag || "ADVERTISING & PR"
    }
  ];

  return (
    <section id="services" className="py-24 bg-zinc-950 text-white relative border-y border-white/5 scroll-mt-20">
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px]" 
             style={{ backgroundColor: settings.accentColor }} />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full filter blur-[100px]" 
             style={{ backgroundColor: `${settings.accentColor}cc` }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl mb-6 md:mb-0">
            <span className="text-xs font-mono uppercase tracking-widest block mb-3 animate-pulse" style={{ color: settings.accentColor }}>
              {settings.servicesSubtitle || 'OUR EXPERTISE'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white whitespace-pre-line leading-tight">
              {settings.servicesTitle || "온카솔루션의 독보적인\n크리에이티브 대행 설계"}
            </h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed whitespace-pre-line">
            {settings.servicesDesc || "비즈니스 형태에 가장 잘 어울리는 고급 시각 정체성을 확립하고, 혁신적인 광고 PR 캠페인으로 확실한 우수한 시장 성과를 증명해 상생 가치를 창출합니다."}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {serviceList.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-black/40 border border-white/5 rounded-3xl p-8 sm:p-10 relative overflow-hidden group hover:border-white/10 transition-all"
                style={{ 
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Accent border glow effect on hover */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-white/5 group-hover:to-transparent duration-500 transition-all" 
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Service Top header */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full uppercase">
                      {service.tag}
                    </span>
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110 duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${settings.accentColor}22, #000)`,
                        boxShadow: `0 0 15px ${settings.accentColor}1A`
                      }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: settings.accentColor }} />
                    </div>
                  </div>

                  {/* Service Content */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white group-hover:text-sky-300 transition-colors">
                    {service.koreanTitle}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="space-y-4 border-t border-white/5 pt-8 mt-auto">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-gray-500">
                      DELIVERABLES & PROCESS
                    </h4>
                    <ul className="space-y-2.5">
                      {service.deliverables.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start text-xs sm:text-sm text-gray-300">
                          <ChevronRight className="w-4 h-4 mr-2 shrink-0 mt-0.5" style={{ color: settings.accentColor }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sub-features line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/5">
          <div className="flex items-start space-x-3">
            <Laptop className="w-5 h-5 text-gray-500 mt-0.5" style={{ color: settings.accentColor }} />
            <div>
              <h5 className="text-sm font-semibold text-white">{settings.highlight1Title || "1:1 총괄 전담제 기획"}</h5>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                {settings.highlight1Desc || "디렉터급 디자이너 및 마케터가 첫 컨설팅부터 최종 파일 배포까지 일대일 직접 소통을 보장합니다."}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-gray-500 mt-0.5" style={{ color: settings.accentColor }} />
            <div>
              <h5 className="text-sm font-semibold text-white">{settings.highlight2Title || "시각 검증 및 수정 프리패스"}</h5>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                {settings.highlight2Desc || "작업 결과물의 세련성 조율을 위한 넉넉한 피드백 라운드를 지원하여 완결성 높은 최종본을 추출해 냅니다."}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:col-span-2 lg:col-span-1">
            <BookOpen className="w-5 h-5 text-gray-500 mt-0.5" style={{ color: settings.accentColor }} />
            <div>
              <h5 className="text-sm font-semibold text-white">{settings.highlight3Title || "업종별 특허 상표 안심 지원"}</h5>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                {settings.highlight3Desc || "특허등록 불가 가능성에 대한 철저한 유관 업계 조사 스크리닝 가이드를 기본 배포해 안심하고 사용합니다."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
