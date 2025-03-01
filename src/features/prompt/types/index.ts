export interface AIActorSettings {
  seed?: number;
  aspectRatio: '9:16' | '16:9';
  enhancedDetail: boolean;
  resolution: '720p' | '1080p' | '4k';
}

export interface AIActor {
  prompt: string;
  settings: AIActorSettings;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ComponentType;
  category: 'lifestyle' | 'business' | 'professional';
}