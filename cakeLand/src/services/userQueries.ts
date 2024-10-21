import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./../../firebaseConfig"; // Import Firestore

const getUserByEmail = async (email: string) => {
    try {
        // Reference to the 'users' collection
        const usersRef = collection(db, "users");
    
        // Query to find the user with the matching email
        const q = query(usersRef, where("email", "==", email));
    
        // Execute the query
        const querySnapshot = await getDocs(q);
    
        // Return the entire query snapshot (containing one or more documents)
        return querySnapshot;
      } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
  }
};
export {getUserByEmail} 