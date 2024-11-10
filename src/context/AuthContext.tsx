import { getCurrentUser } from "@/lib/actions/api/auth";
import { supabase } from "@/lib/supabase/connect";
import { IContextType, User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  departement: "",
  email: "",
  authId: "",
  imageUrl: "",
  role: "",
  password: "",
  imageId: "",
  NIK: null,
  position: "",
  status: "",
  createdAt: "",
  updatedAt: "",
};

export const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.id,
          name: currentAccount.name,
          departement: currentAccount.departement,
          email: currentAccount.email,
          authId: currentAccount.authId,
          imageUrl: currentAccount.imageUrl,
          role: currentAccount.role,
          password: null,
          imageId: currentAccount.imageId,
          NIK: currentAccount.NIK,
          position: currentAccount.position,
          status: currentAccount.status,
          createdAt: currentAccount.createdAt,
          updatedAt: currentAccount.updatedAt,
        });

        setIsAuthenticated(true);
        return true
      } else {
        setUser(INITIAL_USER)
        setIsAuthenticated(false)

        return false
      }

    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  useEffect(() => {
    checkAuthUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          navigate('/signin')
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
