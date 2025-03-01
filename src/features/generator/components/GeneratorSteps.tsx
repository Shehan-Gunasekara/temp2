import React from "react";
import { Check, ChevronRight, Video, Mic, Users } from "lucide-react";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

interface Step {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  icon: JSX.Element;
  options?: {
    name: string;
    description: string;
    icon: JSX.Element;
  }[];
}

interface GeneratorStepsProps {
  currentStep: number;
  videoGenerated: boolean;
  lipSyncComplete: boolean;
  setCurrentStep: (step: number) => void;
  selectedOption?: "generate" | "select";
  onOptionSelect?: (option: "generate" | "select") => void;
}

export function GeneratorSteps({
  currentStep,
  videoGenerated,
  lipSyncComplete,
  setCurrentStep,
  selectedOption,
  onOptionSelect,
}: GeneratorStepsProps) {
  const { language } = useLanguage();

  const steps: Step[] = [
    {
      id: 1,
      name: getTranslation(language, "ugc_actor.feature_components.title1"),
      description: getTranslation(
        language,
        "ugc_actor.feature_components.description1"
      ),
      isCompleted: videoGenerated,
      isActive: currentStep === 1,
      icon: <Users className="w-5 h-5" />,
      options: [
        {
          name: getTranslation(language, "ugc_actor.feature_components.options.name1"),
          description: getTranslation(language, "ugc_actor.feature_components.options.description1"),
          icon: <Video className="w-5 h-5" />,
        },
        {
          name: getTranslation(language, "ugc_actor.feature_components.options.name2"),
          description: getTranslation(language, "ugc_actor.feature_components.options.description2"),
          icon: <Users className="w-5 h-5" />,
        },
      ],
    },
    {
      id: 2,
      name: getTranslation(language, "ugc_actor.feature_components.title2"),
      description: getTranslation(
        language,
        "ugc_actor.feature_components.description2"
      ),
      isCompleted: lipSyncComplete,
      isActive: currentStep === 2,
      icon: <Mic className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12 px-4">
      <nav aria-label="Progress">
        <ol
          role="list"
          className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-12"
        >
          {steps.map((step, stepIdx) => (
            <React.Fragment key={step.id}>
              <li
                className={`flex-1 ${
                  step.id === 1
                    ? "min-w-[160px] sm:min-w-[400px]"
                    : "min-w-[100px] sm:min-w-[200px]"
                } md:max-w-[280px]`}
              >
                <div
                  onClick={() => setCurrentStep(step.id)}
                  className={`group flex flex-col transition-all duration-200 ${
                    step.isActive ? "transform scale-[1.02] md:scale-105" : ""
                  } cursor-pointer hover:transform hover:scale-[1.02] md:hover:scale-105`}
                >
                  <div
                    className={`
                    relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300
                    ${
                      step.isCompleted
                        ? "bg-black border-black"
                        : step.isActive
                        ? "bg-gradient-to-br from-gray-50 to-gray-100 border-black"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`
                      h-6 w-6 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center transition-all duration-300
                      ${
                        step.isCompleted
                          ? "bg-white"
                          : step.isActive
                          ? "bg-black"
                          : "bg-gray-100"
                      }
                    `}
                      >
                        {step.isCompleted ? (
                          <Check
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              step.isCompleted ? "text-black" : "text-white"
                            }`}
                          />
                        ) : (
                          <span
                            className={`
                          ${step.isActive ? "text-white" : "text-gray-400"}
                          transition-colors duration-200
                        `}
                          >
                            {React.cloneElement(step.icon, {
                              className: "w-3 h-3 sm:w-4 sm:h-4",
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`
                        text-xs sm:text-sm font-semibold transition-all duration-200
                        ${
                          step.isCompleted
                            ? "text-white"
                            : step.isActive
                            ? "text-black"
                            : "text-gray-600 group-hover:text-gray-900"
                        }
                      `}
                        >
                          {step.name}
                        </span>
                        {/* Step description hidden on mobile */}
                        <p
                          className={`
                        hidden sm:block text-[10px] sm:text-xs transition-all duration-200
                        ${
                          step.isCompleted
                            ? "text-gray-300"
                            : step.isActive
                            ? "text-gray-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }
                      `}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Options for Step 1 */}
                    {step.options && step.isActive && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {step.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOptionSelect?.(
                                index === 0 ? "generate" : "select"
                              );
                            }}
                            className={`
                            p-3 rounded-lg border-2 transition-all duration-200
                            ${
                              selectedOption ===
                                (index === 0 ? "generate" : "select") ||
                              step.isCompleted
                                ? "border-black bg-black text-white"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 "
                            }
                          `}
                          >
                            <div className="flex flex-col items-center text-center gap-2">
                              {option.icon}
                              <div>
                                <div className="font-medium text-xs sm:text-sm">
                                  {option.name}
                                </div>
                                {/*
                                  Option description hidden on mobile
                                  by adding "hidden sm:block" 
                                */}
                                <div className="hidden sm:block text-[10px] sm:text-xs opacity-80">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
              {stepIdx !== steps.length - 1 && (
                <div className="flex items-center justify-center w-6 sm:w-10 md:w-20">
                  <div
                    className={`
                    w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300
                    ${
                      steps[stepIdx].isCompleted
                        ? "bg-black border-black"
                        : "bg-white border-gray-200"
                    }
                  `}
                  >
                    <ChevronRight
                      className={`
                    w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 transition-all duration-200
                    ${
                      steps[stepIdx].isCompleted
                        ? "text-white"
                        : "text-gray-300"
                    }
                  `}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
}
