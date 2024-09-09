import { collection, addDoc, getDocs, getDoc, setDoc, doc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from './config';



// Fetch products from Firestore
export function getProducts(callback) {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      callback(productsData);
    }, (error) => {
      console.error('Error getting products from Firestore: ', error);
    });
  
    return unsubscribe;
  }



export async function addProduct(productData) {
    try {
        await addDoc(collection(db, "products"), productData);
    } catch (error) {
        console.error("Error adding product to Firestore: ", error);
    }
}




export async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, "products", productId));
    } catch (error) {
        console.error("Error deleting product from Firestore: ", error);
    }
}




export async function editProduct(productId, newData) {
    try {
        await updateDoc(doc(db, "products", productId), newData);
    } catch (error) {
        console.error("Error updating product in Firestore: ", error);
    }
}