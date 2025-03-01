import { TemplateGenerator } from "./TemplateGenerator";
import { TemplateSelector } from "./TemplateSelector";
import { TemplateSteps } from "./TemplateSteps";

import React, { useState, useRef, useEffect } from "react";

// import { Slider } from "../../components/ui/Slider";

interface Template {
  _id: string;
  thumbnailUrl: string;
  title: string;
  videoUrl: string;
}

export function TemplateEditor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedVideoUrl, setgeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  return (
    <main className="flex-1  xl:min-w-[1350px] mx-auto px-6 ">
      <div className="pt-28 md:pt-40 pb-0">
        <div className="max-w-3xl mx-auto mb-16 text-center space-y-4 sm:space-y-6">
          <p className="text-xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent leading-tight">
            Generate your template
          </p>
          <p className="text-base lg:text-xl text-black/60 max-w-2xl mx-auto">
            Create custom AI templates for your content in seconds
          </p>
        </div>

        <TemplateSteps
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
      {currentStep == 1 ? (
        <TemplateGenerator
          setCurrentStep={setCurrentStep}
          setgeneratedVideoUrl={setgeneratedVideoUrl}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
        />
      ) : (
        <TemplateSelector generatedVideoUrl={generatedVideoUrl} />
      )}
    </main>
  );
}
