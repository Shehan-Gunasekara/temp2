import React from "react";
import { Button } from "../../ui/Button";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../features/auth/context/useAuth";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

export function NavActions() {
  const { user, logOut, userCredits } = useAuth();
  const { language } = useLanguage();
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", "/auth");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", "/purchase");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleSignOut = async () => {
    await logOut();
    window.location.reload();
  };

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center space-x-4">
      {user ? (
        <>
          <span className="text-sm text-black/60">
            {getTranslation(language, "navBar.welcome")}, {user.displayName}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            {getTranslation(language, "navBar.signout")}
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={handleAuth}>
          {getTranslation(language, "navBar.signin")}
        </Button>
      )}

      <Button size="sm" onClick={handlePurchase}>
        {user ? (
          <span className="text-white flex flex-row">
            {getTranslation(language, "navBar.credits")}:
            {userCredits != null ? (
              userCredits <= 0 ? (
                0.0
              ) : (
                userCredits.toFixed(2)
              )
            ) : (
              <Loader2 className="h-3 w-3 ml-2 mt-1 animate-spin" />
            )}
          </span>
        ) : (
          <span className="text-white">
            {" "}
            {getTranslation(language, "navBar.view_plans")}
          </span>
        )}
      </Button>
    </div>
  );
}
