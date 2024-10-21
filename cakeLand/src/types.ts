// types.ts
export interface User {
    id?: string; // ID del usuario en Firestore
    firstName: string; // Primer nombre
    lastName: string; // Apellido
    email: string; // Correo electrónico
    picture?: string; // URL de la imagen de perfil (opcional)
}