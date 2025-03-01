// src/features/auth/context/AuthContext.tsx
import {
  createContext,
  // useEffect,
  //  ReactNode
} from "react";
import { User } from "firebase/auth";
// import {
//   signUp as firebaseSignUp,
//   signIn as firebaseSignIn,
//   logOut as firebaseLogOut,
//   onAuthChange,
//   signInWithGoogle as firebaseSignInWithGoogle,
//   forgotPassword as firebaseForgotPassword,
//   confirmResetPassword as firebaseConfirmResetPassword,
// } from "../../../lib/firebase";
// import { GetUser, RegisterUser } from "../../../lib/api/user";

export interface AuthContextType {
  user: User | null;
  userCredits: any | null;
  userData: any | null;
  loading: boolean;
  error: string | null;
  isFetchUser: boolean;
  isDisplayedNotification: boolean;
  isEnableEnhanceLipSync: boolean;
  setIsEnableEnhanceLipSync: any;
  isEnableEnhanceUGCActor: boolean;
  setIsEnableEnhanceUGCActor: any;
  setIsDisplayedNotification: any;
  ugcModel: string | null;
  setUgcModel: any;
  setUserCredits: (credits: any) => void;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<boolean | undefined>;
  signIn: (email: string, password: string) => Promise<boolean | undefined>;
  signInWithGoogle: () => Promise<boolean | undefined>;
  logOut: () => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (code: string, newPassword: string) => Promise<void>;
  setIsFetchUser: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
