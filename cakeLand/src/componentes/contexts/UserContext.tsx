import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { User } from "./../../types.ts";
import { auth } from "./../../../firebaseConfig.ts";
import { getUserCart } from "../../services/userQueries.ts";

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  /** True until Firebase has reported the initial auth state. */
  authLoading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Use the already-initialised auth instance rather than calling getAuth()
    // again, so this always points at the same Firebase app.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(undefined);
        setAuthLoading(false);
        return;
      }

      const userCart = await getUserCart(firebaseUser.uid);
      const nameParts = firebaseUser.displayName?.trim().split(/\s+/) ?? [];

      setUser({
        id: firebaseUser.uid,
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" "),
        email: firebaseUser.email ?? "",
        picture: firebaseUser.photoURL ?? "",
        phone: firebaseUser.phoneNumber ?? "",
        cart: userCart,
      });
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authLoading }}>{children}</UserContext.Provider>
  );
};
