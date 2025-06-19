import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCdE2cV4_NQoJG7h5YG1nHzQa-RNfKBUOc",
  authDomain: "collabcode-fkv3n.firebaseapp.com",
  databaseURL: "https://collabcode-fkv3n-default-rtdb.firebaseio.com",
  projectId: "collabcode-fkv3n",
  storageBucket: "collabcode-fkv3n.firebasestorage.app",
  messagingSenderId: "1018935927558",
  appId: "1:1018935927558:web:68e4203b394194fadeb487"
};

const app = initializeApp(firebaseConfig);

export { app };