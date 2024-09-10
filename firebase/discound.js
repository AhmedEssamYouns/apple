import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export const fetchDiscountCodes = (callback) => {
    const discountsCollectionRef = collection(db, 'discountCodes');
    const unsubscribe = onSnapshot(discountsCollectionRef, (querySnapshot) => {
        const discountsData = [];
        querySnapshot.forEach((doc) => {
            const discountData = doc.data();
            discountData.id = doc.id;
            discountsData.push(discountData);
        });
        callback(discountsData);
    });
    return unsubscribe;
};

export const addDiscountCode = async (code, amount) => {
    try {
        await addDoc(collection(db, 'discountCodes'), { code, amount });
    } catch (error) {
        console.error('Error adding discount code: ', error);
        throw new Error('Error adding discount code');
    }
};

export const deleteDiscountCode = async (discountCodeId) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'discountCodes'), where('code', '==', discountCodeId)));
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    } catch (error) {
        console.error('Error deleting discount code: ', error);
        throw new Error('Error deleting discount code');
    }
};
