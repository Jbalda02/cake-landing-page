import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";

import logo from "./../../assets/logo-256.webp";
import { auth, db } from "./../../../firebaseConfig";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Feedback";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "El correo electrónico ya está en uso.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/weak-password": "La contraseña es demasiado débil.",
};

/**
 * Ecuadorian numbers are usually typed as 09XXXXXXXX. Convert to E.164 so
 * libphonenumber can validate them.
 *
 * The old code called `await setPhone(...)` — a state setter is not a promise
 * and does not update the local `phone` variable, so validation always ran
 * against the raw "09…" string and rejected every valid local number.
 */
const normalisePhone = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed.startsWith("0")) return `+593${trimmed.slice(1)}`;
  if (trimmed.startsWith("+")) return trimmed;
  return `+593${trimmed}`;
};

function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // `email` was never checked before — you could submit the form without one
    // and only find out when Firebase rejected it.
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const e164Phone = normalisePhone(phone);
    if (!isValidPhoneNumber(e164Phone)) {
      setErrorMessage("El número de teléfono no es válido.");
      return;
    }
    const formattedPhone = parsePhoneNumber(e164Phone)?.formatInternational() ?? e164Phone;

    setSubmitting(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phone: formattedPhone,
        email: user.email,
        createdAt: new Date(),
        cart: [],
      });

      setPhone(formattedPhone);
      navigate("/");
    } catch (error) {
      const code = (error as FirebaseError).code;
      setErrorMessage(ERROR_MESSAGES[code] ?? "Ocurrió un error. Por favor, intenta nuevamente.");
      console.error("Error creating user: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 lg:flex-row">
      <aside className="relative hidden bg-plum-sheen lg:flex lg:w-5/12 lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="h-12 w-12 rounded-full border border-plum-600" />
          <span className="font-display text-xl font-semibold text-cream-50">Nene Cakes</span>
        </Link>

        <div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-cream-50">
            Crea tu cuenta
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-plum-200">
            Guarda tus direcciones, repite pedidos favoritos y recibe primero las novedades de
            temporada.
          </p>
        </div>

        <p className="text-xs text-plum-300">© {new Date().getFullYear()} Nene Cakes</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <img src={logo} alt="" className="h-14 w-14 rounded-full" />
            <span className="font-display text-xl font-semibold text-ink">Nene Cakes</span>
          </Link>

          <h1 className="font-display text-3xl font-semibold text-ink">Registrarse</h1>
          <p className="mt-2 text-sm text-ink-soft">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-plum-700 hover:underline">
              Inicia sesión
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nombre"
                autoComplete="given-name"
                placeholder="María"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Field
                label="Apellido"
                autoComplete="family-name"
                placeholder="Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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
              label="Número de teléfono"
              type="tel"
              autoComplete="tel"
              placeholder="0999999999"
              hint="Puedes escribirlo como 09XXXXXXXX o +593 99 999 9999."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Field
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              hint="Mínimo 8 caracteres."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Field
              label="Confirmar contraseña"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? <Spinner className="h-5 w-5 border-2" /> : "Crear cuenta"}
            </Button>
          </form>

          <Link to="/" className="mt-8 block text-center text-sm text-ink-muted hover:text-plum-700">
            ← Volver a la tienda
          </Link>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
