import { initializeApp } from 'firebase/app'
import { getStorage } from "firebase/storage";
// ... other firebase imports

export const firebaseApp = initializeApp({
  // application settings
  apiKey: "AIzaSyDmpLPfrkRjskDp4P2fSbLvMUrHjEq9DWA",
  authDomain: "primeval-stack-408400.firebaseapp.com",
  projectId: "primeval-stack-408400",
  storageBucket: "primeval-stack-408400.appspot.com",
  messagingSenderId: "462093202517",
  appId: "1:462093202517:web:17d506ecb43e7e59a7d0dc",
  measurementId: "G-YEEV13GE43"
})

// here we can export reusable database references
export const thymeStorage = getStorage(firebaseApp)