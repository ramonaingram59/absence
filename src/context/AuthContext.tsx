import { getCurrentUser } from "@/lib/actions/api/auth";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
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
      // const { data: currentAccount } = useGetCurrentUser();
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

        return true;
      }

      return false;
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
    const cookieFallback = localStorage.getItem("cookieFallback");

    if (
      cookieFallback == "[]" ||
      cookieFallback == null ||
      cookieFallback == undefined
    ) {
      navigate("/signin");
    }

    checkAuthUser();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
