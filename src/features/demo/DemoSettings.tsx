import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Settings } from "lucide-react";
import { getTranslation } from "../../utils/translations";
import { useLanguage } from "../auth/context/LanguageContext";

export function DemoSettings() {
  const { language } = useLanguage();
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-black/5 flex items-center space-x-3">
        <Settings className="h-5 w-5 text-black/40" />
        <h3 className="font-medium text-sm sm:text-base">
          {getTranslation(language, "demo_page.general_settings")}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input
            type="number"
            label={getTranslation(language, "demo_page.seed")}
            placeholder="Random"
            min={0}
            max={999999}
            value={"123456"}
            // disabled
          />
          <Select
            label={getTranslation(language, "demo_page.aspect_ratio")}
            value="9:16"
            // disabled
            options={[
              // { value: "16:9", label: "16:9 Landscape" },
              { value: "9:16", label: "9:16 Portrait" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* <Toggle 
            label="Enhanced Detail" 
            checked={settings.enhancedDetail}
            onChange={(checked) => onUpdate({ enhancedDetail: checked })}
          /> */}
          <Select
            className="w-28 sm:w-40"
            label={getTranslation(language, "demo_page.resolution")}
            value={"1080p"}
            // disabled
            options={[{ value: "1080p", label: "1080p" }]}
          />
        </div>
      </div>
    </Card>
  );
}
