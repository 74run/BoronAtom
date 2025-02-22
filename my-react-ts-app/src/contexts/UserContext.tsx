import { createContext } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  userData: {
    userID: string;
    email: string;
    // Add other user fields as needed
  } | null;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  userData: null,
  isLoading: true
}); 