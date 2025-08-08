import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiService from './ai-service';
// Database initialization is disabled for Railway minimal runtime
// import { initializeDatabase } from './database';

// Load environment variables
dotenv.config();

const app = express();

// Initialize database (disabled)
// initializeDatabase().catch(console.error);

// Middleware
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || process.env['CLIENT_URL'] || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    message: 'GetContentAI Server is running!'
  });
});

// AI generation endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, platform, contentType, tone = 'professional', industry, targetAudience, keywords, wordCount } = req.body;

    if (!prompt || !platform || !contentType) {
      return res.status(400).json({ 
        error: 'Prompt, platform, and content type are required' 
      });
    }

    const request = {
      prompt,
      platform,
      contentType,
      tone,
      industry,
      targetAudience,
      keywords,
      wordCount,
    };

    const result = await aiService.generateContent(request);
    return res.json(result);
  } catch (error: any) {
    console.error('AI generation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Authentication endpoints
app.post('/api/auth/login', (_req, res) => {
  // Mock authentication - in production, verify credentials
  res.json({
    message: 'Login successful (mock)',
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'dev-user-id',
      email: 'dev@example.com',
      firstName: 'Dev',
      lastName: 'User',
      plan: 'free',
      preferredAiModel: 'gpt-4',
    },
  });
});

app.post('/api/auth/signup', (req, res) => {
  // Mock signup - in production, create user in database
  res.json({
    message: 'Signup successful (mock)',
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'new-user-id',
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      plan: 'free',
      preferredAiModel: 'gpt-4',
    },
  });
});

app.get('/api/auth/me', (_req, res) => {
  // Mock user profile - in production, verify JWT and get user from database
  res.json({
    user: {
      id: 'dev-user-id',
      email: 'dev@example.com',
      firstName: 'Dev',
      lastName: 'User',
      plan: 'free',
      preferredAiModel: 'gpt-4',
      settings: {
        language: 'en',
        timezone: 'UTC',
        notifications: true,
        theme: 'light',
      },
      usageCount: 15,
      monthlyUsage: 15,
    },
  });
});

// Mock templates endpoint
app.get('/api/templates', (_req, res) => {
  const templates = [
    {
      id: '1',
      name: 'Product Launch',
      description: 'Engaging product launch content for social media',
      category: 'marketing',
      industry: 'ecommerce',
      platform: 'instagram',
      contentType: 'post',
      prompt: 'Create an exciting product launch post for {{product}} that highlights its key features and benefits.',
      variables: ['product'],
      usageCount: 150,
    },
    {
      id: '2',
      name: 'Thought Leadership',
      description: 'Professional thought leadership content for LinkedIn',
      category: 'business',
      industry: 'consulting',
      platform: 'linkedin',
      contentType: 'post',
      prompt: 'Write a thought leadership post about {{topic}} that positions {{company}} as an industry expert.',
      variables: ['topic', 'company'],
      usageCount: 89,
    },
  ];

  res.json({ templates });
});

// Mock analytics endpoint
app.get('/api/analytics', (_req, res) => {
  const analytics = {
    monthlyUsage: 15,
    totalGenerations: 150,
    plan: 'free',
    topPlatforms: ['instagram', 'twitter', 'linkedin'],
    averageEngagement: 85,
    costSavings: 250,
  };

  res.json({ analytics });
});

// Mock trends endpoint
app.get('/api/trends', (_req, res) => {
  const trends = [
    {
      keyword: 'AI Marketing',
      volume: 15000,
      growth: 25.5,
      sentiment: 'positive',
      relatedKeywords: ['automation', 'personalization', 'chatbots'],
    },
    {
      keyword: 'Content Strategy',
      volume: 12000,
      growth: 18.2,
      sentiment: 'positive',
      relatedKeywords: ['planning', 'calendar', 'branding'],
    },
  ];

  res.json({ trends });
});

app.get('/api/marketing', (_req, res) => {
  const payload = {
    heroTitle: 'AI Content that Grows Your Small Business',
    heroSubtitle: 'Create platform-ready posts, blogs, and emails in seconds. Built for entrepreneurs, local businesses, and solo founders.',
    primaryCTA: 'Start Free Demo',
    secondaryCTA: 'See Pricing',
    valueProps: [
      {
        title: 'Win Time Back',
        description: 'Generate weeks of content in minutes so you can focus on sales and customers.'
      },
      {
        title: 'Platform-Perfect',
        description: 'Optimized for Instagram, LinkedIn, Facebook, X, blogs, and newsletters.'
      },
      {
        title: 'Pro Copy, No Agency',
        description: 'High-quality posts with hashtags, emojis, SEO keywords, and best-time suggestions.'
      }
    ],
    personas: ['local_retail', 'service_provider', 'creator_coach', 'ecommerce', 'startup_founder']
  };
  res.json(payload);
});

app.get('/api/demo', async (req, res) => {
  try {
    const scenario = (req.query['scenario'] as string) || 'overview';
    const demos = [
      {
        id: 'local-bakery-instagram',
        title: 'Local Bakery Instagram Post',
        prompt: 'Write an Instagram post for a local bakery announcing a new seasonal croissant flavor with a warm, friendly tone.',
        platform: 'instagram',
        contentType: 'post',
        tone: 'friendly'
      },
      {
        id: 'consultant-linkedin',
        title: 'Consultant LinkedIn Thought Leadership',
        prompt: 'Write a LinkedIn post for a solo consultant sharing a practical tip about improving client onboarding.',
        platform: 'linkedin',
        contentType: 'post',
        tone: 'professional'
      },
      {
        id: 'shopify-email',
        title: 'Ecommerce Email Announcement',
        prompt: 'Write a short email announcing a weekend sale for a Shopify store, including a clear CTA and urgency.',
        platform: 'email',
        contentType: 'newsletter',
        tone: 'authoritative'
      }
    ];

    const selected = scenario === 'overview' ? demos : demos.filter(d => d.id === scenario);

    const results = [] as any[];
    for (const d of selected) {
      const result = await aiService.generateContent({
        prompt: d.prompt,
        platform: d.platform,
        contentType: d.contentType,
        tone: d.tone,
        wordCount: 150
      } as any);
      results.push({ id: d.id, title: d.title, ...result });
    }

    const message = {
      headline: 'This is what GetContentAI can do for your business',
      subheadline: 'See ready-to-post content tailored to small businesses. To create your own content, sign up and subscribe.',
      cta: {
        label: 'Create My Content',
        action: 'signup_required'
      }
    };

    res.json({ message, demos: results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env['PORT'] || 3001;

app.listen(PORT, () => {
  console.log(`🚀 GetContentAI Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  console.log(`🔗 Client URL: ${process.env['CLIENT_URL'] || 'http://localhost:5173'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
}); 