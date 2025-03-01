import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { TermsPopup } from "./TermsPopup";
// import Modal from "react-modal";
// import { useAuth } from "../hooks/useAuth";

import { GoogleSignInButton } from "./GoogleSignInButton";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isVerificationLinkSent, setIsVerificationLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const [displayForgotPassword, setDisplayForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, sendResetPassword } = useAuth();
  const [isConfirm, setIsConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { language } = useLanguage();
  const handleForgotPassword = () => {
    setError(null);
    setFormData({ email: "", password: "", name: "" });
    setIsResetLinkSent(false);
    setDisplayForgotPassword(!displayForgotPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces

    if (!emailRegex.test(formData.email)) {
      setError(getTranslation(language, "authError.invalid_email"));
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      if (!formData.name.trim()) {
        setError(getTranslation(language, "authError.name_requred"));
        setLoading(false);
        return;
      }

      if (!nameRegex.test(formData.name)) {
        setError(getTranslation(language, "authError.name_not_num"));
        setLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError(getTranslation(language, "authError.password_error1"));
        setLoading(false);
        return;
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        setError(getTranslation(language, "authError.password_error2"));
        setLoading(false);
        return;
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        setError(getTranslation(language, "authError.password_error3"));
        setLoading(false);
        return;
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        setError(getTranslation(language, "authError.password_error4"));
        setLoading(false);
        return;
      }
      if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
        setError(getTranslation(language, "authError.password_error5"));
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === "signin") {
        setLoading(true);
        const success = await signIn(formData.email, formData.password);
        if (success) {
          window.history.pushState({}, "", "/ugc-actor");
          window.dispatchEvent(new PopStateEvent("popstate"));
          setLoading(false);
        }
      } else {
        if (!isConfirm) {
          setShowPopup(true);
          return;
        }
        setLoading(true);
        const success = await signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (success) {
          setFormData({ email: "", password: "", name: "" });
          setIsVerificationLinkSent(true);
          setLoading(false);
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : getTranslation(language, "authError.auth_fail")
      );
    }
  };

  const signUpData = async () => {
    setLoading(true);
    try {
      const success = await signUp(
        formData.email,
        formData.password,
        formData.name
      );

      if (success) {
        setFormData({ email: "", password: "", name: "" });
        setIsVerificationLinkSent(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : getTranslation(language, "authError.auth_fail")
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
    setFormData({ email: "", password: "", name: "" });
    setIsVerificationLinkSent(false);
  };

  const sendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsResetLinkSent(false);
    setError(null);

    setLoading(true);
    if (!emailRegex.test(formData.email)) {
      setError(getTranslation(language, "authError.invalid_email"));
      setLoading(false);
      return;
    }

    try {
      await sendResetPassword(formData.email);
      setIsResetLinkSent(true);
      setFormData({ email: "", password: "", name: "" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : getTranslation(language, "authError.fail_send_link")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isVerificationLinkSent && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-green-600 text-sm ">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>
            {getTranslation(language, "auth.verification1")}{" "}
            <strong>{formData.email}</strong>.{" "}
            {getTranslation(language, "auth.verification2")}
          </p>
        </div>
      )}
      {displayForgotPassword ? (
        <>
          {" "}
          {isResetLinkSent && (
            <div className="flex items-center gap-2 p-3 rounded-lg  text-green-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p> {getTranslation(language, "auth.reset_link_sent")}</p>
            </div>
          )}
          <form onSubmit={sendResetCode} className="space-y-12">
            <Input
              label={getTranslation(language, "auth.email")}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              icon={<Mail className="h-5 w-5 text-black/40" />}
              placeholder="you@example.com"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              className=" w-full bg-black text-white hover:bg-black/90 inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-sm sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                getTranslation(language, "auth.processing")
              ) : (
                <>
                  {getTranslation(language, "auth.enter")}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-black/60">
            {getTranslation(language, "auth.return_signin")}{" "}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-black hover:underline"
            >
              {getTranslation(language, "auth.sign_in")}
            </button>
          </p>
        </>
      ) : (
        <>
          {" "}
          <GoogleSignInButton mode={mode} setError={setError} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-black/60">
                {getTranslation(language, "auth.or_coninue")}
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Input
                label={getTranslation(language, "auth.full_name")}
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  const nameRegex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces

                  if (!nameRegex.test(value)) {
                    setError(
                      getTranslation(language, "authError.name_not_num")
                    );
                  } else {
                    setError(null); // Clear error if valid
                  }

                  setFormData((prev) => ({ ...prev, name: value }));
                }}
                icon={<User className="h-5 w-5 text-black/40" />}
                placeholder="John Doe"
              />
            )}

            <Input
              label={getTranslation(language, "auth.email")}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              icon={<Mail className="h-5 w-5 text-black/40" />}
              placeholder="you@example.com"
            />

            <Input
              label={getTranslation(language, "auth.password")}
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              icon={<Lock className="h-5 w-5 text-black/40" />}
              placeholder={getTranslation(language, "auth.password")}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {mode == "signin" && (
              <div
                className="text-left text-black/60 hover:text-black hover:underline text-xs cursor-pointer"
                onClick={handleForgotPassword}
              >
                <p>{getTranslation(language, "auth.forgot_password")}</p>
              </div>
            )}

            <button
              className=" w-full bg-black text-white hover:bg-black/90 inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none text-sm sm:text-sm md:text-lg px-5 sm:px-6 py-3 sm:py-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                getTranslation(language, "auth.processing")
              ) : mode === "signin" ? (
                <>
                  {getTranslation(language, "auth.sign_in")}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : (
                <>
                  {getTranslation(language, "auth.create_account")}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>
          {/* Terms Popup */}
          <TermsPopup
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            onAgree={() => {
              setIsConfirm(true);
              setShowPopup(false);
              signUpData();
            }}
          />
          <p className="text-center text-sm text-black/60">
            {mode === "signin" ? (
              <>
                {getTranslation(language, "auth.dont_have")}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-black hover:underline"
                >
                  {getTranslation(language, "auth.sign_up")}
                </button>
              </>
            ) : (
              <>
                {getTranslation(language, "auth.already_have")}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-black hover:underline"
                >
                  {getTranslation(language, "auth.sign_in")}
                </button>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
