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
import { db } from "./../../firebaseConfig";
import { CartItem } from "../types";

const eraseItemFromCartById = async (userId:string, productIdToRemove:string) => {
  const userRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userRef);
  const existingCart = userDocSnap.exists() ? userDocSnap.data().cart || [] : [];
  const updatedCart = existingCart.filter((item:CartItem) => item.product.id !== productIdToRemove);
  await setDoc(userRef, { cart: updatedCart }, { merge: true });

} 

const updateUserCart = async (userId: string, newCartItems: CartItem[]) => {
  try {
    const userRef = doc(db, "users", userId);

    // Fetch the current cart from Firestore
    const userDocSnap = await getDoc(userRef);
    const existingCart = userDocSnap.exists() ? userDocSnap.data().cart || [] : [];

    // Create a map to easily merge new items
    const cartMap = new Map<string, CartItem>();

    // Add existing items to the map
    existingCart.forEach((item: CartItem) => {
      cartMap.set(item.product.id, item);
    });

    newCartItems.forEach((newItem) => {
      cartMap.set(newItem.product.id, newItem);
    })

    // Convert the map back to an array and update Firestore
    const updatedCart = Array.from(cartMap.values());
    await setDoc(userRef, { cart: updatedCart }, { merge: true });

    console.log("User cart updated successfully");
  } catch (error) {
    console.error("Error updating user cart: ", error);
  }
};


const getUserCart = async (userId: string) => {
  try {

    const userDocRef = doc(db, "users", userId); 

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.cart || []; 
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
  eraseItemFromCartById
};
