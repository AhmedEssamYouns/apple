import { collection, doc, deleteDoc, updateDoc, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./config";
import { Toast, ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


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
        Toast.show({
            type: ALERT_TYPE.ERROR,
            textBody: "Error deleting review, please try again later",
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

        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            textBody: "Review updated",
            autoClose: 2000,
            titleStyle: {
                color: '#657786',
            },
            textBodyStyle: {
                color: '#657786',
            },
        });
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
        Toast.show({
            type: ALERT_TYPE.WARNING,
            textBody: "Please enter a rating and a review.",
            autoClose: 2000,
            titleStyle: {
                color: '#657786',
            },
            textBodyStyle: {
                color: '#657786',
            },
        });
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

        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            textBody: "Review submitted",
            autoClose: 2000,
            titleStyle: {
                color: '#657786',
            },
            textBodyStyle: {
                color: '#657786',
            },
        });

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
