import { createContext, useState, useEffect, ReactNode } from "react";
import { User} from "./../../types.ts"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserCart } from "../../services/userQueries.ts";

interface UserProviderProps {
  children: ReactNode;
}
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

}

export const UserContext = createContext<UserContextType | null>(null);
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth,async (firebaseUser) => {
      if (firebaseUser) {
        console.log(firebaseUser)

        const userCart = await getUserCart(firebaseUser.uid);
        const nameParts = firebaseUser.displayName?.split(" ") || [];
        setUser({
          id: firebaseUser.uid , 
          firstName:  nameParts[0] || "",
          lastName: nameParts[nameParts.length -1]  || "",
          email:  firebaseUser.email || "",
          picture:  firebaseUser.photoURL || "",
          phone: firebaseUser.phoneNumber || "",
          cart: userCart || []
        });
        console.log(user?.cart)
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
