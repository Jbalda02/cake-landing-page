// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// NOTE: these values are safe to ship in a web client — Firebase identifies the
// project with them, it does not authorise access. Access control lives in
// firestore.rules / storage.rules.
const firebaseConfig = {
  apiKey: "AIzaSyCRJ3Fd4UWGf3l0eixsR6A-mYzaa9IHDek",
  authDomain: "oauthcakes.firebaseapp.com",
  projectId: "oauthcakes",
  storageBucket: "oauthcakes.appspot.com",
  messagingSenderId: "816219725719",
  appId: "1:816219725719:web:1f5e87206bec976327aed2",
  measurementId: "G-Q0LXDJ48M0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// getAnalytics() throws in environments without the required browser APIs
// (private windows, some in-app browsers, SSR). Initialise it defensively so a
// blocked analytics script can't take the whole app down at import time.
let analytics: Analytics | undefined;
isSupported()
  .then((supported) => {
    if (supported) analytics = getAnalytics(app);
  })
  .catch(() => {
    /* analytics is optional */
  });

export { db, analytics, auth };
