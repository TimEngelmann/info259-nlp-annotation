import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { query, where, orderBy, limit } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Users Functions

const getUsers = async () => {
  const usersCol = collection(db, "users");
  const usersSnapshot = await getDocs(usersCol, "users");
  usersSnapshot.docs.forEach((doc) => console.log(doc.data()));
};

// Annotation Functions

const updateAnnotation = (annotationState, annotator) => {
  console.log(annotationState)
  const annotationRef = doc(db, "annotations", annotationState.book_id);
  setDoc(annotationRef, { 
    description_original: annotationState.description_original, 
    description: annotationState.description, 
    first_name: annotationState.first_name, 
    last_name: annotationState.last_name,
    gender: annotationState.gender,
    archetype: annotationState.archetype ,
    annotator: annotator} ,
    { merge: true },
    );
}

const getAnnotations = async (annotationsArray, setAnnotationArray) => { 
    console.log("Making request to get annotations")
    const annotationCol = collection(db, "annotations");
    const q = query(annotationCol, where("annotator", "==", ""), limit(3));
    const querySnapshot = await getDocs(q);

    var annotations = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      var annotation = doc.data()
      annotation.book_id = doc.id
      annotations.push(annotation)
    });

    const all_annotations = annotationsArray.concat(annotations)
    console.log("Here is what I now have in total: ", all_annotations)
    setAnnotationArray(all_annotations)
}

const getAnnotationsLive = async (setAnnotationArray) => { 
  const annotationCol = collection(db, "annotations");
  const q = query(annotationCol, where("annotator", "==", ""), limit(3));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const annotations = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      var annotation = doc.data()
      annotation.book_id = doc.id
      annotations.push(annotation)
    });
    setAnnotationArray(annotations)
  });
}

export { auth, db, getUsers, updateAnnotation, getAnnotations, getAnnotationsLive };
