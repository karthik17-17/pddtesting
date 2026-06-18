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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === "object" && parsedUser.name && parsedUser.email) {
          return parsedUser;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    // Clean up old keys automatically
    const oldKeys = ["currentUser", "profile", "username", "userName"];
    oldKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Auth token and user are now initialized synchronously in useState.
    // If the token is invalid or missing, we clear the user.
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!savedToken || !savedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
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