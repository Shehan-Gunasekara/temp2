import { auth } from "../firebase";
import { getIdToken } from "firebase/auth";

export const RegisterUser = async (email: string, name: string) => {
  const token = auth.currentUser ? await getIdToken(auth.currentUser) : null;
  try {
    await fetch(import.meta.env.VITE_END_POINT_URL + "/api/users/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify({ email, name }),
    });
  } catch (error: any) {
    throw error;
  }
};

export const GetUser = async (email: string) => {
  const token = auth.currentUser ? await getIdToken(auth.currentUser) : null;
  try {
    const url = new URL(
      `/api/users/v1/${email}`,
      import.meta.env.VITE_END_POINT_URL
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const resultData = await response.json();
    return resultData;
  } catch (error: any) {
    throw error;
  }
};
