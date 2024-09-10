import { collection, doc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from './config';
import { ToastAndroid } from 'react-native';

// Function to handle form submission
export const submitContactForm = async (name, subject, message) => {
    try {
        if (!name || !subject || !message) {
            throw new Error('Please fill out all the fields before submitting');
        }

        await addDoc(collection(db, 'contacts'), {
            name,
            subject,
            message,
            user: FIREBASE_AUTH.currentUser?.email || 'Anonymous',
            createdAt: serverTimestamp(),
        });

        ToastAndroid.show('Message submitted, will reply as soon as possible', ToastAndroid.LONG);
    } catch (error) {
        ToastAndroid.show(error.message || 'Failed to submit message', ToastAndroid.SHORT);
        console.error('Error writing document: ', error);
    }
};



export const fetchContactMessages = (callback) => {
    const contactMessagesCollectionRef = collection(db, 'contacts');
    const orderByDate = orderBy('createdAt');
    const contactMessagesQuery = query(contactMessagesCollectionRef, orderByDate);

    const unsubscribe = onSnapshot(contactMessagesQuery, (querySnapshot) => {
        const contactMessagesData = [];
        querySnapshot.forEach((doc) => {
            const contactMessageData = doc.data();
            contactMessageData.id = doc.id;
            contactMessagesData.push(contactMessageData);
        });
        callback(contactMessagesData);
    });

    return unsubscribe;
};

export const markAsResponded = async (contactMessageId) => {
    try {
        await updateDoc(doc(db, 'contacts', contactMessageId), { responded: true });
    } catch (error) {
        console.error('Error updating contact message: ', error);
        throw new Error('Error updating contact message');
    }
};
