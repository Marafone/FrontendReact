import React, { createContext, useContext, useState } from "react";

interface UserData {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = createContext<UserData | undefined>(undefined);

export const UserProvider: React.FC<any> = ({children}) => {
  const [username, setUsername] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const userContext = useContext(UserContext);
  if (userContext === undefined) {
    throw new Error("You should use UserProvider instead of UserContext.Provider");
  }
  return userContext;
};
