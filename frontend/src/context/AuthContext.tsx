import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id?: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Clean up old keys automatically
    const oldKeys = ["currentUser", "profile", "username", "userName"];
    oldKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === "object" && parsedUser.name && parsedUser.email) {
          setToken(savedToken);
          setUser(parsedUser);
        } else {
          // If old wrong user data structure exists, clear it automatically
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const loginUser = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear any potential old keys on logout
    const oldKeys = ["currentUser", "profile", "username", "userName"];
    oldKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};