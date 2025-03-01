import { useRef, useState } from "react";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Settings } from "lucide-react";
import { PromptSettings as SettingsType } from "../../types";
import { Info } from "lucide-react";
import { useAuth } from "../../../auth/context/useAuth";
import { useLanguage } from "../../../auth/context/LanguageContext";
import { getTranslation } from "../../../../utils/translations";
import { useOnClickOutside } from "../../../../hooks/useOnClickOutside";

interface Props {
  settings: SettingsType;
  onUpdate: (settings: Partial<SettingsType>) => void;
}

export function PromptSettings({ settings, onUpdate }: Props) {
  const { language } = useLanguage();
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { isEnableEnhanceUGCActor, setIsEnableEnhanceUGCActor } = useAuth();
  
  useOnClickOutside(tooltipRef, () => {
    if (!infoButtonRef.current?.contains(document.activeElement)) {
      setShowInfo(false);
    }
  });

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-black/5 flex items-center space-x-3">
        <Settings className="h-5 w-5 text-black/40" />
        <h3 className="font-medium text-sm sm:text-base">
          {getTranslation(language, "ugc_actor.ugc_video.general_settings")}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Select
            label={getTranslation(language, "ugc_actor.ugc_video.model_version")}
            value={settings.model || '2'}
            onChange={(e) => onUpdate({ model: e.target.value as "1" | "2" })}
            options={[
              { value: "1", label: `V1 - ${getTranslation(language, "ugc_actor.ugc_video.model_1_info")}` },
              { value: "2", label: `V2 - ${getTranslation(language, "ugc_actor.ugc_video.model_2_info")}` },
            ]}
            info={getTranslation(language, "ugc_actor.ugc_video.model_info")}
          />
          <Select
            label={getTranslation(language, "ugc_actor.ugc_video.aspect_ratio")}
            value="9:16"
            onChange={(e) =>
              onUpdate({ aspectRatio: e.target.value as "16:9" | "9:16" })
            }
            options={[
              { value: "9:16", label: "9:16 Portrait" },
            ]}
          />
            <Input
              type="number"
              label={getTranslation(language, "ugc_actor.ugc_video.seed")}
              placeholder="Random"
              min={0}
              max={999999}
              value={settings.seed || ""}
              onChange={(e) =>
                onUpdate({
                  seed: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
        {/* </div> */}

        {/* <div className="grid grid-cols-2 gap-6"> */}
          <Select
            label={getTranslation(language, "ugc_actor.ugc_video.resolution")}
            value={settings.resolution}
            onChange={(e) =>
              onUpdate({ resolution: e.target.value as "4K" })
            }
            options={[{ value: "4K", label: "4K" }]}
          />
          {import.meta.env.VITE_SITE_NAMAE != "Synthetic UGC" && (
            <Select
              label={getTranslation(language, "ugc_actor.ugc_video.duration")}
              value={settings.duration}
              onChange={(e) => onUpdate({ duration: e.target.value as "5" })}
              options={[
                { value: "5", label: "5" },
                { value: "10", label: "10" },
              ]}
            />
          )}{" "}
          {import.meta.env.VITE_SITE_NAMAE == "Synthetic UGC" && (
            <Select
              label={getTranslation(language, "ugc_actor.ugc_video.duration")}
              value={settings.duration}
              // onChange={(e) => onUpdate({ duration: e.target.value as "5" })}
              options={
                settings.model === "2"
                  ? [{ value: "8", label: "8" }]
                  : [{ value: "5", label: "5" }]
              }
            />
          )}
        </div>
        {settings.model === "1" && (
          <div className="flex flex-row  gap-6 mb-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {getTranslation(
                    language,
                    "ugc_actor.ugc_video.enhance_label"
                  )}
                </span>
                <div
                  className="inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    ref={infoButtonRef}
                    onClick={handleInfoClick}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none"
                    aria-label="Show information about Enhanced Lipsync"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>

              {showInfo && (
                <div
                  ref={tooltipRef}
                  className="absolute mt-[-80px] sm:mt-[-40px] sm:ml-[150px] z-10 p-3 bg-gray-800 rounded-lg shadow-lg text-xs max-w-xs text-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getTranslation(
                    language,
                    "ugc_actor.ugc_video.enhance_description"
                  )}
                  <div className="absolute -top-2 left-4 w-0 h-0 border-8 border-transparent border-b-gray-800" />
                </div>
              )}

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  // checked={true}
                  onChange={() => {
                    setIsEnableEnhanceUGCActor(!isEnableEnhanceUGCActor);
                  }}
                />
                <div className="relative w-[52px] h-7 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
