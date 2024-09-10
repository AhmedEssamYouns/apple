import { collection, doc, deleteDoc, updateDoc, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./config";
import { Toast, ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { ToastAndroid } from "react-native";


export async function deleteReview(reviewId) {
    try {
        await deleteDoc(doc(db, "reviews", reviewId));
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            textBody: "Review deleted",
            autoClose: 2000,
            titleStyle: {
                color: '#657786',
            },
            textBodyStyle: {
                color: '#657786',
            },
        });
    } catch (error) {
        console.error("Error deleting review: ", error);
        ToastAndroid.show( "Error deleting review, please try again later", ToastAndroid.SHORT);

    }
}

export async function editReview(reviewId, rating, review, reviews, setEditReviewId) {
    try {
        await updateDoc(doc(db, "reviews", reviewId), {
            rating,
            comment: review,
            edit: 'Edited..'
        });

        const updatedReviews = reviews.map((r) => {
            if (r.id === reviewId) {
                return { ...r, rating, comment: review, edit: 'Edited..' };
            }
            return r;
        });

        setEditReviewId(null);

        ToastAndroid.show( "Review updated", ToastAndroid.SHORT);

    } catch (error) {
        console.error("Error updating review: ", error);
        Toast.show({
            type: ALERT_TYPE.WARNING,
            textBody: "Error updating review, please try again later",
            autoClose: 2000,
            titleStyle: {
                color: '#657786',
            },
            textBodyStyle: {
                color: '#657786',
            },
        });
    }
}

export async function submitReview(product, review, rating, user, reviews, setHasSubmittedReview) {
    if (!review || !rating) {
        ToastAndroid.show("Please enter a rating and a review.", ToastAndroid.SHORT);

        return;
    }

    try {
        const reviewDocRef = await addDoc(collection(db, "reviews"), {
            productId: product.id,
            productName: product.name,
            name: user.displayName,
            rating,
            comment: review,
            createdAt: new Date().toISOString(),
            photoUrl: user.photoURL,
            pass: user.email,
            edit: ''
        });

  
        ToastAndroid.show("Review submitted", ToastAndroid.SHORT);


        setHasSubmittedReview(true);

    } catch (error) {
        console.error("Error submitting review: ", error);
        Toast.show({
            type: ALERT_TYPE.ERROR,
            textBody: "Error submitting review, please try again later",
            autoClose: 2000,
            titleStyle: {
                color: '#657786',
            },
            textBodyStyle: {
                color: '#657786',
            },
        });
    }
}

export function fetchReviews(productId, setReviews) {
    const reviewsRef = collection(db, "reviews");
    const reviewsQuery = query(reviewsRef, where("productId", "==", productId));

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
        const reviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setReviews(reviews);

    });

    return unsubscribe;
}



export const fetchAllReviews = (setReviews, setLoading) => {
    const reviewsCollectionRef = collection(db, 'reviews');
    const unsubscribe = onSnapshot(reviewsCollectionRef, (querySnapshot) => {
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
            const reviewData = doc.data();
            reviewData.id = doc.id; // add the document ID to the review object
            reviewsData.push(reviewData);
        });
        setReviews(reviewsData);
        setLoading(false);
    });

    return unsubscribe;
};
