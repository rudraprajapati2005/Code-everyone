import {getFirestore, collection, getDocs,doc,setDoc} from "firebase/firestore";
import {app} from "../firebaseConfig";
import { getAuth, deleteUser } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Get a reference to the database service
const database = getDatabase();
const auth = getAuth();
const user = auth.currentUser;
const userId = user ? user.uid : null
const userRef = ref(database, 'users/' + userId);

import { get, ref } from "firebase/database";

async function getProjects(userId) {
  const snapshot = await get(ref(db, `users/${userId}/projects`));
  if (snapshot.exists()) {
    return snapshot.val(); // returns an object of projects
  } else {
    return null;
  }
}
function saveProjectName(userId, projectId, projectName) {
  set(ref(db, `users/${userId}/projects/${projectId}`), {
    name: projectName
  });
}
