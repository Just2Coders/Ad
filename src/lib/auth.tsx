import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // In a real app, you would validate against a backend
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = storedUsers.find(
      (u: any) => u.email === email && u.password === password,
    );

    if (user) {
      const userData = { email: user.email };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/home");
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = (email: string, password: string) => {
    // In a real app, you would make an API call to register
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (storedUsers.some((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser = { email, password };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // Auto login after registration
    const userData = { email };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/home");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
