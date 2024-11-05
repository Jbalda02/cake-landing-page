import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc
} from "firebase/firestore";
import { db } from "./../../firebaseConfig"; // Import Firestore
import { CartItem } from "../types";
const updateUserCart = async (userId: string, cart: CartItem[]) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { cart }, { merge: true }); // Merge to avoid overwriting other user fields
    console.log("User cart updated successfully");
  } catch (error) {
    console.error("Error updating user cart: ", error);
  }
};

// Get user cart by user ID
const getUserCart = async (userId: string) => {
  try {
    // Reference to the user's document
    const userDocRef = doc(db, "users", userId); // Assuming you have a collection named 'users'

    // Fetch the user document
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Return the cart field from the user document
      const userData = userDocSnap.data();
      return userData.cart || []; // Return cart if it exists, otherwise return an empty array
    } else {
      console.log("No user found with this ID!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user cart: ", error);
    throw error;
  }
};

const getProductsByUID = async (productId: string) => {
  try {
    const docRef = doc(db, "producto", productId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such product!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID: ", error);
    throw error;
  }
};

const getProductsByType = async (type: string) => {
  try {
    const productsRef = collection(db, "producto");
    const q = query(productsRef, where("type", "==", type));
    const qSnap = await getDocs(q);
    const products = qSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
const getProductsByStarred = async (isStarred: boolean) => {
  console.log(`Fetching products with starred: ${isStarred}`); // Check the value of isStarred
  try {
    const productsRef = collection(db, "producto");
    const productsQuery = query(productsRef, where("starred", "==", isStarred));
    const querySnapshot = await getDocs(productsQuery);

    // Check how many documents were found
    console.log(`Documents found: ${querySnapshot.docs.length}`);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched Products: ", products); // Log fetched products
    return products;
  } catch (error) {
    console.error("Error fetching starred products: ", error);
    return [];
  }
};
export {
  getProductsByType,
  getProductsByUID,
  getProductsByStarred,
  getUserCart,
  updateUserCart,
};
