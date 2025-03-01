import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../context/useAuth";
import { getTranslation } from "../../../utils/translations";
import { useLanguage } from "../context/LanguageContext";
// import { useAuth } from "../hooks/useAuth";

interface Props {
  mode?: "signin" | "signup";
  setError: (error: string | null) => void;
}

export function GoogleSignInButton({ mode = "signin", setError }: Props) {
  const { signInWithGoogle } = useAuth();
  const { language } = useLanguage();
  const handleGoogleAuth = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : getTranslation(language, "authError.failed_google_signin")
      );
    }
  };
  return (
    <Button
      variant="secondary"
      className="w-full text-sm sm:text-base"
      onClick={handleGoogleAuth}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      {mode === "signin"
        ? getTranslation(language, "auth.google_signing")
        : getTranslation(language, "auth.google_signup")}
    </Button>
  );
}
