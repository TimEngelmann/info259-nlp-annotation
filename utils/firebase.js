import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, getDoc, onSnapshot, startAfter, increment } from "firebase/firestore";

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

// Annotation Functions

const updateAnnotation = (annotationState, user) => {
  const annotationRef = doc(db, "annotations", annotationState.id);
  setDoc(annotationRef, {  
    first_name: annotationState.first_name, 
    last_name: annotationState.last_name,
    gender: annotationState.gender,
    archetype: annotationState.archetype} ,
    { merge: true },
    );
  
  const userRef = doc(db, "users", user.uid);
  setDoc(userRef, {annotation_count: increment(1)}, { merge: true });
}

const getAnnotations = async (annotator_id, annotationsArray, setAnnotationArray) => { 

    const annotationCol = collection(db, "annotations");
    
    if (typeof annotator_id !== 'undefined'){
      var q = query(annotationCol, where("annotator_id", "==", annotator_id), where("archetype", "==", ""), orderBy("book_id"), limit(10));

      /*if(annotationsArray.length > 0){
        q = query(annotationCol, where("annotator", "==", ""), limit(2), orderBy('book_id'), startAfter(annotationsArray[annotationsArray.length - 1].book_id));
      }*/
      
      // console.log("Make annotations request")
      const querySnapshot = await getDocs(q);

      var annotations = []
      querySnapshot.forEach((doc) => {
      
        // check if already in fetched data
        if(annotationsArray.filter(e => e.id ===  doc.id).length === 0){
          var annotation = doc.data()
          annotation.id = doc.id
          annotations.push(annotation)
        }
      });

      if(annotations.length === 0){
        const annotation_empty = {"dummy": "finished"}
        annotations.push(annotation_empty)
      }

      const all_annotations = annotationsArray.concat(annotations)
      setAnnotationArray(all_annotations)
    }
}

const getRelatedAnnotations = async (annotationState, setRelatedAnnotations) => { 

  const annotationCol = collection(db, "annotations");
  
  // console.log("Make related annotations request")
  var q = query(annotationCol, where("book_id", "==", annotationState.book_id), limit(10));
  const querySnapshot = await getDocs(q);

  var annotations = [annotationState]
  querySnapshot.forEach((doc) => {
    if(annotationState.id !== doc.id){
      var annotation = doc.data()
      annotation.id = doc.id
      annotations.push(annotation)
    }
  });

  setRelatedAnnotations(annotations)
  
}

const getAnnotationsLive = async (setAnnotationArray) => { 
  const annotationCol = collection(db, "annotations");
  const q = query(annotationCol, where("annotator", "==", ""), limit(3));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const annotations = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      var annotation = doc.data()
      annotation.id = doc.id
      annotations.push(annotation)
    });
    setAnnotationArray(annotations)
  });
}

export { auth, db, updateAnnotation, getAnnotations, getAnnotationsLive, getRelatedAnnotations };
