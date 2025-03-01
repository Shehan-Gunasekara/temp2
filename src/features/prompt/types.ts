export type Category = "all" | "lifestyle" | "business" | "professional";

export interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ComponentType;
  category: Exclude<Category, "all">;
}

export interface PromptSettings {
  model:"2" | "1";
  seed?: number;
  aspectRatio: "16:9" | "9:16";
  enhancedDetail: boolean;
  resolution: "1080p" | "4K";
  duration: "5";
}

export interface PromptState {
  prompt: string;
  settings: PromptSettings;
  setPrompt: (value: string) => void;
  updateSettings: (settings: Partial<PromptSettings>) => void;
}
