// src/features/auth/context/AuthProvider.tsx
import { useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { AuthContext, AuthContextType } from "./AuthContext";
import {
  signUp as firebaseSignUp,
  signIn as firebaseSignIn,
  logOut as firebaseLogOut,
  onAuthChange,
  signInWithGoogle as firebaseSignInWithGoogle,
  forgotPassword as firebaseForgotPassword,
  confirmResetPassword as firebaseConfirmResetPassword,
} from "../../../lib/firebase";
import { GetUser, RegisterUser } from "../../../lib/api/user";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [userCredits, setUserCredits] = useState<any | null>(null);
  const [isFetchUser, setIsFetchUser] = useState(false);
  const [isDisplayedNotification, setIsDisplayedNotification] = useState(false);
  const [isEnableEnhanceLipSync, setIsEnableEnhanceLipSync] = useState(false);
  const [isEnableEnhanceUGCActor, setIsEnableEnhanceUGCActor] = useState(false);
  const [ugcModel, setUgcModel] = useState<string | null>("V 01.1");
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      GetUser(user.email).then((res) => {
        setUserData(res);
        setUserCredits(res.credits);
      });
    }
  }, [user, isFetchUser]);

  const handleSignInWithGoogle = async () => {
    try {
      setError(null);
      const user = await firebaseSignInWithGoogle();

      if (user.email) {
        const displayName = user.displayName || "Unknown User";
        await RegisterUser(user.email, displayName);
        window.location.href = "/ugc-actor";
        return true;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google"
      );
      throw err;
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setError(null);
      const user = await firebaseSignUp(email, password, name);

      if (user.email) {
        await RegisterUser(user.email, name);
        await firebaseLogOut();
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
      throw err;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      await firebaseSignIn(email, password);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      throw err;
    }
  };

  const handleLogOut = async () => {
    try {
      setError(null);
      await firebaseLogOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log out");
      throw err;
    }
  };

  const handleSendResetPassword = async (email: string) => {
    try {
      setError(null);
      await firebaseForgotPassword(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset password"
      );
      throw err;
    }
  };

  const handleConfirmResetPassword = async (
    code: string,
    newPassword: string
  ) => {
    try {
      setError(null);
      await firebaseConfirmResetPassword(code, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    userCredits,
    userData,
    loading,
    error,
    isFetchUser,
    isDisplayedNotification,
    isEnableEnhanceLipSync,
    setIsEnableEnhanceLipSync,
    setIsDisplayedNotification,
    setIsEnableEnhanceUGCActor,
    isEnableEnhanceUGCActor,
    ugcModel,
    setUgcModel,
    setUserCredits,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    logOut: handleLogOut,
    sendResetPassword: handleSendResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    setIsFetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
