import { SiteSettings, PortfolioItem, BlogPost } from './types';

export const defaultSettings: SiteSettings = {
  title: "온카솔루션 | 프리미엄 로고디자인 & 광고·PR 에이전시",
  subtitle: "ONKA SOLUTION",
  heroTitle: "생각을 관통하는 디자인,\n가치를 증명하는 브랜딩",
  heroSubtitle: "온카솔루션은 브랜드의 깊이에 섬세함을 더합니다. 단순한 로고 제작을 넘어 기업 고유의 헤리티지를 담은 럭셔리 비주얼 정체성과 트렌드를 주도하는 종합 광고/PR 전략을 기획합니다.",
  heroCtaText: "텔레그램 문의하기",
  accentColor: "#00a2ff", // Elegant Telegram Blue
  fontStyle: "sans",
  email: "contact@onka.solution",
  phone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 518, 디타워 14층",
  kakaoLink: "https://open.kakao.com/o/sOnkaSolutionMock",
  instagramLink: "https://instagram.com/onka.solution",
  telegramLink: "https://t.me/onka_solution",
  servicesSubtitle: "OUR EXPERTISE",
  servicesTitle: "온카솔루션의 독보적인\n크리에이티브 대행 설계",
  servicesDesc: "비즈니스 형태에 가장 잘 어울리는 고급 시각 정체성을 확립하고, 혁신적인 광고 PR 캠페인으로 확실한 우수한 시장 성과를 증명해 상생 가치를 창출합니다.",
  service1Tag: "LOGO & BRANDING",
  service1Title: "프리미엄 로고 디자인 & 브랜딩",
  service1Desc: "브랜드가 가진 단 하나의 철학을 정교하고 럭셔리하게 시각화합니다. 온카솔루션의 로고 디자인은 단순 기호 축소를 넘어, 수십 년 간 지속될 가치를 창조합니다.",
  service1Deliverables: "워드마크, 그래픽 심볼, 시그니처 콤비네이션 설계\n풀 패키지 브랜딩 가이드북 (색상, 서체, 비율 규칙 구성)\nBI 어플리케이션 시스템 (비즈니스 서식류, 명함, 봉투 구성)\n독점적 지적재산 특허상표 사전 출원 검토 및 정밀 가이드",
  service2Tag: "ADVERTISING & PR",
  service2Title: "통합 광고 & PR 대행 솔루션",
  service2Desc: "감각적인 비주얼에 데이터를 결합하여 마케팅 파급력을 극대화합니다. 대중의 반응을 설계하고 미디어 버즈를 유도하는 웅장한 PR 로드맵이 제공됩니다.",
  service2Deliverables: "통합 브랜드 스토리 메이킹 & 차별화 바이럴 슬로건 카피 수립\n온·오프라인 크리에이티브 키-비주얼(Key-Visual) 그래픽 광고안 제작\n메이저 언론 보도 배포 및 공신력 기반 언론 연합 PR 대행\n인플루언서 연계 소셜 미디어 인스턴트 기획 및 통합 퍼포먼스 마케팅",
  highlight1Title: "1:1 총괄 전담제 기획",
  highlight1Desc: "디렉터급 디자이너 및 마케터가 첫 컨설팅부터 최종 파일 배포까지 일대일 직접 소통을 보장합니다.",
  highlight2Title: "시각 검증 및 수정 프리패스",
  highlight2Desc: "작업 결과물의 세련성 조율을 위한 넉넉한 피드백 라운드를 지원하여 완결성 높은 최종본을 추출해 냅니다.",
  highlight3Title: "업종별 특허 상표 안심 지원",
  highlight3Desc: "특허등록 불가 가능성에 대한 철저한 유관 업계 조사 스크리닝 가이드를 기본 배포해 안심하고 사용합니다.",
  portfolioSubtitle: "PORTFOLIO SHOWCASE",
  portfolioTitle: "가치를 직관으로 교체하는 작품들",
  portfolioDesc: "미적 아름다움은 기본입니다. 온카솔루션의 비주얼 포트폴리오는 비즈니스 돌파의 핵심 단서와 감동적 일체감을 자극합니다.",
  blogSubtitle: "INSIGHTS & NOTICES",
  blogTitle: "온카 디자인 트렌드 & 칼럼",
  blogDesc: "로고 디자인 마켓의 핵심 인사이트와 효과적인 마케팅 PR 전략 및 온카솔루션의 새로운 공지사항을 연재합니다.",
  footerDesc: "온카솔루션은 아너링크, 씨맥스, 스윅스, 인베스트, 이글, 더넛츠, 아이지메타등 게이밍본사와의 정식 계약을통해 영상 송출 및 국내 최저가의 카지노 알 공급을하며 심리스 또는 트렌스터 방식운영까지 운영환경에 맞춰 진행하는 최상위 맞춤형 솔루션 업체입니다",
  footerTitle: "온카솔루션",
  representative: "온카솔루션",
  contactTitle: "새로운 성공의 궤적을 그리다",
  contactDesc: "로고 디자인부터 타겟 맞춤 광고 매체 PR 대행까지, 온카솔루션의 디자인 사단과 마케팅 연구소가 동행할 프로젝트에 대한 의뢰를 접수합니다.",
  contactCategories: "로고 디자인, 광고/PR, 기타 문의"
};

export const defaultPortfolio: PortfolioItem[] = [
  {
    id: "port-1",
    title: "아우라 코스메틱스 (AURA Cosmetics)",
    category: "종합 브랜딩",
    clientName: "아우라 뷰티그룹",
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    description: "아우라 코스메틱스의 프레스티지 라인 리브랜딩 프로젝트입니다. 심플하면서도 단단한 고유의 대칭적 타이포그래피 로고와 어두운 대리석 톤의 패키지 크리에이티브를 조화시켜 최고의 전성기에 어울리는 독자적 아이덴티티를 구축하였습니다.",
    createdAt: "2026-04-12"
  },
  {
    id: "port-2",
    title: "제니스 파이낸셜 (ZENITH Financial)",
    category: "로고 디자인",
    clientName: "제니스 캐피탈",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    description: "스마트 유동 자금 매니지먼트 기업 제니스의 워드마크 및 트레이드마크 결합 심볼 디자인입니다. 끝없이 상승하는 화살표를 퍼플-딥그레이 컬러의 유기적인 기하학적 면 분할로 묘사해 현대 경제 시장의 진취성과 디지털 영속성을 동시에 상징화했습니다.",
    createdAt: "2026-05-01"
  },
  {
    id: "port-3",
    title: "루미나 가구 스튜디오 (Lumina Studio)",
    category: "로고 디자인",
    clientName: "루미나 홈즈",
    imageUrl: "https://images.unsplash.com/photo-1626785774625-ddc7c8241314?w=800&q=80",
    description: "북유럽 감성의 고급 친환경 맞춤형 원목 가구 공방 루미나의 핸드크래프트 스타일 로고입니다. 단아한 세리프 글꼴과 나무의 나이테 디테일을 모던하게 단순화한 모노그램 링 심볼을 구현하여 환경 친화적이면서 세련된 프리미엄 홈 스타일 브랜드를 정의했습니다.",
    createdAt: "2026-05-18"
  },
  {
    id: "port-4",
    title: "인피니트 테크 PR 캠페인 (Infinite Tech)",
    category: "광고/PR",
    clientName: "(주)인피니트소프트",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    description: "차세대 메타버스 컨버전스 플랫폼 런칭에 맞춘 통합 광고 및 PR 마케팅 캠페인입니다. '새로운 세상론'에 관한 강력하고 호기심 어린 슬로건 카피라이팅을 수립하고, 타겟 맞춤 미디어 배포 및 소셜 인플루언서 릴리즈를 일사불란하게 주도함으로써 전월 대비 브랜드 검색량 240% 증가를 달성했습니다.",
    createdAt: "2026-06-03"
  }
];

export const defaultBlog: BlogPost[] = [
  {
    id: "blog-1",
    title: "2026 로고 디자인 트렌드: 미니멀리즘과 네오-럭셔리의 결합",
    category: "디자인 트렌드",
    author: "온카 디자인 연구실",
    summary: "2026년 하이엔드 시장을 선도하는 브랜드 로고 트렌드를 완벽 심층 분석합니다. 극강의 디테일을 유지하는 법과 단순화의 미학에 대해 논합니다.",
    imageUrl: "https://images.unsplash.com/photo-1541462608141-2ff030de122a?w=800&q=80",
    content: `브랜드 로고 디자인은 더 이상 단순한 '심볼'에 그치지 않습니다. 2026년 글로벌 기업들이 앞다투어 비주얼 리브랜딩을 추진하며 드러난 거시적 방향성은 바로 **'네오-럭셔리(Neo-Luxury) 미니멀리즘'**입니다.

과거의 미니멀리즘이 극도의 단순함을 추구해 다소 차갑고 개성 없게 보였다면, 현재 트렌드는 미세하게 정제된 아름다움과 섬세한 비대칭성, 브랜드 헤리티지를 가미한 숨겨진 디테일(Hidden Detail)을 녹여내는 것이 특징입니다.

### 1. Serif의 회귀와 맞춤 세리프(Custom Serif)
고급 코스메틱, 라이프스타일, 그리고 패션 브랜드를 넘어서 금융 및 기술 섹터에서도 클래식함과 기품을 극대화한 세리프 타이프가 부각되고 있습니다. 기성 폰트가 아닌, 브랜드의 고유 철학에 맞춘 수제 커스텀 세리프 로고는 그 자체로 강력한 대체 불가능성을 수반합니다.

### 2. 가변형 아이덴티티 (Responsive Symbols)
인스타그램 프로필부터 오프라인 가이드북 패키지 박스까지, 가변 레이아웃에서도 특성을 잃지 않는 반응형 스마트 로고 디자인은 광고 PR 관점에서도 필수 불가결해졌습니다. 디테일을 분해하거나 단순 단색화할 때도 품격이 훼손되지 않도록 원천 설계하는 것이 디자이너의 실력입니다.

온카솔루션은 수십 가지 디바이스와 조명, 질감 테스트를 선제 검증하여 언제 어디서나 극상의 품격을 뿜어내는 '에센셜 비주얼 밸런스'를 기획합니다.`,
    createdAt: "2026-05-24"
  },
  {
    id: "blog-2",
    title: "광고/PR 대행에서 스토리텔링 마케팅이 가진 절대적인 신뢰감",
    category: "홍보 칼럼",
    author: "온카 기획총괄부",
    summary: "수많은 정보 속에서 타겟팅된 잠재고객의 뇌리에 각인되는 메시징 전략. 감성 스토리텔링의 실제 광고 연계 성공 사례를 전합니다.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    content: `소비자들은 더 이상 광고를 보지 않습니다. 그들은 '이야기'에 열광합니다. 매일 수천 개 이상의 마케팅 푸시에 피로감을 호소하는 시대에 잠재 소비자의 벽을 깨기 위한 가장 강력한 정공법은 바로 **스토리텔링(Storytelling)의 연계 기획**입니다.

단순히 '우리 제품이 저렴하고 뛰어나다'는 피치(Pitch)는 외면받기 일쑤입니다. 왜 이 디자인이 탄생했는지, 창업자가 어떤 역경 속에서 브랜드를 수호해 왔는지를 진정성 있고 웅장하게 서술할 때, 비로소 대중은 '심리적 합일감'을 느끼며 지갑을 열게 됩니다.

### 감성을 무장하고 지표로 검증하는 PR
스토리텔링은 추상적인 창작 행위가 아닙니다. 타겟 집단의 숨겨진 고통(Pain Point) 성향을 정밀 앙상블 타겟 인터뷰와 행동 패턴 빅데이터로 도출해 이를 완벽히 어루만지는 카피라이팅 시나리오를 설계해야 합니다.

온카솔루션의 홍보 PR 솔루션은 감각적인 크리에이티브 시안에 철저히 논증된 시장 검증 데이터 마크를 결합하여 고객 브랜드의 평판을 고급화하고 잠재 투자 사를 강하게 소환하는 최고의 전술을 정합 지원합니다.`,
    createdAt: "2026-06-01"
  },
  {
    id: "blog-3",
    title: "온카솔루션, '크리에이티브 코리아 2026' 최고의 브랜딩 에이전시 선정",
    category: "공지사항",
    author: "온카 대표 관리자",
    summary: "온카솔루션이 뛰어난 디자인 역량과 통합 PR 솔루션을 인정받아 올해 우수 브랜딩 파트너 대상을 수여하였습니다.",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&q=80",
    content: `안녕하세요, 온카솔루션 프리미엄 에이전시입니다.

언제나 당사를 아껴주시고 동반자적 신뢰를 아낌없이 보내주시는 크리에이티브 파트너사와 클라이언트 여러분께 깊은 소통의 감사를 드립니다.

당사 온카솔루션이 디자인 혁신과 마케팅 홍보 시너지의 탁월함을 업계 선도로 인정받아, 한국마케팅디자인협회가 주관하는 **[크리에이티브 코리아 2026 (Creative Korea 2026)]**에서 '올해의 우수 디자인 및 광고 PR 에이전시 대상'을 정식 수상하였습니다.

특히, 대기업 지주사의 성공적인 종합 리브랜딩부터 스타트업의 신규 심볼 런칭을 담당하며 단 한 건의 클레임이나 소송 이슈 없이 99% 최고의 만족도 평점을 달성한 성과가 매우 높게 반영되었습니다.

저희 온카솔루션 임직원 일동은 이에 안주하지 않고, 매 시안마다 가업의 역사를 짓는 웅장한 신성함으로 최고의 감동과 비주얼 전율을 선사해 드릴 것을 엄숙히 약속드립니다.

성원에 대단히 감사드립니다.`,
    createdAt: "2026-06-08"
  }
];

export const defaultInquiries = [
  {
    id: "inq-1",
    name: "김민수",
    email: "minsoo@example.com",
    phone: "010-8888-9999",
    serviceCategory: "로고 디자인" as "로고 디자인",
    message: "안녕하세요. 신기술 인공지능 기반 디지털 종합 물류 스타트업을 창업하게 되어 전문적이고 럭셔리하면서 스마트한 성격의 로고가 필요합니다. 견적과 작업 기간 문의를 정식으로 드립니다.",
    status: "unread" as "unread",
    createdAt: "2026-06-09T08:15:30Z"
  }
];
