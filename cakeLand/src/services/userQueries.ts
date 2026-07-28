import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "./../../firebaseConfig";
import { CartItem, Product } from "../types";

/**
 * Normalises a raw Firestore document into a Product.
 * Array fields are defaulted because several documents in the collection are
 * missing `ingredientes` / `alergenos`, and the detail page used to crash
 * calling .map() on undefined.
 */
const toProduct = (id: string, data: DocumentData): Product => ({
  id,
  name: data.name ?? "",
  descripcion: data.descripcion ?? "",
  precio: Number(data.precio) || 0,
  imgurl: Array.isArray(data.imgurl) ? data.imgurl : [],
  alergenos: Array.isArray(data.alergenos) ? data.alergenos : [],
  disponible: data.disponible !== false,
  ingredientes: Array.isArray(data.ingredientes) ? data.ingredientes : [],
  numPorciones: Number(data.numPorciones) || 0,
  starred: Boolean(data.starred),
  type: data.type ?? "otro",
});

const eraseItemFromCartById = async (userId: string, productIdToRemove: string) => {
  const userRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userRef);
  const existingCart: CartItem[] = userDocSnap.exists() ? userDocSnap.data().cart || [] : [];
  const updatedCart = existingCart.filter((item) => item.product.id !== productIdToRemove);
  await setDoc(userRef, { cart: updatedCart }, { merge: true });
  return updatedCart;
};

/**
 * Replaces the stored cart with `newCartItems`.
 * The previous implementation merged the incoming items into whatever was
 * already in Firestore, which meant removing an item locally and saving could
 * never actually delete it.
 */
const updateUserCart = async (userId: string, newCartItems: CartItem[]) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { cart: newCartItems }, { merge: true });
  } catch (error) {
    console.error("Error updating user cart: ", error);
    throw error;
  }
};

/** Always resolves to an array — callers iterate the result directly. */
const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const userDocSnap = await getDoc(doc(db, "users", userId));
    if (!userDocSnap.exists()) return [];
    const cart = userDocSnap.data().cart;
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.error("Error fetching user cart: ", error);
    return [];
  }
};

const getProductsByUID = async (productId: string): Promise<Product | null> => {
  try {
    const docSnap = await getDoc(doc(db, "producto", productId));
    if (!docSnap.exists()) return null;
    return toProduct(docSnap.id, docSnap.data());
  } catch (error) {
    console.error("Error fetching product by ID: ", error);
    throw error;
  }
};

const getProductsByType = async (type: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, "producto"), where("type", "==", type));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProduct(d.id, d.data()));
  } catch (error) {
    console.error("Error fetching products by type: ", error);
    return [];
  }
};

const getProductsByStarred = async (isStarred: boolean): Promise<Product[]> => {
  try {
    const q = query(collection(db, "producto"), where("starred", "==", isStarred));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toProduct(d.id, d.data()));
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
  eraseItemFromCartById,
};
