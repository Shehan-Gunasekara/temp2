import { useState, useEffect } from "react";
import { User } from "firebase/auth";

// import {
//   signUp,
//   signIn,
//   logOut,
//   onAuthChange,
//   signInWithGoogle,
//   auth,
//   forgotPassword,
//   confirmResetPassword,
// } from "../lib/firebase";

// import { GetUser, RegisterUser } from "../lib/api/user";

import {
  signUp,
  signIn,
  logOut,
  onAuthChange,
  signInWithGoogle,
  auth,
  forgotPassword,
  confirmResetPassword,
} from "../../../lib/firebase";
import { GetUser, RegisterUser } from "../../../lib/api/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [userCredits, setUserCredits] = useState<any | null>(null);
  const [isFetchUser, setIsFetchUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.email) {
        GetUser(user.email).then((res) => {
          setUserData(res);
          setUserCredits(res.credits);
        });
      }
    }
  }, [user, isFetchUser]);

  const handleSignInWithGoogle = async () => {
    try {
      setError(null);

      const user = await signInWithGoogle();

      if (user.email) {
        const displayName = user.displayName || "Unknown User"; // Use a fallback if displayName is not available
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
      const user = await signUp(email, password, name);

      if (user.email) {
        await RegisterUser(user.email, name);
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
      await signIn(email, password);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      throw err;
    }
  };
  const handleLogOut = async () => {
    try {
      setError(null);
      await logOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log out");
      throw err;
    }
  };
  const sendResetPassword = async (email: string) => {
    try {
      setError(null);
      await forgotPassword(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset password"
      );
      throw err;
    }
  };

  const confirmResetPassword = async (code: string, newPassword: string) => {
    try {
      setError(null);
      await confirmResetPassword(code, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      throw err;
    }
  };

  return {
    user,
    userCredits,
    userData,
    loading,
    error,
    isFetchUser,
    setUserCredits,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    logOut: handleLogOut,
    sendResetPassword,
    confirmResetPassword,
    setIsFetchUser,
  };
}
