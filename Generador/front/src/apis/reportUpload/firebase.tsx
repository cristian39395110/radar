import { initializeApp } from "firebase/app";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.REACT_APP_FIREBASE_URL,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

export const loginToFirebase = () => {
  return signInAnonymously(auth);
};

export const uploadFile = async (file: Blob, folder: string, name: string) => {
  const reportRef = ref(storage, `reports/${folder}/${name}`);
  await uploadBytes(reportRef, file);

  return getDownloadURL(reportRef);
};
