import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

// Provide default value
const defaultValue: UserData = {
  username: "",
  setUsername: () => {},
};

export const UserContext = createContext<UserData | undefined>(undefined);

export const UserProvider: React.FC<any> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() => {
    const storedUsername = localStorage.getItem("usernameValue");
    return storedUsername ? JSON.parse(storedUsername) : null;
  });

  // save username to localStorage every time username is changed
  useEffect(() => {
    localStorage.setItem("usernameValue", JSON.stringify(username)); // TODO don't store it in localStorage, use cookie instead
  }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const userContext = useContext(UserContext);
  if (userContext === undefined) {
    throw new Error(
      "You should use UserProvider instead of UserContext.Provider"
    );
  }
  return userContext;
};
