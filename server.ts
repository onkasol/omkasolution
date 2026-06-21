import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// File-based db paths
const DATA_FILE = path.join(process.cwd(), 'cms_data.json');

function getCmsFile() {
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading CMS JSON file:', err);
    return null;
  }
}

function saveCmsFile(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing CMS JSON file:', err);
  }
}

// Lazy initialize Gemini AI client to prevent crash if key is missing
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body Parsing Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CMS Sync Endpoints
  app.get('/api/cms/data', (req, res) => {
    const data = getCmsFile();
    res.json(data || { settings: null, portfolio: null, blog: null, inquiries: null });
  });

  app.post('/api/cms/initialize', (req, res) => {
    const { settings, portfolio, blog, inquiries } = req.body;
    const current = getCmsFile() || {};
    
    const updated = {
      settings: current.settings || settings,
      portfolio: current.portfolio || portfolio,
      blog: current.blog || blog,
      inquiries: current.inquiries || inquiries
    };
    
    saveCmsFile(updated);
    res.json({ success: true, message: 'Initialized successfully' });
  });

  app.post('/api/cms/settings', (req, res) => {
    const settings = req.body;
    const current = getCmsFile() || { portfolio: [], blog: [], inquiries: [] };
    current.settings = settings;
    saveCmsFile(current);
    res.json({ success: true, settings });
  });

  app.post('/api/cms/portfolio', (req, res) => {
    const portfolio = req.body;
    const current = getCmsFile() || { settings: null, blog: [], inquiries: [] };
    current.portfolio = portfolio;
    saveCmsFile(current);
    res.json({ success: true, portfolio });
  });

  app.post('/api/cms/blog', (req, res) => {
    const blog = req.body;
    const current = getCmsFile() || { settings: null, portfolio: [], inquiries: [] };
    current.blog = blog;
    saveCmsFile(current);
    res.json({ success: true, blog });
  });

  app.post('/api/cms/inquiries', (req, res) => {
    const inquiries = req.body;
    const current = getCmsFile() || { settings: null, portfolio: [], blog: [] };
    current.inquiries = inquiries;
    saveCmsFile(current);
    res.json({ success: true, inquiries });
  });

  app.post('/api/cms/reset', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
      try {
        fs.unlinkSync(DATA_FILE);
      } catch (err) {
        console.error('Error deleting CMS JSON file:', err);
      }
    }
    res.json({ success: true, message: 'Reset completed on server' });
  });

  // API Route: AI Logo & Concept Brainstormer proxy via server-side Gemini Flash
  app.post('/api/logobrainstorm', async (req, res) => {
    const { sector, mood } = req.body;
    
    if (!sector || !mood) {
      return res.status(400).json({ error: 'Sector and mood fields are required.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return high-end simulated response if Gemini key is not configured yet
      console.warn('Gemini API key is not configured. Serving high-fidelity simulated response.');
      return res.json({
        story: `${sector} 브랜드는 특별하고 고유한 감각을 전파하기 위해 탄생하였습니다. 대담함 속에 가미된 ${mood} 무드는 소비자들의 심미적 취향을 강하게 견인하며 롱런할 것입니다.`,
        symbolIdea: `'네오 로투스(Neo-Lotus)' - 세련되게 양식화된 선형 유기물 모양과 날카로운 대칭형 구조 프레임을 융합해 전통의 고고함과 테크 시대의 스마트함을 품는 형상 제작.`,
        colors: ['#a855f7 (보랏빛 자수정)', '#06b6d4 (사이버 블루)', '#111827 (시크 차콜)'],
        copywriting: `오롯이 지나쳐 선명하게 각인되는 비주얼 시그니처. ${sector}, 그 이상의 미학적 걸작.`
      });
    }

    try {
      const prompt = `당신은 프리미엄 로고디자인 및 브랜드 컨설팅 대행사인 '온카솔루션 (Onka Solution)'의 AI 최고 크리에이티브 총괄 디렉터입니다.
다음 의뢰사 정보를 감각적으로 분석하여, 품격있는 브랜드 비주얼 리포트(JSON 포맷)를 작성해주세요.

의뢰사 정보:
- 업종/성격: ${sector}
- 선호하는 마케팅 무드: ${mood}

요구 포맷(JSON 필드):
1. story: 브랜드가 가진 철학이나 지향 가치를 설명하는 웅장하고 럭셔리한 브랜드 스토리 (한국어, 3-4문장 리포트)
2. symbolIdea: 이 기업에 어울릴만한 구체적이고 독특한 비주얼 로고 심볼의 형태 아이디어 및 디자인 구상안 (한국어)
3. copywriting: 소셜 광고나 언론 배포용으로 각인될 격조 높은 한국어 브랜드 카피라이팅 문구 제안
4. colors: 기업의 무드와 어울리는 세련된 HEX 색상코드 및 한글 색상이름 매핑 3개 리스트

JSON 출력 규칙:
- 마크다운 코드 블록(예: \`\`\`json \`\`\`) 양식을 절대 포함하지 말고 순수한 JSON 문자열만 즉시 출력해 주세요.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let responseText = response.text || '';
      
      // Cleanup code-block wrap if models persist sending markdown
      if (responseText.includes('```json')) {
        responseText = responseText.split('```json')[1].split('```')[0].trim();
      } else if (responseText.includes('```')) {
        responseText = responseText.split('```')[1].split('```')[0].trim();
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (err) {
      console.error('Gemini content generation failed:', err);
      res.status(500).json({ 
        error: 'AI Generation Failed',
        message: err instanceof Error ? err.message : String(err)
      });
    }
  });

  // Health probe
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', datetime: '2026-06-09T11:25:54Z' });
  });

  // Vite integration middleware handler
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middle mode initiated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ONKA Solution Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
