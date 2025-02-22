import { useEffect, useState } from "react";
import { useAuthUser } from "./useAuthUser"; // The Firebase auth hook

const fetchUserId = async (email: string): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${email}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

export const useUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(null);
  const { user, isLoading } = useAuthUser(); // Get isLoading state

  useEffect(() => {
    // Only fetch userId if we have completed loading and have a user
    if (!isLoading && user?.email) {
      fetchUserId(user.email).then((id) => {
        setUserId(id);
      });
    }
  }, [user, isLoading]);

  return userId;
};
