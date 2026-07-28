import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

import logo from "./../../assets/logo-256.webp";
import { UserContext } from "../contexts/UserContext";
import { db, auth } from "./../../../firebaseConfig";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Feedback";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No existe una cuenta con este correo.",
  "auth/wrong-password": "Contraseña incorrecta. Inténtalo de nuevo.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento e inténtalo otra vez.",
  "auth/operation-not-allowed":
    "El inicio de sesión con Google no está habilitado en este proyecto de Firebase.",
  "auth/account-exists-with-different-credential":
    "Ya existe una cuenta con este correo. Ingresa con tu contraseña.",
};

function LoginPage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Hooks must run unconditionally — the old component returned early when the
  // context was missing and declared useState below that return.
  const setUser = userContext?.setUser;

  /**
   * GoogleLogin (Google Identity Services) hands back a Google ID token — it
   * does NOT create a Firebase session on its own. We have to trade that token
   * for a Firebase credential, otherwise onAuthStateChanged never fires, the
   * user context stays empty and every Firestore read is rejected by the
   * security rules for having no request.auth.
   */
  const signInGoogleSuccess = async (response: CredentialResponse) => {
    setErrorMessage(null);

    if (!response.credential) {
      setErrorMessage("No pudimos completar el inicio de sesión con Google.");
      return;
    }

    setSubmitting(true);
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      const { user } = await signInWithCredential(auth, credential);

      // First-time Google users have no /users document yet, so the cart and
      // checkout pages would have nothing to read.
      const userRef = doc(db, "users", user.uid);
      if (!(await getDoc(userRef)).exists()) {
        const nameParts = user.displayName?.trim().split(/\s+/) ?? [];
        await setDoc(userRef, {
          firstName: nameParts[0] ?? "",
          lastName: nameParts.slice(1).join(" "),
          email: user.email ?? "",
          picture: user.photoURL ?? "",
          phone: user.phoneNumber ?? "",
          createdAt: new Date(),
          cart: [],
        });
      }

      navigate("/");
    } catch (error) {
      const code = (error as FirebaseError).code;
      setErrorMessage(ERROR_MESSAGES[code] ?? "No pudimos conectar con Google.");
      console.error("Error con Google Sign-In: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Ingresa tu correo y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      setUser?.({
        id: user.uid,
        email: user.email ?? "",
        firstName: userData.firstName ?? "",
        lastName: userData.lastName ?? "",
        picture: userData.picture ?? "",
        phone: userData.phone ?? user.phoneNumber ?? "",
        cart: Array.isArray(userData.cart) ? userData.cart : [],
      });

      navigate("/");
    } catch (error) {
      const code = (error as FirebaseError).code;
      setErrorMessage(ERROR_MESSAGES[code] ?? "Ocurrió un error. Inténtalo nuevamente.");
      console.error("Error logging in: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 lg:flex-row">
      {/* Brand panel */}
      <aside className="relative hidden bg-plum-sheen lg:flex lg:w-5/12 lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="h-12 w-12 rounded-full border border-plum-600" />
          <span className="font-display text-xl font-semibold text-cream-50">Nene Cakes</span>
        </Link>

        <div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-cream-50">
            Bienvenido de vuelta
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-plum-200">
            Accede para revisar tus pedidos, guardar tus postres favoritos y pagar más rápido.
          </p>
        </div>

        <p className="text-xs text-plum-300">© {new Date().getFullYear()} Nene Cakes</p>
      </aside>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <img src={logo} alt="" className="h-14 w-14 rounded-full" />
            <span className="font-display text-xl font-semibold text-ink">Nene Cakes</span>
          </Link>

          <h1 className="font-display text-3xl font-semibold text-ink">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-ink-soft">
            ¿Aún no tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-plum-700 hover:underline">
              Regístrate
            </Link>
          </p>

          {errorMessage && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-blush-300 bg-blush-100 px-4 py-3 text-sm text-blush-500"
            >
              {errorMessage}
            </p>
          )}

          {/* A real <form> so Enter submits — the old page used a bare button. */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? <Spinner className="h-5 w-5 border-2" /> : "Ingresar"}
            </Button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-cream-300" />
            <span className="text-xs uppercase tracking-wider text-ink-muted">o continúa con</span>
            <span className="h-px flex-1 bg-cream-300" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={signInGoogleSuccess}
              onError={() => setErrorMessage("No pudimos conectar con Google.")}
              width="320"
            />
          </div>

          <Link
            to="/"
            className="mt-8 block text-center text-sm text-ink-muted hover:text-plum-700"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
