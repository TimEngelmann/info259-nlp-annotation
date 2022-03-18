import Papa from 'papaparse';
import { archetypes } from "../components/constants";

const updateAnnotation = (annotationState, user) => {
    // console.log("cant update annotation")
}

const getAnnotations = async (file, setAnnotationArray, setAnnotationIdx) => { 
    var data = Papa.parse(file, {header: true,});
    const annotations = data.data.filter(annotation => annotation.book_id !== "")
    const labeled = annotations.filter(annotation => annotation.archetype !== "")
    setAnnotationArray(annotations)
    setAnnotationIdx(labeled.length)
}

const getRelatedAnnotations = async (annotationState, setRelatedAnnotations) => { 
    console.log("cant get related annotations")
}

const saveAnnotations = (annotationsArray) => {
    const csv = Papa.unparse(annotationsArray);
    const blob = new Blob([csv]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob, { type: 'text/csv' });
    a.download = 'books_annotations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export { updateAnnotation, getAnnotations, getRelatedAnnotations, saveAnnotations };