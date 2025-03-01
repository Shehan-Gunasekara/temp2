import { Input } from "../../../components/ui/Input";
import { getTranslation } from "../../../utils/translations";
import { useLanguage } from "../../auth/context/LanguageContext";

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptTextarea({ value, onChange }: PromptTextareaProps) {
  const { language } = useLanguage();
  return (
    <div className="space-y-2">
      <h3 className="text-base  lg:text-xl font-medium">
        {getTranslation(language, "ugc_actor.ugc_video.input_title")}
      </h3>
      <p className="sm:text-sm text-xs text-black/60 mb-4">
        {getTranslation(language, "ugc_actor.ugc_video.input_desc")}
      </p>
      <Input
        multiline
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getTranslation(
          language,
          "ugc_actor.ugc_video.input_place_holder"
        )}
        className="text-base"
      />
    </div>
  );
}
