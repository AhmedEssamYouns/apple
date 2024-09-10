import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, KeyboardAvoidingView } from 'react-native';
import ReviewList from '../../components/Review/Review-list';
import ReviewInput from '../../components/Review/Review-input';
import { fetchReviews, deleteReview, editReview, submitReview } from '../../firebase/review';
import { handleAddToCart } from '../../firebase/cart';
import { FIREBASE_AUTH } from '../../firebase/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import ProductView from '../../components/products/Product-view';
import { addToFavorites } from '../../firebase/products';
import { fetchOrders } from '../../firebase/mange-orders'
const ProductScreen = () => {
    const route = useRoute();
    const { product } = route.params || {};
    const productId = product.id;
    const user = FIREBASE_AUTH.currentUser;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editReviewId, setEditReviewId] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const unsubscribe = fetchOrders(setOrders, setLoading);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = fetchReviews(productId, (newReviews) => {
            setReviews(newReviews);
            setLoading(false);

            if (newReviews.length > 0) {
                const totalRating = newReviews.reduce((sum, review) => sum + review.rating, 0);
                const average = totalRating / newReviews.length;
                setAverageRating(average);
            } else {
                setAverageRating(0);
            }
        });
        return () => unsubscribe();
    }, [productId]);

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleReview = async () => {
        try {
            await submitReview(product, review, rating, user, reviews,orders, setHasSubmittedReview);
            setReview('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleEditReview = async () => {
        try {
            await editReview(editReviewId, rating, review, reviews, setEditReviewId);
            setReview('');
            setRating(0);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleCancelEditing = () => {
        setEditReviewId(null);
        setRating(0);
        setReview('');
    };

    const navigation = useNavigation();

    if (loading) {
        return <ActivityIndicator size="large" style={{ top: 40 }} color={Colors.primary} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <ProductView
                product={product}
                navigation={navigation}
                addToFavorites={() => { addToFavorites(product) }}
                handleAddToCart={handleAddToCart}
                averageRating={averageRating}
            />
            <ReviewList
                reviews={reviews}
                user={user}
                setEditReviewId={setEditReviewId}
                setRating={setRating}
                setReview={setReview}
                handleDeleteReview={handleDeleteReview}
            />
            <ReviewInput
                rating={rating}
                setRating={setRating}
                review={review}
                setReview={setReview}
                handleReview={handleReview}
                handleEditReview={handleEditReview}
                handleCancelEditing={handleCancelEditing}
                editReviewId={editReviewId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    // Styles for ProductScreen
});

export default ProductScreen;
