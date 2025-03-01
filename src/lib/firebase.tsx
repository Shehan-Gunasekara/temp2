import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  browserPopupRedirectResolver,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  // updateEmail,
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { FirebaseStorage } from "firebase/storage";
import { Firestore } from "firebase/firestore";

// Default configuration for development/demo mode
const defaultConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
  measurementId: "demo-measurement-id",
};

// Get configuration from environment variables or use defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    defaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId,
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Create mock implementations for development/demo mode
  const mockApp = {} as FirebaseApp;
  auth = {
    app: mockApp,
    name: "auth",
    currentUser: null,
  } as unknown as Auth;
  storage = {} as FirebaseStorage;
  db = {} as Firestore;
}

// Initialize collections
export const generatedImagesCollection = collection(db, "generated_images");
export const trainingRecordsCollection = collection(db, "training_records");

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider,
      browserPopupRedirectResolver
    );

    return result.user;
  } catch (error: any) {
    if (error.code === "auth/popup-blocked") {
      throw new Error(
        "Please allow popups for this website to sign in with Google"
      );
    }
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign in cancelled. Please try again");
    }
    if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized for Google sign in");
    }
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update the display name
    await updateProfile(userCredential.user, {
      displayName,
    });

    // Send email verification
    await sendEmailVerification(userCredential.user);

    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters");
    }
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user.emailVerified == false) {
      throw new Error("Please verify your email address");
    } else {
      return userCredential.user;
    }
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid email or password");
    }
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email");
    }
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    // Clear any local storage or session data
    sessionStorage.removeItem("userSession");
    localStorage.removeItem("userSession");
  } catch (error) {
    throw new Error("Failed to sign out");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Password reset email sent. Check your inbox.";
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email");
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email format");
    }
    throw error;
  }
};

export const confirmResetPassword = async (
  code: string,
  newPassword: string
) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    return "Password has been reset successfully.";
  } catch (error: any) {
    if (error.code === "auth/expired-action-code") {
      throw new Error("The reset link has expired. Please request a new one.");
    }
    if (error.code === "auth/invalid-action-code") {
      throw new Error("Invalid or malformed reset code.");
    }
    throw error;
  }
};

export const resetPasswordWithCurrentPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently logged in.");
    }

    // Step 1: Re-authenticate the user
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Step 2: Update the password
    await updatePassword(user, newPassword);

    return "Password has been successfully updated.";
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      throw new Error("The current password is incorrect.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error(
        "The new password is too weak. Use at least 6 characters."
      );
    }
    throw new Error("Unable to update password. Please try again later.");
  }
};

export const uploadImageAndUpdateProfilePicture = async (file: File) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently logged in.");
    }

    // Step 1: Upload the image to Firebase Storage
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    // Step 2: Retrieve the download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Step 3: Update the user's profile picture with the download URL
    await updateProfile(user, { photoURL: downloadURL });

    return "Profile picture has been successfully uploaded and updated.";
  } catch (error: any) {
    throw new Error(
      "Failed to upload or update profile picture. Please try again later."
    );
  }
};

export const updateDisplayName = async (newDisplayName: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently logged in.");
    }

    // Update the display name
    await updateProfile(user, { displayName: newDisplayName });

    return "Display name has been successfully updated.";
  } catch (error: any) {
    throw new Error("Failed to update display name. Please try again later.");
  }
};

export const updateUserEmailWithVerification = async (
  currentPassword: string,
  // newEmail: string
) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently logged in.");
    }

    // Step 1: Re-authenticate the user
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Step 2: Send verification email to the new email
    await sendEmailVerification(user);

    return "Verification email sent. Please check your inbox to confirm the new email.";
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      throw new Error(
        "Please log in again to update your email for security reasons."
      );
    }
    if (error.code === "auth/invalid-email") {
      throw new Error("The new email address is invalid.");
    }
    throw new Error(
      "Failed to send verification email. Please try again later."
    );
  }
};

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, storage, db };
