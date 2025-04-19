import React, { createContext, useContext, useEffect, useState } from "react";
import axiosWithLogout from "../axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

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
    username == null ? localStorage.removeItem("usernameValue") : localStorage.setItem("usernameValue", JSON.stringify(username))
  }, [username]);


  const navigate = useNavigate();

  // set interceptor to automatically remove user from context and redirect him to login page on 401 received from backend
  useEffect(() => {
    axiosWithLogout.interceptors.response.use(
      response => response,
      error => {
        const message = error.response.data || 'Something went wrong';
    
        if (error.response.status === 401) {
          setUsername(null)
          navigate("/login")
          toast.error("You need to login first to do that action. If you already logged in then your session expired", {
            toastId: "not-logged-in"
          })
        }else{
          toast.error(message)
        }

        return Promise.reject(error);
      }
    );
  }, [])

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