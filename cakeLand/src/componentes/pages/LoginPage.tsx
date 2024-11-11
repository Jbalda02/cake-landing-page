import logo from "./../../assets/logo.webp";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./../../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

function LoginPage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) return <div>No UserContext available</div>;
  const { setUser } = userContext;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const signInGoogleSuccess = (response: any) => {
    const decodedUser: any = jwtDecode(response.credential);

    const nameParts: string[] = decodedUser.name.split(" ");

    const firstName: string = nameParts.slice(0, 2).join(" ");
    const lastName: string = nameParts.slice(2).join(" ");

    //console.log(decodedUser);
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: decodedUser.email,
      picture: decodedUser.picture,
    };
    setUser(userData);
    //console.log(userData);
    navigate("/");
  };
  const signInGoogleFailed = () => {
    console.log("Login failed");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };
  const handleLogin = () => {
    loginUser(email, password);
  };
  const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User logged in: ", user);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update context with additional user data
        setUser({
          email: user.email ?? "",
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          picture: userData.picture ?? "",
          id: user.uid ?? "",
          phone: user.phoneNumber ?? "",
          cart:[]
        });
      } else {
      //   console.log("No user data found in Firestore.");
      }
      // Handle logged-in user, e.g., set context, redirect
      navigate("/");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setErrorMessage("No user found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setErrorMessage("The email address is not valid.");
          break;
        default:
          setErrorMessage("An error occurred. Please try again.");
      }
      console.error("Error logging in: ", error);
    }
  };
  return (
    <div className=" bg-white-background flex flex-col h-screen gap-6 justify-center content-center items-center">
      <label className="text-4xl">Login Page</label>
      <img src={logo} className="max-w-32"></img>
      <label className="text-3xl">Nene Cake</label>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <label className="mr-48">Usuario</label>
      <input
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="text"
        placeholder="Ingrese el Usuario"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>
      <label className="mr-44">Contrasena</label>
      <input
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
        placeholder="Ingrese la Contrasena"
        className="py-2 px-2 border rounded-md border-black min-w-64"
      ></input>
      <button
        className="bg-red-300 rounded-md min-w-60 min-h-7 py-2 px-2 text-white hover:bg-red-700"
        onClick={handleLogin}
      >
        Ingresar
      </button>
      <div className="w-64 h-0 border border-black"></div>
      <button
        className="bg-red-300 rounded-md min-w-60 min-h-7 py-2 px-2  text-white hover:bg-red-700"
        onClick={navigateToRegister}
      >
        Registrarse
      </button>
      <GoogleLogin
        onSuccess={signInGoogleSuccess}
        onError={signInGoogleFailed}
      ></GoogleLogin>
    </div>
  );
}
export default LoginPage;
