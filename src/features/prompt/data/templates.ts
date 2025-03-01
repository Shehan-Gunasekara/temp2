import {
  Umbrella,
  Mic,
  Briefcase,
  Presentation,
  Stethoscope,
  Smartphone,
} from "lucide-react";
import { Template } from "../types";
import { useLanguage } from "../../auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

export const templates: Template[] = () => {
  const { language } = useLanguage();
  return [
    {
      id: "beach",
      title: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp1.title"
      ),
      description: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp1.description"
      ),
      prompt: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp1.prompt"
      ),
      icon: Umbrella,
      category: "lifestyle",
    },
    {
      id: "podcast",
      title: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp2.title"
      ),
      description: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp2.description"
      ),
      prompt: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp2.prompt"
      ),
      icon: Mic,
      category: "professional",
    },
    {
      id: "office",
      title: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp3.title"
      ),
      description: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp3.description"
      ),
      prompt: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp3.prompt"
      ),
      icon: Briefcase,
      category: "business",
    },
    {
      id: "stage",
      title: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp4.title"
      ),
      description: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp4.description"
      ),
      prompt: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp4.prompt"
      ),
      icon: Presentation,
      category: "business",
    },
    {
      id: "healthcare",
      title: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp5.title"
      ),
      description: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp5.description"
      ),
      prompt: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp5.prompt"
      ),
      icon: Stethoscope,
      category: "professional",
    },
    {
      id: "selfie",
      title: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp6.title"
      ),
      description: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp6.description"
      ),
      prompt: getTranslation(
        language,
        "ugc_actor.ugc_video.templates.temp6.prompt"
      ),
      icon: Smartphone,
      category: "lifestyle",
    },
  ];
};
