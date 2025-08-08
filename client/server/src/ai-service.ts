import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export interface AIGenerationRequest {
  prompt: string;
  platform: string;
  contentType: string;
  tone: string;
  industry?: string;
  targetAudience?: string;
  keywords?: string[];
  wordCount?: number;
}

export interface AIGenerationResponse {
  content: {
    id: string;
    title: string;
    body: string;
    platform: string;
    contentType: string;
    metadata: {
      hashtags: string[];
      emojis: string[];
      seoKeywords: string[];
      estimatedReach: number;
      bestTimeToPost: string;
      sentiment: string;
      readabilityScore: number;
    };
  };
  usage: {
    current: number;
    limit: number;
    remaining: number;
    cost: number;
  };
}

class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private preferredModel: 'openai' | 'anthropic' = 'openai';

  constructor() {
    // Only initialize if API keys are available
    const openaiKey = process.env['OPENAI_API_KEY'];
    const anthropicKey = process.env['ANTHROPIC_API_KEY'];

    if (openaiKey) {
      this.openai = new OpenAI({
        apiKey: openaiKey,
      });
    }

    if (anthropicKey) {
      this.anthropic = new Anthropic({
        apiKey: anthropicKey,
      });
    }
  }

  private async generateWithOpenAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.openai) {
      throw new Error('OpenAI not configured');
    }

    const systemPrompt = this.buildSystemPrompt(request);
    
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.prompt }
      ],
      temperature: 0.7,
      max_tokens: request.wordCount ? request.wordCount * 2 : 1000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const metadata = this.extractMetadata(content, request);

    return {
      content: {
        id: `openai_${Date.now()}`,
        title: this.generateTitle(request),
        body: content,
        platform: request.platform,
        contentType: request.contentType,
        metadata,
      },
      usage: {
        current: completion.usage?.total_tokens || 0,
        limit: 100000,
        remaining: 100000 - (completion.usage?.total_tokens || 0),
        cost: this.calculateCost(completion.usage),
      },
    };
  }

  private async generateWithAnthropic(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic not configured');
    }

    const systemPrompt = this.buildSystemPrompt(request);
    
    const message = await (this.anthropic as any).messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: request.wordCount ? request.wordCount * 2 : 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: request.prompt }
      ],
    });

    const content = (message as any).content?.[0]?.text || '';
    const metadata = this.extractMetadata(content, request);

    return {
      content: {
        id: `anthropic_${Date.now()}`,
        title: this.generateTitle(request),
        body: content,
        platform: request.platform,
        contentType: request.contentType,
        metadata,
      },
      usage: {
        current: ((message as any).usage?.input_tokens || 0) + ((message as any).usage?.output_tokens || 0),
        limit: 100000,
        remaining: 100000 - (((message as any).usage?.input_tokens || 0) + ((message as any).usage?.output_tokens || 0)),
        cost: this.calculateAnthropicCost((message as any).usage),
      },
    };
  }

  private buildSystemPrompt(request: AIGenerationRequest): string {
    const platformGuidelines = {
      instagram: 'Create visually appealing, engaging content with relevant hashtags and emojis. Focus on storytelling and visual elements.',
      twitter: 'Keep content concise and engaging. Use trending hashtags and create shareable content.',
      linkedin: 'Professional tone with industry insights. Focus on thought leadership and business value.',
      facebook: 'Community-focused content that encourages engagement and sharing.',
      blog: 'Comprehensive, SEO-optimized content with clear structure and valuable insights.',
    };

    const toneGuidelines = {
      professional: 'Use formal language, industry terminology, and authoritative tone.',
      casual: 'Use conversational language, contractions, and friendly tone.',
      friendly: 'Warm, approachable tone with personal touches and inclusive language.',
      authoritative: 'Confident, expert tone with data and evidence to support claims.',
      humorous: 'Light-hearted, witty tone with appropriate humor and entertainment value.',
    };

    return `You are an expert content creator specializing in ${request.platform} content generation.

Platform Guidelines: ${platformGuidelines[request.platform as keyof typeof platformGuidelines] || 'Create engaging, platform-appropriate content.'}

Tone Guidelines: ${toneGuidelines[request.tone as keyof typeof toneGuidelines] || 'Use professional, engaging tone.'}

Content Type: ${request.contentType}

Requirements:
1. Create high-quality, engaging content
2. Include relevant hashtags (3-5 for social media)
3. Suggest appropriate emojis
4. Optimize for the specified platform
5. Consider SEO keywords if applicable
6. Provide estimated reach and best posting time
7. Ensure content is original and valuable

Format your response as natural content that can be directly used.`;
  }

  private extractMetadata(content: string, request: AIGenerationRequest) {
    // Extract hashtags
    const hashtags = content.match(/#\w+/g) || ['#content', '#ai', '#socialmedia'];
    
    // Extract emojis
    // Use a simpler emoji regex without the 'u' flag to support ES2019 target
    const emojiRegex = /([\u2600-\u27BF])/g;
    const emojis = content.match(emojiRegex) || ['💡', '✨', '🚀'];
    
    // Generate SEO keywords
    const seoKeywords = this.generateSEOKeywords(request);
    
    // Estimate reach based on platform and content quality
    const estimatedReach = this.estimateReach(request.platform, content.length);
    
    // Determine best posting time
    const bestTimeToPost = this.getBestPostingTime(request.platform);
    
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(content);
    
    // Calculate readability score
    const readabilityScore = this.calculateReadability(content);

    return {
      hashtags: hashtags.slice(0, 5),
      emojis: emojis.slice(0, 3),
      seoKeywords,
      estimatedReach,
      bestTimeToPost,
      sentiment,
      readabilityScore,
    };
  }

  private generateSEOKeywords(request: AIGenerationRequest): string[] {
    const baseKeywords = ['content', 'marketing', 'social media'];
    const platformKeywords = {
      instagram: ['visual', 'storytelling', 'engagement'],
      twitter: ['trending', 'conversation', 'real-time'],
      linkedin: ['professional', 'networking', 'industry'],
      facebook: ['community', 'sharing', 'connection'],
      blog: ['seo', 'value', 'insights'],
    };
    
    return [...baseKeywords, ...(platformKeywords[request.platform as keyof typeof platformKeywords] || [])];
  }

  private estimateReach(platform: string, contentLength: number): number {
    const baseReach = {
      instagram: 1000,
      twitter: 800,
      linkedin: 600,
      facebook: 1200,
      blog: 500,
    };
    
    const qualityMultiplier = contentLength > 100 ? 1.5 : 1.0;
    return Math.floor((baseReach[platform as keyof typeof baseReach] || 500) * qualityMultiplier);
  }

  private getBestPostingTime(platform: string): string {
    const postingTimes = {
      instagram: '9:00 AM',
      twitter: '8:00 AM',
      linkedin: '9:00 AM',
      facebook: '1:00 PM',
      blog: '10:00 AM',
    };
    
    return postingTimes[platform as keyof typeof postingTimes] || '9:00 AM';
  }

  private analyzeSentiment(content: string): string {
    const positiveWords = ['amazing', 'great', 'excellent', 'wonderful', 'fantastic', 'awesome'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'disappointing'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);
    
    if (sentences === 0) return 0;
    
    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    return words.reduce((count, word) => {
      return count + this.countWordSyllables(word);
    }, 0);
  }

  private countWordSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  private generateTitle(request: AIGenerationRequest): string {
    return `${request.contentType.charAt(0).toUpperCase() + request.contentType.slice(1)} for ${request.platform}`;
  }

  private calculateCost(usage: any): number {
    // OpenAI pricing (approximate)
    const inputCost = (usage?.prompt_tokens || 0) * 0.00003;
    const outputCost = (usage?.completion_tokens || 0) * 0.00006;
    return inputCost + outputCost;
  }

  private calculateAnthropicCost(usage: any): number {
    // Anthropic pricing (approximate)
    const inputCost = (usage?.input_tokens || 0) * 0.000003;
    const outputCost = (usage?.output_tokens || 0) * 0.000015;
    return inputCost + outputCost;
  }

  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      // Try real AI if available
      if (this.preferredModel === 'anthropic' && this.anthropic) {
        return await this.generateWithAnthropic(request);
      } else if (this.openai) {
        return await this.generateWithOpenAI(request);
      } else {
        // Fallback to mock response
        return this.generateMockResponse(request);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      return this.generateMockResponse(request);
    }
  }

  private generateMockResponse(request: AIGenerationRequest): AIGenerationResponse {
    const mockContent = `Generated ${request.contentType} for ${request.platform} with ${request.tone} tone: ${request.prompt}`;
    
    return {
      content: {
        id: `mock_${Date.now()}`,
        title: this.generateTitle(request),
        body: mockContent,
        platform: request.platform,
        contentType: request.contentType,
        metadata: {
          hashtags: ['#content', '#ai', '#socialmedia'],
          emojis: ['💡', '✨', '🚀'],
          seoKeywords: ['content', 'marketing', 'social media'],
          estimatedReach: 1000,
          bestTimeToPost: '9:00 AM',
          sentiment: 'positive',
          readabilityScore: 75,
        },
      },
      usage: {
        current: 1,
        limit: 10,
        remaining: 9,
        cost: 0,
      },
    };
  }

  setPreferredModel(model: 'openai' | 'anthropic') {
    this.preferredModel = model;
  }

  // Check if real AI is available
  isRealAIAvailable(): boolean {
    return !!(this.openai || this.anthropic);
  }
}

export default new AIService(); 