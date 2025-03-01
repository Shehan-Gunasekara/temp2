import { Input } from "../../components/ui/Input";
import { getTranslation } from "../../utils/translations";
import { useLanguage } from "../auth/context/LanguageContext";

interface DemoTextAreaProps {
  value: string;
}

export function DemoTextArea({ value }: DemoTextAreaProps) {
  const { language } = useLanguage();
  return (
    <div className="space-y-2">
      <h3 className="text-base  lg:text-xl font-medium">
        {getTranslation(language, "demo_page.input_title")}
      </h3>
      <p className="sm:text-sm text-xs text-black/60 mb-4">
        {getTranslation(language, "demo_page.input_description")}
      </p>
      <Input
        multiline
        rows={4}
        value={value}
        placeholder={getTranslation(language, "demo_page.input_placeholder")}
        className="text-base"
        disabled
      />
    </div>
  );
}
