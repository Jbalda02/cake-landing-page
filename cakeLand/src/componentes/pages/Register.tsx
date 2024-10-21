import logo from "./../../assets/logoTest.png";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../../../firebaseConfig";
import { FirebaseError } from "firebase/app"; // Ensure this import is present

function ReginsterPage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  if (!userContext) return <div>No UserContext available</div>;
  const validateRegister = async () => {
    if (!firstName || !lastName || !password || !confirmPassword) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created: ", user);

      const additionalData = {
        firstName,
        lastName,
        email: user.email,
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", user.uid), additionalData);
      console.log("User created and data saved in Firestore:", user);
      navigate("/login");
    } catch (error) {
      console.error("Error creating user: ", error);
      // Set specific error messages based on the error code
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        setErrorMessage("El correo electrónico ya está en uso.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setErrorMessage("El correo electrónico no es válido.");
      } else if (firebaseError.code === "auth/weak-password") {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setErrorMessage("Ocurrió un error. Por favor, intenta nuevamente.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen gap-3 justify-center content-center items-center">
      <label className="text-4xl">Register Page</label>
      <img src={logo} className="max-w-32"></img>
      <label className="text-3xl">LandCake</label>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <label className="mr-48">Nombre </label>
      <input
        onChange={(e) => setFirstName(e.target.value)}
        type="text"
        placeholder="Ingrese el nombre"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>

      <label className="mr-48">Apellido </label>
      <input
        onChange={(e) => setLastName(e.target.value)}
        type="text"
        placeholder="Ingrese el apellido"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>

      <label className="mr-32">Correo Electronico </label>
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Ingrese el Correo Electronico"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>

      <label className="mr-44">Contrasena</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Ingrese la Contrasena"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>

      <label className="mr-28">Confirmar Contrasena</label>
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Ingrese la Contrasena"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>

      <button
        className="bg-red-300 rounded-md min-w-60 min-h-7 py-2 px-2 text-white hover:bg-red-700"
        onClick={validateRegister}
      >
        Registrarse
      </button>
    </div>
  );
}
export default ReginsterPage;
