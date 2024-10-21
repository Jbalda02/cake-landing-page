import { collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from './../../firebaseConfig.ts';
import { User } from "../types";
import bcrypt from "bcryptjs"; 

export const addUser = async (user: User, password: string) => {
    try {
        console.log("Adding User")
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Hashed Password:", hashedPassword); // Check the hashed password in the console

        // Create user object with hashed password
        const userWithPassword = {
            ...user,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Save user to Firestore and get the document reference
        const docRef = await addDoc(collection(db, "users"), userWithPassword);

        // Update the document in Firestore with the 'id' field
        await updateDoc(docRef, { id: docRef.id });

        console.log("Usuario agregado con ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error al agregar el usuario: ", e);
        throw e;
    }
};
