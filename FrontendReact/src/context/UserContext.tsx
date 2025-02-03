import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = createContext<UserData | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() => {
    try {
      const storedUsername = localStorage.getItem("usernameValue");
      return storedUsername ? JSON.parse(storedUsername) : null;
    } catch {
      return null;
    }
  });

  // Save username to localStorage every time it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("usernameValue", JSON.stringify(username));
      console.log(localStorage.usernameValue);
    } else {
      localStorage.removeItem("usernameValue"); // Ensure it's removed on logout
    }
  }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext safely
export const useUserContext = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUserContext must be used within a UserProvider.");
  }
  return userContext;
};