import { useState } from 'react';
import { AIActorSettings, AIActor } from '../types';

const defaultSettings: AIActorSettings = {
  aspectRatio: '9:16',
  enhancedDetail: false,
  resolution: '720p',
  seed: undefined
};

export function useAIActor() {
  const [actor, setActor] = useState<AIActor>({
    prompt: '',
    settings: defaultSettings
  });

  const updatePrompt = (prompt: string) => {
    setActor(prev => ({ ...prev, prompt }));
  };

  const updateSettings = (settings: Partial<AIActorSettings>) => {
    setActor(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  return {
    actor,
    updatePrompt,
    updateSettings
  };
}